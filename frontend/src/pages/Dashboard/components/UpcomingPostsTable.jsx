function UpcomingPostsTable({ rows }) {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100/90 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">Upcoming Scheduled Posts</h2>
        </div>
        <button type="button" className="text-sm font-semibold text-blue-700 transition hover:text-blue-800">
          View All
        </button>
      </div>

     <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white text-[0.72rem] uppercase tracking-[0.12em] text-slate-400">
              <th className="px-5 py-3.5 font-semibold">Date &amp; Time</th>
              <th className="px-5 py-3.5 font-semibold">Platform</th>
              <th className="px-5 py-3.5 font-semibold">Content Preview</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100/90 last:border-0 hover:bg-slate-50/70">
                <td className="px-5 py-4 text-sm font-medium text-slate-700">{row.dateTime}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.12em] ${platformTone(row.platform)}`}>
                    {row.platform.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm leading-6 text-slate-600">{row.contentPreview}</td>
                <td className="px-5 py-4 text-sm font-medium text-blue-700">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.08)]" />
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function platformTone(platform) {
  if (platform === 'facebook') {
    return 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
  }

  if (platform === 'linkedin') {
    return 'bg-sky-50 text-sky-700 ring-1 ring-sky-100'
  }

  return 'bg-rose-50 text-rose-600 ring-1 ring-rose-100'
}

export default UpcomingPostsTable