import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, CirclePlus, MessageCircleMore, Settings2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import StatCard from './components/StatCard'
import ActivityChart from './components/ActivityChart'
import UpcomingPostsTable from './components/UpcomingPostsTable'
import ApprovalCard from './components/ApprovalCard'
import ActivityItem from './components/ActivityItem'

import { dashboardData } from './dashboardData'

import { getPublishedPosts } from '../../services/publishedPostService'
import { getSocialAccounts } from '../../services/socialAccountService'
import { getApprovalQueue } from '../../services/approvalQueueService'
import { getScheduledPosts } from '../../services/scheduledPostService'


function Dashboard() {

  const navigate = useNavigate()
  const [socialAccounts, setSocialAccounts] = useState([])
  const [publishedPosts, setPublishedPosts] = useState([])
  const [approvalQueueItems, setApprovalQueueItems] = useState([])
  const [scheduledPosts, setScheduledPosts] = useState([])


  useEffect(() => {

    const loadDashboardData = async () => {

      try {

       const [
  accounts,
  posts,
  schedules

] = await Promise.all([

  getSocialAccounts(),

  getPublishedPosts(),

  getScheduledPosts()

])

setScheduledPosts(
  Array.isArray(schedules)
  ?
  schedules
  :
  []
)


        setSocialAccounts(
          Array.isArray(accounts) ? accounts : []
        )


        setPublishedPosts(
          Array.isArray(posts) ? posts : []
        )


      } catch(error){

        console.log(
          "Dashboard load error:",
          error
        )

      }

    }


    loadDashboardData()


  }, [])


  useEffect(() => {

    const loadApprovalQueue = async () => {

      try {

        const approvals = await getApprovalQueue()


        setApprovalQueueItems(
          Array.isArray(approvals) ? approvals : []
        )


      } catch(error){

        console.log(
          "Dashboard approval load error:",
          error
        )

        setApprovalQueueItems([])

      }

    }


    loadApprovalQueue()


  }, [])



  const connectedAccounts = useMemo(()=>{

    return socialAccounts.filter(
      account =>
        String(account.Status ?? '')
        .toLowerCase() === "connected"
    ).length


  },[socialAccounts])



  const publishedToday = useMemo(()=>{

    const today = new Date()


    return publishedPosts.filter(
      post =>
        isSameLocalDay(
          post.CreatedAt,
          today
        )
    ).length


  },[publishedPosts])



  const totalPublishedPosts =
    publishedPosts.length



  const activityData = useMemo(()=>{

  const data = buildWeeklyActivity(publishedPosts)

  console.log("Dashboard Published Posts:", publishedPosts)
  console.log("Dashboard Chart Data:", data)

  return data

},[publishedPosts])



  const recentActivity = useMemo(()=>{

    return buildRecentActivityItems(
      publishedPosts
    )


  },[publishedPosts])




  const dashboardStats = useMemo(()=>{


    return dashboardData.stats.map(stat=>{


      if(stat.label === "Scheduled Posts"){

        return {
          ...stat,
          label:"Total Published Posts",
          value:totalPublishedPosts,
          badge:"Live"
        }

      }



      if(stat.label === "Published Today"){

        return {
          ...stat,
          value:publishedToday,
          badge:"Active"
        }

      }



      if(stat.label === "Connected Accounts"){

        return {
          ...stat,
          value:connectedAccounts,
          badge:"Connected"
        }

      }



      if(stat.label === "Pending Approval"){

        return {
          ...stat,
          value:approvalQueueItems.length
        }

      }



      return stat


    })


  },[
    connectedAccounts,
    publishedToday,
    totalPublishedPosts,
    approvalQueueItems.length
  ])



  const dashboardPendingApprovals = useMemo(()=>{

    return approvalQueueItems.map((approval)=>({
      id: approval.Id,
      title: approval.Platform,
      description: `${approval.Message} • ${formatDashboardDate(approval.CreatedAt)}`,
      actionLabel: "Approve",
      accent: "bg-blue-600"
    }))


  },[approvalQueueItems])


  const dashboardUpcomingPosts = useMemo(()=>{

return scheduledPosts.map(post=>(

{
  id: post.Id,

  dateTime:
  `${post.ScheduledDate} ${post.ScheduledTime}`,

  platform:
  post.Platform,

  contentPreview:
  post.Message,

  status:
  post.Status

}

))


},[scheduledPosts])



  const dashboardActivity = {

    labels:[
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],

    data:activityData

  }



  return (

    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 text-slate-900">


      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur xl:flex-row xl:items-start xl:justify-between xl:px-8 xl:py-7">


        <div className="max-w-3xl">

          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Welcome Rafia
          </h1>


          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-[1.05rem]">

            Your social ecosystem is performing 
            <span className="font-semibold text-blue-700">
              14% better
            </span>
            {" "}than last week. Ready to scale your reach?

          </p>


        </div>



      <div className="flex flex-wrap gap-3 xl:justify-end">

  <DashboardActionButton
    icon={MessageCircleMore}
    label="Generate AI Post"
    active
    onClick={() => navigate("/ai-generator")}
  />


  <DashboardActionButton
    icon={Settings2}
    label="Schedule"
    onClick={() => navigate("/schedule-posts")}
  />


  <DashboardActionButton
    icon={CirclePlus}
    label="Connect"
    onClick={() => navigate("/social-connectors")}
  />

</div>


      </section>





      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

        {
          dashboardStats.map(stat=>(

            <StatCard
              key={stat.label}
              {...stat}
            />

          ))
        }

      </section>





      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)] xl:items-start">


        <ActivityChart

          data={
            dashboardActivity.data
          }

          labels={
            dashboardActivity.labels
          }

        />



        <div className="grid gap-6">


          <PendingApprovalPanel
            approvals={
              dashboardPendingApprovals
            }
          />


          <RecentActivityPanel
            items={
              recentActivity.length
              ?
              recentActivity
              :
              dashboardData.recentActivity
            }
          />


        </div>


      </section>









      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">


       <UpcomingPostsTable rows={dashboardUpcomingPosts} />


     


      </section>



    </div>

  )

}






