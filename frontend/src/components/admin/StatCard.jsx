function StatCard({ title, value, icon }) {
  const Icon = icon;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;