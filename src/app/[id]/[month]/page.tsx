import IndividualSchedule from "@/components/individual-schedule";
import { individualData, membersName } from "@/lib/data";
import NewcheLogo from "@/ui/newche-logo";

export default async function Page({params}: {params:{id: number, month: string}})
{
  const name = await membersName(params.id);
  const data = await individualData(params.id, params.month);

  if (name === undefined || data === undefined) {
    return <main></main>;
  }

  return (
    <main>
      <NewcheLogo name={name} />
      <IndividualSchedule id={params.id} month={params.month} data={data} />
    </main>
  );
}