export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-pink dark:text-blue-lighter">
      <div className="max-w-xs text-center">
        <h1 className="mb-8 text-5xl font-bold uppercase">Error 404</h1>
        <h2 className="mb-4 font-bold">Page Not Found</h2>
        <p>
          The URL you used doesn't exist.
          <br />
          Honestly it might be a skill issue.
        </p>
      </div>
    </div>
  );
}
