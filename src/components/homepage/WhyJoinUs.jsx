export default function WhyJoinUs() {
  const features = [
    {
      title: "For Founders",
      desc: "Find vetted developers, designers, and marketers who share your passion and vision.",
      icon: "🚀",
    },
    {
      title: "For Collaborators",
      desc: "Gain real-world experience, build high-impact projects, and earn startup equity.",
      icon: "💼",
    },
    {
      title: "Secure Platform",
      desc: "Transparent applications, verified roles, and direct communication channels.",
      icon: "🛡️",
    },
  ];

  return (
    <section className="bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Why Join StartupForge?
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Empowering visionaries and builders to collaborate seamlessly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl dark:bg-indigo-950/60">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}