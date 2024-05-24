import { sql } from "@vercel/postgres";
import Link from "next/link";
import { EachMembersTable } from "@/app/lib/client";
import { Day } from "@/app/lib/definition";
import NewcheLogo from "@/app/ui/newche-logo";

export default async function Page({ params }: { params: { id: number } })
{
  const fetchMembersName = async (membersId: number) =>
  {
    try {
      const data = await sql<{ name: string }>`
        SELECT name FROM members
        WHERE id = ${membersId};
      `;
      const member = data.rows[0];
      const trimedName = member.name.trim();
      return trimedName;
    } catch(error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch members data.");
    }
  }
  const membersName = await fetchMembersName(params.id);
  
  const currentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}-${month < 10 ? "0" : ""}${month}`;
  }

  const fetchCurrentSchedule = async (membersId: number) =>
  {
    try {
      const data = await sql<{ [key: string]: Day[] | null }>`
        SELECT schedule->${currentMonth()}
        AS month
        FROM members
        WHERE id = ${membersId};
      `;
      return data.rows[0].month;
    } catch(error) {
      console.error("Database Error:", error);
      throw new Error("Failed to fetch members data.");
    }
  }
  const currentSchedule = await fetchCurrentSchedule(params.id);
  
  return (
    <main>
      <Link href="/"><NewcheLogo /></Link>
      <p className="px-2 text-xs text-gray-400">&gt;&gt; <label className="text-base">{membersName}</label>さんのページ</p>
      <EachMembersTable
        membersId={ params.id } currentMonth={ currentMonth() } currentSchedule={ currentSchedule }
      />
    </main>
  );
}