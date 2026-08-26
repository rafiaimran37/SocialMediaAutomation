import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getScheduledPosts } from "../../services/scheduledPostService";

import { schedulePostsData } from "./schedulePostsData";
import { getApprovalQueue } from "../../services/approvalQueueService";
import { getPublishedPosts } from "../../services/publishedPostService";

import StatCard from "./components/StatCard";
import FiltersBar from "./components/FiltersBar";
import SchedulePostsTable from "./components/SchedulePostsTable";
// import QuickActionCard from "./components/QuickActionCard";


function SchedulePosts() {

  const navigate = useNavigate();

  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [platformFilter, setPlatformFilter] = useState("All Platforms");
const [statusFilter, setStatusFilter] = useState("All Statuses");
const [dateFilter, setDateFilter] = useState("Next 7 Days");

  const [approvalQueueItems, setApprovalQueueItems] = useState([]);
const [publishedPosts, setPublishedPosts] = useState([]);


  useEffect(() => {

    loadSchedules();

  }, [platformFilter, statusFilter]);



  const loadSchedules = async () => {

    try {

      const data = await getScheduledPosts({
        platform: platformFilter,
        status: statusFilter
      });

      const approvalData = await getApprovalQueue();
const publishedData = await getPublishedPosts();

setApprovalQueueItems(
  Array.isArray(approvalData) ? approvalData : []
);

setPublishedPosts(
  Array.isArray(publishedData) ? publishedData : []
);

      const formattedPosts = Array.isArray(data)

        ?

        data.map((post) => ({

          id: post.Id,

          dateTime:
            `${post.ScheduledDate} ${post.ScheduledTime}`,


          platform:
            post.Platform || "Unknown",


          contentPreview:
            post.Message || "No message",


          status:
            post.Status
            ?
            post.Status.toLowerCase()
            :
            "scheduled",


          assignedTo:
            "Current User",


          platformAccent:
            "bg-blue-50 text-blue-700",


          statusAccent:
            post.Status === "Scheduled"
            ?
            "bg-blue-50 text-blue-700"
            :
            "bg-slate-100 text-slate-600"

        }))

        :

        [];


      setScheduledPosts(formattedPosts);


    }

    catch(error){

      console.error(
        "Schedule load error:",
        error
      );

      setScheduledPosts([]);

    }

    finally{

      setLoading(false);

    }

  };

  const filteredPosts = scheduledPosts;


  return (

    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 text-slate-900">


      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur xl:flex-row xl:items-end xl:justify-between xl:px-8 xl:py-7">


        <div className="max-w-3xl">

          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl lg:text-[3rem]">
            Schedule Posts
          </h1>


          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500 sm:text-[1.05rem]">
            Organize upcoming content, review approval states, and keep the publishing queue ready for API-driven automation.
          </p>


        </div>




        <div className="flex flex-wrap gap-3 xl:justify-end">


          <button

            type="button"

            onClick={() => navigate("/add-schedule")}

            className="inline-flex h-14 items-center gap-3 rounded-full border border-blue-700 bg-gradient-to-r from-blue-700 to-blue-600 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.28)] transition hover:-translate-y-0.5 hover:shadow-lg"

          >

            <Plus className="h-4 w-4" />

            Create Schedule

          </button>




          



        </div>



      </section>





      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

{[
{
id:"scheduled-count",
label:"Scheduled",
value: scheduledPosts.filter(
(post)=>post.status==="scheduled"
).length,
hint:"Upcoming posts",
icon:schedulePostsData.stats[0].icon,
toneClassName:"bg-blue-50 text-blue-700"
},

{
id:"ready-to-approve",
label:"Ready to Approve",
value: approvalQueueItems.filter(
(item)=>item.Status?.toLowerCase()==="pending"
).length,
hint:"Awaiting review",
icon:schedulePostsData.stats[1].icon,
toneClassName:"bg-amber-50 text-amber-700"
},

{
id:"published-today",
label:"Published Today",
value: publishedPosts.filter(
(post)=>
new Date(post.CreatedAt).toDateString()
===
new Date().toDateString()
).length,
hint:"Live today",
icon:schedulePostsData.stats[2].icon,
toneClassName:"bg-emerald-50 text-emerald-700"
}

].map((stat)=>(

<StatCard
key={stat.id}
{...stat}
/>

))}

</section>





      <FiltersBar
filters={schedulePostsData.filters}
platformFilter={platformFilter}
setPlatformFilter={setPlatformFilter}
statusFilter={statusFilter}
setStatusFilter={setStatusFilter}
dateFilter={dateFilter}
setDateFilter={setDateFilter}
/>





      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] xl:items-start">



        <div>


          {
            loading

            ?

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 text-slate-500 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">

              Loading scheduled posts...

            </div>


            :

            <SchedulePostsTable

              rows={filteredPosts}

            />

          }



        </div>






        {/* <aside className="grid gap-4">


          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">


            <h2 className="text-base font-semibold text-slate-900">

              Quick Actions

            </h2>



            <p className="mt-1 text-sm text-slate-500">

              Reusable actions wired for future API operations

            </p>




            <div className="mt-5 grid gap-3">


              {schedulePostsData.quickActions.map((action) => (

                <QuickActionCard

                  key={action.id}

                  {...action}

                />

              ))}


            </div>



          </div>






          <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-sm">


            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">

              API Ready

            </p>



            <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">

              Structured for FastAPI Integration

            </h3>



            <p className="mt-3 text-sm leading-6 text-slate-300">

              Scheduled posts are loaded from the FastAPI backend. Future enhancements will support filtering, editing, deleting, approval workflow, and automatic publishing.

            </p>



          </div>



        </aside> */}




      </section>




    </div>


  );

}


export default SchedulePosts;