import IndividualSchedule from "@/components/individual-schedule";
import { individualData, membersName } from "@/lib/data";
import NewcheLogo from "@/ui/newche-logo";
import Link from "next/link";

export default async function Page({params}: {params:{id: number, month: string}})
{
  const name = await membersName(params.id);
  const data = await individualData(params.id, params.month);

  if (name === undefined || data === undefined) {
    return undefined;
  }

  return (
    <>
      <NewcheLogo name={name} />
      <IndividualSchedule id={params.id} month={params.month} data={data} />
      <Link href={`/${params.id}`} className="block mb-4 text-gray-400 text-center underline">&#9658;一覧へ戻る</Link>
    </>
  );
}