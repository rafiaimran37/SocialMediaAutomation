function PreviewPanel({ previewPost, metrics }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <span className="text-sm font-semibold text-slate-700">{previewPost.accountName.slice(0, 1)}</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{previewPost.accountName}</h2>
          <p className="text-xs text-slate-500">{previewPost.scheduleLabel}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="aspect-[4/3] bg-[linear-gradient(135deg,rgba(241,245,249,0.9),rgba(219,234,254,0.7))]" />
          <div className="space-y-2 px-4 py-4">
            <div className="h-3 w-3/4 rounded-full bg-slate-200" />
            <div className="h-3 w-2/3 rounded-full bg-slate-200" />
            <div className="h-3 w-1/2 rounded-full bg-blue-100" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">{metric.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PreviewPanel