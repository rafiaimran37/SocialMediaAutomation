function StatCard({ icon: Icon, label, value, badge, badgeClassName, cardClassName }) {
  return (
    <article
      className={`rounded-[1.5rem] border border-slate-200/80 p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)] ${cardClassName}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white text-blue-700 ring-1 ring-blue-100/80">
            <Icon className="h-4 w-4" />
          </div>
          <p className="text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-1 text-[2rem] font-semibold tracking-[-0.07em] text-slate-900">{value.toString().padStart(2, '0')}</p>
        </div>

        <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.04em] ${badgeClassName}`}>
          {badge}
        </span>
      </div>
    </article>
  )
}

export default StatCard