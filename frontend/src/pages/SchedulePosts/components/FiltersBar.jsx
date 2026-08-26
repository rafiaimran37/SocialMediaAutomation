function FiltersBar({
  filters,
  platformFilter,
  setPlatformFilter,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter
}) {


  const getValue = (filter) => {

    if(filter.id === "platform-filter")
      return platformFilter;

    if(filter.id === "status-filter")
      return statusFilter;

    if(filter.id === "date-filter")
      return dateFilter;

  };


  const handleChange = (filter, value) => {

    if(filter.id === "platform-filter")
      setPlatformFilter(value);


    if(filter.id === "status-filter")
      setStatusFilter(value);


    if(filter.id === "date-filter")
      setDateFilter(value);

  };


  return (
    <section className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
            Filters
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Refine the schedule queue before publishing
          </p>

        </div>


        <div className="flex flex-wrap gap-3">


          {filters.map((filter)=>(

            <label
              key={filter.id}
              className="grid gap-2 text-sm font-medium text-slate-600"
            >

              <span>{filter.label}</span>


              <select

                value={getValue(filter)}

                onChange={(e)=>handleChange(filter,e.target.value)}

                className="min-w-44 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"

              >

                {filter.options.map((option)=>(

                  <option
                    key={option}
                    value={option}
                  >

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



function formatOption(option){

  return option
    .split('_')
    .map(
      segment =>
      segment.charAt(0).toUpperCase()+segment.slice(1)
    )
    .join(' ')

}


export default FiltersBar;