import NewcheLogo from "@/ui/newche-logo";
import { membersName, schedule, dayData } from "@/lib/data";
import ScheduleStatus from "@/components/schedule-status";
import { month, day } from "@/lib/server-utils";
import RecentDetails from "@/components/recent-details";
import { redirect } from "next/navigation";

export default async function Page({params}: {params: {id: number}})
{
  const name = await membersName(params.id);
  const months = await month();
  const days = await day();
  const currMonth = months.curr;
  const nextMonth = months.next;
  const currDay = days.curr;
  const nextDay = days.next;
  
  const currStatus = await schedule(params.id, currMonth);
  const nextStatus = await schedule(params.id, nextMonth);
  const currData = await dayData(currDay);
  const nextData = await dayData(nextDay);

  if (name === undefined || currStatus === undefined) {
    return undefined;
  }
  
  let index = -1;
  for (let i = 0; i < currStatus.data.ids.length; i++) {
    if (currStatus.data.ids[i] == params.id) {
      index = i;
    }
  }
  if (index !== -1) {
    let missing = false;
    for (let i = 0; i < currStatus.data.status[index].length; i++) {
      if (currStatus.data.status[index][i] === 9999) {
        missing = true;
      }
    }
    if (missing === true) {
      redirect(`/${params.id}/${currMonth}`);
    }
  }
  
  return (
    <main>
      <NewcheLogo name={name} />
      {
        currData !== undefined &&
        <RecentDetails data={currData} />
      }
      {
        nextData !== undefined &&
        <RecentDetails data={nextData} />
      }
      <ScheduleStatus id={params.id} curr={currStatus} next={nextStatus} />
    </main>
  );
}
