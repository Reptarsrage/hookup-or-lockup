import { PrismaClient } from "@prisma/client";

import * as api from "../app/api.server";

const prisma = new PrismaClient();

async function seed() {
  // Remove existing posts
  await prisma.post.deleteMany();

  // Fetch and app all posts
  // TODO: paging
  const posts = await api.fetchPosts();
  await Promise.all(
    posts.posts.map((post) =>
      prisma.post.create({
        data: {
          id: post.id,
          smashes: 0,
          passes: 0,
        },
      })
    )
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
