import { animated, useTransition } from "@react-spring/web";
import clsx from "clsx";
import type { PostWithImageAndStats } from "~/models/post.server";

type ConfirmModalProps = {
  open: boolean;
  decision: number;
  post: PostWithImageAndStats;
  onConfirmed: (confirmed: boolean) => void;
};

function ConfirmModal({
  open,
  onConfirmed: closeModal,
  post,
  decision,
}: ConfirmModalProps) {
  const modalTransitions = useTransition(open, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  function onCancelled() {
    closeModal(false);
  }

  function onConfirmed() {
    closeModal(true);
  }

  return (
    <>
      {/* Backdrop */}
      {modalTransitions(
        (style, item) =>
          item && (
            <>
              <animated.div
                style={style}
                className="bg-black bg-opacity-50 fixed top-0 left-0 h-full w-full z-20 backdrop-blur-md"
              />
            </>
          ),
      )}

      {/* Modal */}
      {modalTransitions(
        (style, item) =>
          item && (
            <div className="fixed top-0 h-full w-full left-0  z-30 flex items-center justify-center">
              <animated.div
                style={style}
                className="relative flex h-full w-full flex-col overflow-hidden bg-white text-black shadow-xl md:h-auto md:w-[400px] md:rounded-xl"
              >
                <div className="flex-1 flex-col p-4 md:p-8">
                  <div className="text-center text-3xl md:text-xl">
                    You guessed {post.title} is
                    <b
                      className={clsx(
                        decision < 0 ? "text-blue-light" : "text-red",
                      )}
                    >
                      {decision > 0 ? " not in jail" : " in jail "}
                    </b>
                  </div>
                  <div
                    className="mx-auto my-8 h-48 w-48 rounded-full bg-cover bg-top bg-no-repeat"
                    style={{ backgroundImage: `url("${post.image}")` }}
                  />
                  <div className="text-center text-3xl md:text-xl">
                    Is that correct?
                  </div>
                </div>

                <div className="flex w-full flex-row">
                  <button
                    className="w-1/2 cursor-pointer border-none bg-gray px-8 py-6 text-lg font-medium text-white outline-none transition-opacity duration-300 hover:bg-gray-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
                    disabled={!open}
                    onClick={onCancelled}
                  >
                    No
                  </button>
                  <button
                    className="w-1/2 cursor-pointer border-none bg-pink px-8 py-6 text-lg font-medium text-white outline-none transition-opacity duration-300 hover:bg-pink-light disabled:cursor-not-allowed disabled:opacity-30 disabled:blur-sm"
                    disabled={!open}
                    onClick={onConfirmed}
                  >
                    Yes
                  </button>
                </div>
              </animated.div>
            </div>
          ),
      )}
    </>
  );
}

export default ConfirmModal;
