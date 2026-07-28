export default function StartupStats() {
  const stats = [
    { label: "Active Startups", value: "500+" },
    { label: "Open Opportunities", value: "1,200+" },
    { label: "Matched Collaborators", value: "3,500+" },
    { label: "Success Rate", value: "94%" },
  ];

  return (
    <section className="py-16 bg-blue-600 text-white px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-4xl font-extrabold">{stat.value}</h3>
            <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}