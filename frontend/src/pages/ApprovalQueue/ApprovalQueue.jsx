import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Eye, FilePlus2, Grid2x2, List, PencilLine, Sparkles } from 'lucide-react'
import { approvalQueueData } from './approvalQueueData'

function ApprovalQueue() {
  const [viewMode, setViewMode] = useState('grid')

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 text-slate-900">
      <section className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
            Pending Review
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-[0.95rem]">
            There are {approvalQueueData.summary.pendingCount} posts waiting for your approval today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'grid' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid2x2 className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'list' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(220px,0.9fr)]">
        {approvalQueueData.approvals.map((approval) => (
          <article
            key={approval.id}
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
              approval.featured ? 'border-blue-200' : 'border-slate-200/70'
            }`}
          >
            <div className="relative">
              <div className="h-52 bg-[linear-gradient(135deg,rgba(226,232,240,0.9),rgba(191,219,254,0.65))]" />
              {approval.tag ? (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-700 px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-blue-700/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  {approval.tag}
                </span>
              ) : null}
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold text-slate-600 shadow-sm backdrop-blur">
                <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                {approval.scheduledAt}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <p className="line-clamp-3 text-sm leading-6 text-slate-600">{approval.summary}</p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {approval.author.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{approval.author.name}</p>
                    <p className="text-[0.72rem] uppercase tracking-[0.16em] text-slate-400">{approval.author.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <button type="button" className="rounded-full p-2 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Edit approval">
                    <PencilLine className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full p-2 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Preview approval">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.28)] transition hover:brightness-105"
                >
                  Approve
                </button>
              </div>
            </div>
          </article>
        ))}

        <button
          type="button"
          className="flex min-h-[calc(100%-2px)] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-8 text-center text-slate-500 transition hover:border-blue-300 hover:bg-blue-50/40"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-blue-700">
            <FilePlus2 className="h-8 w-8" />
          </span>
          <span className="mt-5 text-lg font-semibold text-slate-700">Create New Request</span>
          <span className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Draft a new post for internal review and approval.
          </span>
        </button>
      </section>

      <section className="border-t border-slate-200 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {approvalQueueData.summary.shownCount} of {approvalQueueData.summary.pendingCount} pending requests
          </p>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Page 1 of 4
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ApprovalQueue