function UpcomingPostsTable({ rows }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Upcoming Scheduled Posts</h2>
        </div>
        <button type="button" className="text-sm font-medium text-blue-700 transition hover:text-blue-800">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-[0.72rem] uppercase tracking-[0.08em] text-slate-400">
              <th className="px-5 py-3 font-medium">Date &amp; Time</th>
              <th className="px-5 py-3 font-medium">Platform</th>
              <th className="px-5 py-3 font-medium">Content Preview</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-4 text-sm text-slate-700">{row.dateTime}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-md px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.08em] ${platformTone(row.platform)}`}>
                    {row.platform.toUpperCase()}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{row.contentPreview}</td>
                <td className="px-5 py-4 text-sm font-medium text-blue-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
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
    return 'bg-blue-50 text-blue-600'
  }

  if (platform === 'linkedin') {
    return 'bg-sky-50 text-sky-600'
  }

  return 'bg-rose-50 text-rose-500'
}

export default UpcomingPostsTable