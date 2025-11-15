import {cacheTag} from "next/cache";
import {Suspense} from "react";

import {BlogPost, getBlogPostBySlug, getBlogPosts, getFeaturedBlogPosts} from "@/api";

import BlogPosts, {BlogPostsSkeleton} from "@/components/blog-posts";

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post: BlogPost) => ({slug: post.slug}));
}

async function getCachedBlogPostBySlug(slug: string) {
  "use cache";

  cacheTag(slug);
  //   cacheTag(slug) = "Next, guarda el resultado de esta página bajo el tag = slug".

  const post = await getBlogPostBySlug(slug);

  return post;
}

async function FeaturedPosts() {
  const featuresPosts = await getFeaturedBlogPosts();

  return <BlogPosts posts={featuresPosts} />;
}

export default async function BlogPostPage({params}: {params: {slug: string}}) {
  const {slug} = params;
  //
  const post = await getCachedBlogPostBySlug(slug);

  if (!post) {
    return <div>No existe un post con el slug {slug}</div>;
  }

  return (
    <main className="container mx-auto flex flex-col gap-8 px-4 py-8">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-muted-foreground">{post.content}</p>
      <Suspense fallback={<BlogPostsSkeleton />}>
        <FeaturedPosts />
      </Suspense>
    </main>
  );
}
