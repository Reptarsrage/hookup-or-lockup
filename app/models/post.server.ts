import type { Post } from "@prisma/client";
import { convert } from "html-to-text";
import invariant from "tiny-invariant";

import { prisma } from "~/db.server";
import { fetchPosts, fetchMedias } from "~/api.server";

export type { Post } from "@prisma/client";

export interface PostWithImageAndStats {
  id: number;
  title: string;
  description: string;
  lockedUp: boolean;
  image: string;
  smashes: number;
  passes: number;
}

export interface Page {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  posts: PostWithImageAndStats[];
}

export async function getPosts(
  page: number = 1,
  limit: number = 10
): Promise<Page> {
  // Fetch page of posts
  const { posts, total, totalPages } = await fetchPosts(page, limit);
  const mediaIds = posts.map((post) => post.imageId);
  const postIds = posts.map((post) => post.id);

  // Fetch stats and images for posts
  const [medias, stats] = await Promise.all([
    fetchMedias(mediaIds),
    prisma.post.findMany({ where: { id: { in: postIds } } }),
  ]);

  // Combine
  const postsWithImageAndStats: PostWithImageAndStats[] = medias.map(
    (media, i) => {
      const post = posts.find((post) => post.id === media.postId);
      const stat = stats.find((post) => post.id === media.postId);

      invariant(post, "Post not found");

      return {
        id: post.id,
        title: convert(post.title),
        description: convert(post.description),
        lockedUp: post.lockedUp,
        image: media.sourceUrl,
        smashes: stat?.smashes ?? 0,
        passes: stat?.passes ?? 0,
      };
    }
  );

  return {
    page,
    limit,
    total,
    totalPages,
    posts: postsWithImageAndStats,
  };
}

export async function patchSmash(id: Post["id"]) {
  return prisma.post.update({
    where: { id },
    data: {
      smashes: {
        increment: 1,
      },
    },
  });
}

export async function patchPass(id: Post["id"]) {
  return prisma.post.update({
    where: { id },
    data: {
      passes: {
        increment: 1,
      },
    },
  });
}
