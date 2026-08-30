export default function StartupStats() {
  const stats = [
    { label: "Active Startups", value: "500+" },
    { label: "Open Opportunities", value: "1,200+" },
    { label: "Matched Collaborators", value: "3,500+" },
    { label: "Success Rate", value: "94%" },
  ];

  return (
    <section className="bg-slate-100 px-4 py-12 transition-colors duration-200 dark:bg-slate-900 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <h3 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-4xl md:text-5xl">
                {stat.value}
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}