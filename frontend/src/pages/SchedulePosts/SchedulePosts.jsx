import { ChevronRight, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { schedulePostsData } from './schedulePostsData'
import StatCard from './components/StatCard'
import FiltersBar from './components/FiltersBar'
import SchedulePostsTable from './components/SchedulePostsTable'
import QuickActionCard from './components/QuickActionCard'

function SchedulePosts() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Schedule Posts
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-[1.05rem]">
            Organize upcoming content, review approval states, and keep the publishing queue ready for API-driven automation.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/add-schedule')}
            className="inline-flex h-14 items-center gap-3 rounded-2xl border border-blue-700 bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create Schedule
          </button>
          <button
            type="button"
            className="inline-flex h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
            Bulk Import
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {schedulePostsData.stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </section>

      <FiltersBar filters={schedulePostsData.filters} />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <SchedulePostsTable rows={schedulePostsData.posts} />

        <aside className="grid gap-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-slate-500">Reusable actions wired for future API operations</p>
            <div className="mt-5 grid gap-3">
              {schedulePostsData.quickActions.map((action) => (
                <QuickActionCard key={action.id} {...action} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">API Ready</p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">Structured for FastAPI integration</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              All data lives in a single exported object so the page can be swapped with live responses later without changing the UI structure.
            </p>
          </div>
        </aside>
      </section>
    </div>
  )
}

export default SchedulePosts