import Link from "next/link";

export default function FeaturedOpportunities({ opportunities = [] }) {
  return (
    <section className="py-16 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Featured Opportunities</h2>
            <p className="text-gray-500 text-sm mt-1">Apply to open roles and join dynamic teams</p>
          </div>
          <Link href="/browse-opportunities" className="text-blue-600 font-medium hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.slice(0, 3).map((item) => (
            <div
              key={item._id || item.id}
              className="border dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                  {item.role_title}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-4">{item.startup_name}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {item.required_skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs text-gray-500">
                <span>Deadline:</span>
                <span className="font-semibold text-rose-500">
                  {new Date(item.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}