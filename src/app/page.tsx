import Link from "next/link";
import { Day } from "@/app/lib/definition";
import { Table, SelectName, SearchName } from "@/app/lib/client";
import NewcheLogo from "@/app/ui/newche-logo";
import { sql } from "@vercel/postgres";
import "./globals.css";

export default async function Home() {
  const currentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}-${month < 10 ? "0" : ""}${month}`;
  }
  const month = currentMonth();

  const ids: number[] = [];
  const names: string[] = [];
  const days:string[][] = [];
  const status: number[][] = [];

  try {
    const data1 = await sql`
      SELECT days
      FROM schedule
      WHERE month = ${month};
    `;
    const column = data1.rows[0].days;

    const data2 = await sql<{id: number, name: string, month: Day[]}>`
      SELECT
      id, name, schedule->${month} AS month
      FROM members
      WHERE schedule::jsonb ? ${month};
    `;
    const row = data2.rows;

    for (let i = 0; i < row.length; i++) {
      ids.push(row[i].id);
      names.push(row[i].name);
    }
    for (let i = 0; i < column.length; i++) {
      const month = column[i];
      days.push([month.day, month.start, month.end]);
    }
    for (let k = 0; k < row.length; k++) {
      const eachMembersStatus: number[] = [];
      for (let l = 0; l < column.length; l++) {
        eachMembersStatus.push(row[k].month[l].status);
      }
      status.push(eachMembersStatus);
    }
  } catch(error) {
    console.error("Database Error:", error);
  }

	return (
		<main>
      <Link href="/"><NewcheLogo /></Link>
      <div className="m-2">
        <SelectName ids={ids} names={names} />
        <Table month={month} names={names} days={days} status={status} />
        <div id="create" className="mt-6 p-2 rounded-xl bg-teal-100 w-64">
          <p className="text-teal-500 font-bold">&#9660;自分の予定を作成して表へ追加</p>
          <SearchName />
        </div>
      </div>
    </main>
	);
}
