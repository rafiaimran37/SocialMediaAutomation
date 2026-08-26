function ActivityChart({ data, labels }) {

  const maxValue = Math.max(...data, 1)


  return (

    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">


      <div className="flex items-center justify-between gap-4">

        <div>

          <h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">
            Publishing Activity
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Visual overview of your cross-platform content output
          </p>

        </div>


        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium text-slate-500">

          <span className="rounded-full bg-white px-3 py-1.5 text-slate-900 shadow-sm ring-1 ring-slate-200/70">
            Week
          </span>

          <span className="px-3 py-1.5">
            Month
          </span>

          <span className="px-3 py-1.5">
            Year
          </span>

        </div>


      </div>




      <div className="mt-5 rounded-[1.25rem] border border-slate-200/70 bg-gradient-to-b from-slate-50 to-white p-4">


        <div className="flex h-72 items-end gap-2 rounded-2xl border-b border-slate-200 px-3 pb-4 pt-4">


          {
            data.map((value,index)=>{


              const height =
                value === 0
                ?
                8
                :
                Math.max(
                  25,
                  (value / maxValue) * 220
                )


              const isEmphasized =
                index === 1 || index === 2



              return (

                <div
                  key={labels[index]}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >


                  <div

                    className={

                      `w-full rounded-t-lg transition-all duration-300 ${
                        
                        isEmphasized
                        ?
                        'bg-blue-500'
                        :
                        'bg-blue-200'

                      }`

                    }


                    style={{
                      height:`${height}px`
                    }}

                  />


                  <span className="text-xs text-slate-500">
                    {labels[index]}
                  </span>


                </div>

              )


            })
          }


        </div>


      </div>


    </div>

  )

}


export default ActivityChart