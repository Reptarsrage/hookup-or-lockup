export default function Error() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-pink dark:text-blue-lighter">
      <div className="max-w-xs text-center">
        <h1 className="mb-8 text-5xl font-bold uppercase">Error 500</h1>
        <h2 className="mb-4 font-bold">Internal Server Error</h2>
        <p>
          RIP BOZO. Refresh this page.
          <br />
          Or try again later.
        </p>
      </div>
    </div>
  );
}
