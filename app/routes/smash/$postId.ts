import type { ActionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { hasPost, smash } from "~/models/post.server";

export const action = async ({ request, params }: ActionArgs) => {
  if (request.method !== "PATCH") {
    throw json("Method Not Supported", { status: 415 });
  }

  const postId = params.postId;
  if (!postId) {
    throw json("Bad Request", { status: 400 });
  }

  const id = parseInt(postId, 10);
  if (isNaN(id)) {
    throw json("Bad Request", { status: 400 });
  }

  const exists = await hasPost(id);
  if (!exists) {
    throw json("Not Found", { status: 404 });
  }

  const post = await smash(id);
  return json(post, 200);
};
