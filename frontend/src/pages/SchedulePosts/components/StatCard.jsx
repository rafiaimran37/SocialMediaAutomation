function StatCard({ icon: Icon, label, value, hint, toneClassName }) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-[2rem] font-semibold tracking-[-0.06em] text-slate-900">{value.toString().padStart(2, '0')}</p>
        </div>
        <p className="text-xs font-medium text-slate-400">{hint}</p>
      </div>
    </article>
  )
}

export default StatCard