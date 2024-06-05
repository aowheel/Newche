import NewcheLogo from "@/ui/newche-logo";
import { membersName, schedule } from "@/lib/data";
import ScheduleStatus from "@/components/schedule-status";
import { month, day } from "@/lib/server-utils";
import { DeleteCookies } from "@/lib/client-utils";

export default async function Page({params}: {params: {id: number}})
{
  const name = membersName(params.id);
  const months = await month();
  const days = await day();
  const currMonth = months.curr;
  const nextMonth = months.next;
  const currDay = days.curr;
  const nextDay = days.next;
  /*ここまで完了 -> data.tsで利用?*/
  
  const currStatus = await schedule(params.id, currMonth);
  const nextStatus = await schedule(params.id, nextMonth);
  
  if (currStatus === undefined) {
    return undefined;
  }

  return (
    <main>
      <NewcheLogo />
      <p className="px-2 text-xs text-gray-400 inline-block">&#9733;&ensp;<label className="text-base">{name}</label>&ensp;さんのページ</p>
      <ScheduleStatus id={params.id} curr={currStatus} next={nextStatus} />
      <DeleteCookies />
    </main>
  );
}
