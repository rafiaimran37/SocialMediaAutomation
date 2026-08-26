import { useEffect, useState } from 'react'
import { 
  ChevronDown,
  Eye,
  Filter,
  Heart,
  LineChart,
  MessageSquareText,
  MoreHorizontal,
  Repeat2,
  Search,
  Share2,
  Sparkles
} from 'lucide-react'
import { publishedPostsData } from './publishedPostsData'
import { getPublishedPosts } from '../../services/publishedPostService'


function PublishedPosts() {

  const [dateRange, setDateRange] = useState('Last 30 Days')

  const [platform, setPlatform] = useState('All Platforms')

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedPost, setSelectedPost] = useState(null)


  const [posts, setPosts] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

  const fetchPosts = async () => {

    try {

      const data = await getPublishedPosts()

      console.log("Published Posts:", data)

      setPosts(data)

    }
    catch(error){

      console.log(
        "Fetch Published Posts Error:",
        error
      )

    }
    finally{

      setLoading(false)

    }

  }


  fetchPosts()


}, [])

  const filteredPosts = posts.filter((post) => {
    const message = String(post.Message ?? '').toLowerCase()
    const postPlatform = String(post.Platform ?? '').toLowerCase()
    const searchValue = searchTerm.trim().toLowerCase()
    const matchesSearch = searchValue ? message.includes(searchValue) : true
    const matchesPlatform = platform === 'All Platforms' ? true : postPlatform === platform.toLowerCase()
    const postDate = new Date(post.CreatedAt)
    const daysBack = dateRange === 'Last 7 Days' ? 7 : dateRange === 'Last 30 Days' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysBack)
    const matchesDateRange = Number.isNaN(postDate.getTime()) ? true : postDate >= startDate

    return matchesSearch && matchesPlatform && matchesDateRange
  })
  
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 text-slate-900">
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur xl:flex-row xl:items-start xl:justify-between xl:px-8 xl:py-7">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Published Posts
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-[1.05rem]">
            Analyze the performance of your AI-generated content across all connected channels.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[520px] xl:justify-end">
          <SearchField value={searchTerm} onChange={setSearchTerm} />
          {/* <FilterSelect label="Date Range" value={dateRange} onChange={setDateRange} options={publishedPostsData.filters.dateRange} /> */}
          <FilterSelect label="Platform" value={platform} onChange={setPlatform} options={publishedPostsData.filters.platform} />
        </div>
      </section>

    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

<SummaryCard
 label="Published Posts"
 value={posts.length}
 icon={Sparkles}
 toneClassName="bg-blue-50 text-blue-700"
/>


<SummaryCard
 label="Likes"
 value="0"
 icon={Heart}
 toneClassName="bg-rose-50 text-rose-700"
/>


<SummaryCard
 label="Comments"
 value="0"
 icon={MessageSquareText}
 toneClassName="bg-amber-50 text-amber-700"
/>


<SummaryCard
 label="Shares"
 value="0"
 icon={Share2}
 toneClassName="bg-emerald-50 text-emerald-700"
/>


</section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {
loading ? (

<p>Loading posts...</p>

) : (

      filteredPosts.map((post)=>(
  
<PostCard 
key={post.Id}
post={post}
      onView={() => setSelectedPost(post)}
/>

))

)
}

        <CreateMoreCard />
      </section>

      <section className="rounded-[1.6rem] border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-900">Performance Overview</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Reusable table data is ready for API-backed analytics later.</p>
          </div>
          {/* <button type="button" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter Metrics
          </button> */}
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white text-[0.72rem] uppercase tracking-[0.12em] text-slate-400">
                <th className="px-5 py-3.5 font-semibold">Post</th>
                <th className="px-5 py-3.5 font-semibold">Channel</th>
                <th className="px-5 py-3.5 font-semibold">Published</th>
                <th className="px-5 py-3.5 font-semibold">Likes</th>
                <th className="px-5 py-3.5 font-semibold">Comments</th>
                <th className="px-5 py-3.5 font-semibold">Shares</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((row) => (
                <tr key={row.Id} className="border-b border-slate-100/90 last:border-0 transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{row.Message}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                     {row.Platform}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{row.CreatedAt}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">-</td>
                  <td className="px-5 py-4 text-sm text-slate-600">-</td>
                  <td className="px-5 py-4 text-sm text-slate-600">-</td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 hover:shadow-md"
                      aria-label="Open post actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedPost ? (
        <PostDetailsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      ) : null}
    </div>
  )
}

function SearchField({ value, onChange }) {
  return (
    <label className="grid gap-2 sm:col-span-2">
      <span className="text-xs font-medium text-slate-500">Search</span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="text"
          placeholder="Search published posts"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pl-11 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />
      </div>
    </label>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  )
}

function SummaryCard({ icon: Icon, label, value, toneClassName }) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${toneClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-[2rem] font-semibold tracking-[-0.06em] text-slate-900">{value}</p>
        </div>
      </div>
    </article>
  )
}

function PostCard({ post, onView }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
       <div className="h-56 bg-gradient-to-r from-blue-100 to-blue-300" />
        <span className="absolute right-3 bottom-3 rounded-full bg-blue-700 px-3 py-1 text-[0.68rem] font-semibold text-white shadow-lg shadow-blue-700/20">
          {post.Status}
        </span>
        {post.Platform ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.66rem] font-semibold text-slate-600 shadow-sm backdrop-blur">
            {post.Platform}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-4">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{post.Message}</p>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <Metric icon={Heart} value="-" label="LIKES" />
          <Metric icon={MessageSquareText} value="-" label="COMMENTS" />
          <Metric icon={Share2} value="-" label="SHARES" />
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onView} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <Eye className="h-4 w-4" />
            View
          </button>
          {/* <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <LineChart className="h-4 w-4" />
            Analytics
          </button>
          <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
            <Repeat2 className="h-4 w-4" />
            Re-post
          </button> */}
        </div>
      </div>
    </article>
  )
}

function PostDetailsModal({ post, onClose }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[1.6rem] border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-900">Post Details</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">Published post information from the loaded table data.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <DetailItem label="Platform" value={post.Platform} />
          <DetailItem label="Status" value={post.Status} />
          <DetailItem label="CreatedAt" value={post.CreatedAt} />
          <DetailItem label="PostId" value={post.PostId} />
          <div className="sm:col-span-2">
            <DetailItem label="Message" value={post.Message} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-700">{value ?? '-'}</p>
    </div>
  )
}

function CreateMoreCard() {
  return (
    <button
      type="button"
      className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white px-6 py-8 text-center text-slate-500 transition hover:border-blue-300 hover:bg-blue-50/40"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-blue-100 text-blue-700 shadow-[0_10px_20px_rgba(37,99,235,0.12)]">
        <Sparkles className="h-8 w-8" />
      </span>
      <span className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-800">Publish More Content</span>
      <span className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
        Add more content to your published archive and compare engagement trends.
      </span>
    </button>
  )
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1 text-blue-700">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-semibold">{value}</span>
      </div>
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</span>
    </div>
  )
}

export default PublishedPosts