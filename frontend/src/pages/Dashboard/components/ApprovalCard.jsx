function ApprovalCard({ title, description, actionLabel, accent }) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-blue-50 ring-1 ring-slate-200/70" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className={`rounded-md px-3 py-1.5 text-[0.72rem] font-semibold text-white transition hover:opacity-95 ${accent}`}>
            {actionLabel}
          </button>
          <button type="button" className="rounded-md bg-slate-100 px-3 py-1.5 text-[0.72rem] font-semibold text-slate-700 transition hover:bg-slate-200">
            Reject
          </button>
        </div>
      </div>
    </article>
  )
}

export default ApprovalCard