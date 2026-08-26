import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Filter, Eye, FilePlus2, Grid2x2, List, PencilLine, Sparkles } from 'lucide-react'
import { approveApprovalQueueItem, getApprovalQueue, rejectApprovalQueueItem } from '../../services/approvalQueueService'

function ApprovalQueue() {
  const [viewMode, setViewMode] = useState('grid')
  const [approvals, setApprovals] = useState([])

  useEffect(() => {
    const loadApprovals = async () => {
      try {
        const data = await getApprovalQueue()
        setApprovals(Array.isArray(data) ? data : [])
      }
      catch (error) {
        console.log('Approval Queue load error:', error)
        setApprovals([])
      }
    }

    loadApprovals()
  }, [])

  const approvalCount = approvals.length

  const approvalCards = useMemo(() => {
    return approvals.map((approval, index) => ({
      ...approval,
      cardTone: getStatusTone(approval.Status, index),
    }))
  }, [approvals])

  const handleApprove = async (approvalId) => {
    try {
      await approveApprovalQueueItem(approvalId)
      setApprovals((current) =>
        current.map((approval) =>
          approval.Id === approvalId
            ? { ...approval, Status: 'Approved' }
            : approval,
        ),
      )
    }
    catch (error) {
      console.log('Approve approval error:', error)
    }
  }

  const handleReject = async (approvalId) => {
    try {
      await rejectApprovalQueueItem(approvalId)
      setApprovals((current) =>
  current.filter((approval) => approval.Id !== approvalId),
)
    }
    catch (error) {
      console.log('Reject approval error:', error)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 text-slate-900">
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur xl:flex-row xl:items-start xl:justify-between xl:px-8 xl:py-7">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl">
            Pending Review
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[0.95rem]">
            There are {approvalCount} posts waiting for your approval today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'grid' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid2x2 className="h-4 w-4" />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                viewMode === 'list' ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>

          {/* <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button> */}
        </div>
      </section>

      <section className={viewMode === 'grid' ? 'grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(220px,0.9fr)]' : 'grid gap-4'}>
        {approvalCards.map((approval) => (
          <article
            key={approval.Id}
            className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-[0_14px_36px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)] ${
              approval.cardTone
            }`}
          >
            <div className="relative">
              <div className="h-52 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(219,234,254,0.7))]" />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-semibold text-slate-600 shadow-sm backdrop-blur ring-1 ring-white/60">
                <CalendarDays className="h-3.5 w-3.5 text-blue-600" />
                {formatApprovalDate(approval.CreatedAt)}
              </div>
              <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-3 py-1 text-[0.67rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)]">
                <Sparkles className="h-3.5 w-3.5" />
                {approval.Platform}
              </div>
            </div>

            <div className="space-y-4 p-4">
              <p className="line-clamp-3 text-sm leading-6 text-slate-600">{approval.Message}</p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/70">
                    {getPlatformInitials(approval.Platform)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.01em] text-slate-900">{approval.Platform}</p>
                    <p className="text-[0.72rem] uppercase tracking-[0.16em] text-slate-400">{approval.Status}</p>
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
                  onClick={() => handleReject(approval.Id)}
                  disabled={approval.Status !== 'Pending'}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:shadow-md disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(approval.Id)}
                  disabled={approval.Status !== 'Pending'}
                  className="flex-1 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.28)] transition hover:brightness-105 disabled:opacity-50"
                >
                  Approve
                </button>
              </div>
            </div>
          </article>
        ))}

        <button
          type="button"
          className="flex min-h-[calc(100%-2px)] flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white px-6 py-8 text-center text-slate-500 transition hover:border-blue-300 hover:bg-blue-50/40"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-blue-700 shadow-[0_10px_20px_rgba(37,99,235,0.10)]">
            <FilePlus2 className="h-8 w-8" />
          </span>
          <span className="mt-5 text-lg font-semibold tracking-[-0.02em] text-slate-700">Create New Request</span>
          <span className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
            Draft a new post for internal review and approval.
          </span>
        </button>
      </section>

      <section className="border-t border-slate-200 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Showing {approvalCount} of {approvalCount} pending requests
          </p>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-700 hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="rounded-full bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.20)]">
              Page 1 of 1
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-700 hover:shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function formatApprovalDate(dateValue) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return 'Recently'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function getPlatformInitials(platform) {
  const value = String(platform ?? '')

  if (!value) {
    return 'AP'
  }

  return value.slice(0, 2).toUpperCase()
}

function getStatusTone(status, index) {
  const normalized = String(status ?? '').toLowerCase()

  if (normalized === 'pending') {
    return 'border-slate-200/70'
  }

  if (normalized === 'approved') {
    return 'border-emerald-200'
  }

  if (normalized === 'rejected') {
    return 'border-rose-200'
  }

  return index % 2 === 0 ? 'border-slate-200/70' : 'border-blue-200'
}

export default ApprovalQueue