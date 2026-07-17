function FiltersBar({ filters }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Filters</h2>
          <p className="mt-1 text-sm text-slate-500">Refine the schedule queue before publishing</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <label key={filter.id} className="grid gap-2 text-sm font-medium text-slate-600">
              <span>{filter.label}</span>
              <select className="min-w-44 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100" defaultValue={filter.value}>
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {formatOption(option)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}

function formatOption(option) {
  return option
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export default FiltersBar