function DashboardActionButton({
  icon:Icon,
  label,
  active=false,
  onClick
}){


return (

<button

type="button"

onClick={onClick}

className={

`inline-flex h-14 items-center gap-3 rounded-full border px-5 text-sm font-semibold tracking-[0.01em] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg

${
active

?

'border-blue-700 bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-[0_16px_35px_rgba(37,99,235,0.22)]'

:

'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'

}

`

}

>


<Icon className="h-4 w-4"/>

<span>
{label}
</span>


</button>


)


}






function PendingApprovalPanel({
approvals,
compact=false
}){


return (

<section className="rounded-[1.5rem] border border-slate-200/70 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">


<h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">

Pending Approvals

</h2>


<div className="mt-4 grid max-h-[420px] gap-4 overflow-y-auto pr-2">

{
approvals.map(
approval=>(

<ApprovalCard
key={approval.id}
{...approval}
/>

))
}

</div>


</section>

)


}






function RecentActivityPanel({
items
}){


return (

<section className="rounded-[1.5rem] border border-slate-200/70 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">


<h2 className="text-base font-semibold tracking-[-0.02em] text-slate-900">

Recent Activity

</h2>


<ul className="mt-5 grid gap-5">


{
items.map(item=>(

<ActivityItem
key={item.id}
{...item}
/>

))
}


</ul>


</section>


)

}






function buildWeeklyActivity(posts){

  const weeklyCounts = new Array(7).fill(0)


  posts.forEach(post=>{

    const createdDate =
      new Date(
        post.CreatedAt || post.createdAt
      )


    if(Number.isNaN(createdDate.getTime())){
      return
    }


    const day =
      createdDate.getDay()


    weeklyCounts[day] += 1


  })


  return weeklyCounts

}






function isSameLocalDay(
dateValue,
comparisonDate
){


const date =
new Date(dateValue)


if(
Number.isNaN(date.getTime())
){

return false

}


return (

date.getFullYear()
===
comparisonDate.getFullYear()

&&

date.getMonth()
===
comparisonDate.getMonth()

&&

date.getDate()
===
comparisonDate.getDate()

)


}






function buildRecentActivityItems(posts){


return posts

.slice()

.sort(
(a,b)=>
new Date(b.CreatedAt)
-
new Date(a.CreatedAt)
)

.slice(0,3)


.map((post,index)=>(

{

id:post.Id,

title:
`${post.Platform} Post Published`,

description:
String(post.Message ?? '')
.slice(0,70),

time:
formatRelativeTime(
post.CreatedAt
),

tone:
toneForPlatform(
post.Platform,
index
)

}


))


}

function formatDashboardDate(dateValue){

  const date = new Date(dateValue)

  if(Number.isNaN(date.getTime())){
    return "Recently"
  }

  return new Intl.DateTimeFormat("en-US",{
    month:"short",
    day:"numeric",
    hour:"2-digit",
    minute:"2-digit"
  }).format(date)

}






function formatRelativeTime(dateValue){


const date =
new Date(dateValue)


const diff =
Date.now()
-
date.getTime()


const mins =
Math.floor(diff / 60000)



if(mins < 1)
return "Just now"



if(mins < 60)
return `${mins} mins ago`



return `${Math.floor(mins/60)} hours ago`


}






function toneForPlatform(platform,index){


const p =
String(platform ?? '')
.toLowerCase()



if(p==="facebook")
return "bg-blue-600"



if(p==="linkedin")
return "bg-sky-600"



if(p==="instagram")
return "bg-rose-600"



return index===1
?
"bg-rose-600"
:
"bg-emerald-500"


}




export default Dashboard