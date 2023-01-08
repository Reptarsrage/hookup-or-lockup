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
  totalVotes: number;
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
  const notFound = new Set<number>();
  const postsWithImageAndStats: PostWithImageAndStats[] = medias.map(
    (media) => {
      const post = posts.find((post) => post.id === media.postId);
      const stat = stats.find((post) => post.id === media.postId);
      const smashes = stat?.smashes ?? 0;
      const passes = stat?.passes ?? 0;

      if (!stat) {
        notFound.add(media.postId);
      }

      invariant(post, "Post not found");

      return {
        id: post.id,
        title: convert(post.title),
        description: convert(post.description),
        lockedUp: post.lockedUp,
        image: media.sourceUrl,
        smashes,
        passes,
        totalVotes: passes + smashes,
      };
    }
  );

  // Add missing posts to db
  await Promise.all(
    [...notFound].map((id) =>
      prisma.post.create({
        data: {
          id,
          smashes: 0,
          passes: 0,
        },
      })
    )
  );

  return {
    page,
    limit,
    total,
    totalPages,
    posts: postsWithImageAndStats,
  };
}

export async function hasPost(id: Post["id"]) {
  const post = await prisma.post.findFirst({ where: { id } });
  return !!post;
}

export async function smash(id: Post["id"]) {
  return await prisma.post.update({
    where: { id },
    data: {
      smashes: {
        increment: 1,
      },
    },
  });
}

export async function pass(id: Post["id"]) {
  return await prisma.post.update({
    where: { id },
    data: {
      passes: {
        increment: 1,
      },
    },
  });
}
