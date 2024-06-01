import NewcheLogo from "@/ui/newche-logo";
import { membersName, schedule } from "@/lib/data";
import ScheduleStatus from "@/components/schedule-status";

export default async function Page({params}: {params: {id: number}})
{
  const name = membersName(params.id);

  const month = () => {
    const currentDate = new Date();
    const year1 = currentDate.getFullYear();
    const month1 = currentDate.getMonth() + 1;
    const nextDate = new Date(year1, month1);
    const year2 = nextDate.getFullYear();
    const month2 = nextDate.getMonth() + 1;
    return {
      curr: `${year1}-${month1 < 10 ? "0" : ""}${month1}`,
      next: `${year2}-${month2 < 10 ? "0" : ""}${month2}`
    };
  }
  const curr = month().curr;
  const next = month().next;
  
  const currStatus = await schedule(params.id, curr);
  const nextStatus = await schedule(params.id, next);
  
  if(currStatus === undefined) {
    return undefined;
  }

  return (
    <main>
      <NewcheLogo />
      <p className="px-2 text-xs text-gray-400 inline-block">&#9733;&ensp;<label className="text-base">{name}</label>&ensp;さんのページ</p>
      <ScheduleStatus id={params.id} curr={currStatus} next={nextStatus} />
    </main>
  );
}
