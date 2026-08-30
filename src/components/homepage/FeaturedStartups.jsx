import Link from "next/link";

export default function FeaturedStartups({ startups = [] }) {
  return (
    <section className="bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Startups
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Discover promising startups building the future
            </p>
          </div>
          <Link
            href="/browse-startups"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {/* CONTENT GRID / EMPTY STATE */}
        {!startups || startups.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No startups featured yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check back soon to explore upcoming companies.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups.slice(0, 3).map((startup) => {
              const startupId = startup._id || startup.id;

              return (
                <div
                  key={startupId}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      {startup.industry || "General"}
                    </span>
                    <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                      {startup.startup_name || "Untitled Startup"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Founder:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {startup.founder_name || "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">
                      Team Needed:
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {startup.team_size_needed ?? 0} Members
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}