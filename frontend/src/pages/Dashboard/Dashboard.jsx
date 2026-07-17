import { ChevronDown, CirclePlus, MessageCircleMore, Settings2 } from 'lucide-react'
import StatCard from './components/StatCard'
import ActivityChart from './components/ActivityChart'
import UpcomingPostsTable from './components/UpcomingPostsTable'
import ApprovalCard from './components/ApprovalCard'
import ActivityItem from './components/ActivityItem'
import { dashboardData } from './dashboardData'

function Dashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Welcome Rafia 
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400 sm:text-[1.05rem]">
            Your social ecosystem is performing <span className="font-semibold text-blue-700">14% better</span> than last week. Ready to scale your reach?
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <DashboardActionButton icon={MessageCircleMore} label="Generate AI Post" active />
          <DashboardActionButton icon={Settings2} label="Schedule" />
          <DashboardActionButton icon={CirclePlus} label="Connect" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboardData.stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
        <ActivityChart
          data={dashboardData.publishingActivity.data}
          labels={dashboardData.publishingActivity.labels}
        />

        <div className="grid gap-6">
          <PendingApprovalPanel approvals={dashboardData.pendingApprovals} />
          <RecentActivityPanel items={dashboardData.recentActivity} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
        <UpcomingPostsTable rows={dashboardData.upcomingPosts} />

        <div className="grid gap-6">
          <PendingApprovalPanel approvals={dashboardData.pendingApprovals} compact />
          <RecentActivityPanel items={dashboardData.recentActivity} />
        </div>
      </section>
    </div>
  )
}

function DashboardActionButton({ icon: Icon, label, active = false }) {
  return (
    <button
      type="button"
      className={`inline-flex h-14 items-center gap-3 rounded-2xl border px-5 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? 'border-blue-700 bg-blue-700 text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)]'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

function PendingApprovalPanel({ approvals, compact = false }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Pending Approvals</h2>
          {!compact ? <p className="mt-1 text-sm text-slate-500">Review posts before they go live</p> : null}
        </div>
        <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg shadow-blue-700/25 transition hover:scale-105">
          <ChevronDown className="h-5 w-5 rotate-[-90deg]" />
        </button>
      </div>

      <div className="mt-4 grid gap-4">
        {approvals.map((approval) => (
          <ApprovalCard key={approval.id} {...approval} />
        ))}
      </div>
    </section>
  )
}

function RecentActivityPanel({ items }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Recent Activity</h2>
      <ul className="mt-5 grid gap-5">
        {items.map((item) => (
          <ActivityItem key={item.id} {...item} />
        ))}
      </ul>
    </section>
  )
}

export default Dashboard