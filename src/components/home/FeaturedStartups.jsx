import Link from "next/link";

export default function FeaturedStartups({ startups = [] }) {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Featured Startups</h2>
          <p className="text-gray-500 text-sm mt-1">Discover promising startups building the future</p>
        </div>
        <Link href="/browse-startups" className="text-blue-600 font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.slice(0, 3).map((startup) => (
          <div
            key={startup._id || startup.id}
            className="border dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white dark:bg-slate-900"
          >
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {startup.industry}
              </span>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                {startup.startup_name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Founder: <span className="font-medium text-slate-700 dark:text-gray-300">{startup.founder_name}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs text-gray-500">Team Needed:</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-gray-200">
                {startup.team_size_needed} Members
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}