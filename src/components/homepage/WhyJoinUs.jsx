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
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">
        Why Join StartupForge?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="p-8 border dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-center shadow-sm"
          >
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}