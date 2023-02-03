import type { PostWithImageAndStats } from "~/models/post.server";

interface PostProps {
  post: PostWithImageAndStats;
  decision: number;
}

function Post({ post, decision }: PostProps) {
  return (
    <>
      <div className="relative flex-1">
        {/* Pic */}
        <div
          className="h-full w-full bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url("${post.image}")` }}
        />

        {/* Name */}
        <h4 className="absolute bottom-0 left-0 m-0 w-full bg-gradient-to-t from-black p-2 text-2xl font-bold">
          {post.title}
        </h4>

        {/* Oh No! */}
        {decision < 0 && (
          <div
            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center"
            style={{ opacity: Math.abs(decision) }}
          >
            <img width="128" height="128" src="/oh-no.svg" alt="Oh No" />
            <span className="text-4xl font-bold uppercase text-blue-dark">
              Oh No!
            </span>
          </div>
        )}

        {/* Ay Yo! */}
        {decision > 0 && (
          <div
            className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center"
            style={{ opacity: Math.abs(decision) }}
          >
            <img width="128" height="128" src="/ay-yo.svg" alt="Ay Yo" />
            <span className="text-4xl font-bold uppercase text-red">
              Ay Yo!
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="max-h-40 overflow-y-auto px-4">
        <p className="text-base text-black">{post.description}</p>
      </div>
    </>
  );
}

export default Post;
