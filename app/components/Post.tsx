import type { PostWithImageAndStats } from "~/models/post.server";

interface PostProps {
  post: PostWithImageAndStats;
}

function Post({ post }: PostProps) {
  return (
    <>
      <div className="relative">
        <img className="drag-none w-full" src={post.image} alt={post.title} />
        <h4 className="absolute bottom-0 left-0 m-0 w-full bg-gradient-to-t from-black p-2 text-2xl font-bold">
          {post.title}
        </h4>
      </div>

      <div className="overflow-y-auto px-4">
        <p className="text-base text-black">{post.description}</p>
      </div>
    </>
  );
}

export default Post;
