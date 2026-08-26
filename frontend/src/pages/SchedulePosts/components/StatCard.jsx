function StatCard({ icon: Icon, label, value, hint, toneClassName }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ring-inset ${toneClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-1 text-[2rem] font-semibold tracking-[-0.07em] text-slate-900">{value.toString().padStart(2, '0')}</p>
        </div>
        <p className="text-right text-xs font-medium leading-5 text-slate-400">{hint}</p>
      </div>
    </article>
  )
}

export default StatCard