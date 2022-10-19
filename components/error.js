import Link from "next/link";

export function Error() {
  return (
    <section className="flex items-center h-full p-16">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
            <span className="sr-only">Error</span> 500
          </h2>
          <p className="text-2xl font-semibold md:text-3xl m-5">
            Sorry, we couldn&apos;t load this page.
          </p>
          <Link href={"/"}>
            <a
              rel="noopener noreferrer"
              className="px-8 py-3 font-semibold rounded dark:bg-primary text-white"
            >
              Back to homepage
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
