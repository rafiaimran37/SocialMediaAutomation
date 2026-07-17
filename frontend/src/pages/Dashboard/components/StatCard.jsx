function StatCard({ icon: Icon, label, value, badge, badgeClassName, cardClassName }) {
  return (
    <article
      className={`rounded-2xl border border-slate-200/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cardClassName}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200/80`}>
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-[0.76rem] font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-[2rem] font-semibold tracking-[-0.06em] text-slate-900">{value.toString().padStart(2, '0')}</p>
        </div>

        <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${badgeClassName}`}>
          {badge}
        </span>
      </div>
    </article>
  )
}

export default StatCard