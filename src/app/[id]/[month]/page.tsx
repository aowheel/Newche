import IndividualSchedule from "@/components/individual-schedule";
import { individualData, membersName } from "@/lib/data";
import NewcheLogo from "@/ui/newche-logo";
import Link from "next/link";

export default async function Page({params}: {params:{id: number, month: string}})
{
  const name = await membersName(params.id);
  const data = await individualData(params.id, params.month);

  if (data === undefined) {
    return undefined;
  }

  return (
    <>
      <NewcheLogo />
      <p className="px-2 text-xs text-gray-400 inline-block">&#9733;&ensp;<label className="text-base">{name}</label>&ensp;さんの編集ページ</p>
      <IndividualSchedule id={params.id} month={params.month} data={data} />
      <Link href={`/${params.id}`} className="block mb-4 text-gray-400 text-center underline">&#9658;一覧へ戻る</Link>
    </>
  );
}