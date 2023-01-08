import type { PostWithImageAndStats } from "~/models/post.server";

interface PostProps {
  post: PostWithImageAndStats;
  decision: number;
}

function Post({ post, decision }: PostProps) {
  return (
    <>
      <div className="relative">
        <img className="drag-none w-full" src={post.image} alt={post.title} />
        <h4 className="absolute bottom-0 left-0 m-0 w-full bg-gradient-to-t from-black p-2 text-2xl font-bold">
          {post.title}
        </h4>
        {decision < 0 && (
          <div
            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center"
            style={{ opacity: Math.abs(decision) }}
          >
            <img width="128" height="128" src="/oh-no.svg" alt="Oh No" />
            <span className="text-4xl font-bold text-blue-dark">Oh No!</span>
          </div>
        )}
        {decision > 0 && (
          <div
            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center"
            style={{ opacity: Math.abs(decision) }}
          >
            <img width="128" height="128" src="/ay-yo.svg" alt="Ay Yo" />
            <span className="text-4xl font-bold text-red">Ay Yo!</span>
          </div>
        )}
      </div>

      <div className="overflow-y-auto px-4">
        <p className="text-base text-black">{post.description}</p>
      </div>
    </>
  );
}

export default Post;
