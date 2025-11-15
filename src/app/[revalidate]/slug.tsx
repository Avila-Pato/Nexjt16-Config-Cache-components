import type {NextRequest} from "next/server";

import {revalidateTag} from "next/cache";

export function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response(null, {status: 401}); // Unauthorized
  }

  if (!tag) {
    return new Response(null, {status: 400}); // Bad Request
  }

  revalidateTag(tag, "max");

  return Response.json({message: "Cache revalidated"});
}

// la url de la api es http://localhost:3000/api/revalidate?tag=slug&secret=secret
