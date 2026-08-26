function ApprovalCard({ title, description, actionLabel, accent }) {
  return (
    <article className="flex items-start gap-3 rounded-[1.35rem] border border-slate-200/80 bg-white p-3 shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] bg-gradient-to-br from-slate-100 via-white to-blue-50 ring-1 ring-slate-200/70" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold tracking-[-0.01em] text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={`rounded-full px-3.5 py-1.5 text-[0.72rem] font-semibold text-white transition hover:brightness-105 ${accent}`}>
            {actionLabel}
          </button>
          <button type="button" className="rounded-full bg-slate-100 px-3.5 py-1.5 text-[0.72rem] font-semibold text-slate-700 transition hover:bg-slate-200">
            Reject
          </button>
        </div>
      </div>
    </article>
  )
}

export default ApprovalCard