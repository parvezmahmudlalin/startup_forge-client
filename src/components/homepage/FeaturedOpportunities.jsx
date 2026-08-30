import Link from "next/link";

export default function FeaturedOpportunities({ opportunities = [] }) {
  // DATE FORMATTER HELPER
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Apply to open roles and join dynamic teams
            </p>
          </div>
          <Link
            href="/browse-opportunities"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {/* CONTENT GRID / EMPTY STATE */}
        {!opportunities || opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No opportunities available right now
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check back later for new openings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.slice(0, 3).map((item) => {
              const skills = Array.isArray(item.required_skills)
                ? item.required_skills
                : typeof item.required_skills === "string"
                ? item.required_skills.split(",").map((s) => s.trim())
                : [];

              const opportunityId = item._id || item.id;

              return (
                <div
                  key={opportunityId}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                      {item.role_title || "Untitled Role"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.startup_name || "Startup Name"}
                    </p>

                    {/* SKILLS */}
                    <div className="mb-6 mt-4 flex flex-wrap gap-1.5">
                      {skills.length > 0 ? (
                        skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No specific skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span>Deadline:</span>
                    <span className="font-semibold text-rose-500 dark:text-rose-400">
                      {formatDate(item.deadline)}
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