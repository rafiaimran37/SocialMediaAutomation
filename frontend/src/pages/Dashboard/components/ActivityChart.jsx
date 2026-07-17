function ActivityChart({ data, labels }) {
  const maxValue = Math.max(...data)

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Publishing Activity</h2>
          <p className="mt-1 text-sm text-slate-500">Visual overview of your cross-platform content output</p>
        </div>

        <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium text-slate-500">
          <span className="rounded-full bg-white px-3 py-1.5 text-slate-900 shadow-sm">Week</span>
          <span className="px-3 py-1.5">Month</span>
          <span className="px-3 py-1.5">Year</span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex h-72 items-end gap-1.5 rounded-2xl border-b border-slate-200 bg-[linear-gradient(to_top,rgba(96,165,250,0.02),transparent)] px-3 pb-4 pt-4 sm:gap-2 md:gap-3">
          {data.map((value, index) => {
            const height = Math.max(22, (value / maxValue) * 100)
            const isEmphasized = index === 4 || index === 9

            return (
              <div key={labels[index]} className="flex flex-1 flex-col items-center gap-3">
                <div
                  className={`w-full rounded-none ${isEmphasized ? 'bg-blue-500' : 'bg-blue-200'}`}
                  style={{ height: `${height}%` }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ActivityChart