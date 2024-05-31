"use client";

import { insertMonth } from "@/lib/actions";
import { OverallData } from "@/lib/definitions";
import { transition2 } from "@/lib/server-utils";
import OverallSchedule from "./overall-schedule";
import { useState } from "react";
import Link from "next/link";

export default function ScheduleStatus(
  {id, curr, next}:
  {
    id: number,
    curr: {month: string, exist: boolean, data: OverallData},
    next?: {month: string, exist: boolean, data: OverallData}
  }
) {
  const [pending, setPending] = useState<boolean>(false);

  if (!curr.exist) {
    return (
      <div className="flex justify-center">
        <input
          type="button"
          value="今月の日程を追加"
          onClick={async () => {
            setPending(true);
            await insertMonth(id, curr.month);
            setPending(false);
            transition2(id, curr.month);
          }}
          className="p-2 my-10 text-xl text-white bg-red-400 rounded"
          disabled={pending}
        />
      </div>
    );
  } else {
    if (next !== undefined) {
      if (!next.exist) {
        return (
          <>
            <input
              type="button"
              value="来月の日程を追加"
              onClick={async () => {
                setPending(true);
                await insertMonth(id, next.month);
                setPending(false);
                transition2(id, next.month);
              }}
              className="px-1 m-2 text-white bg-red-400 rounded"
              disabled={pending}
            />
            <OverallSchedule month={curr.month} data={curr.data} />
            <Link href={`${id}/${curr.month}`} className="inline-block mx-4 my-2 text-gray-400 underline">&#9658;今月の日程を編集</Link>
          </>
        );
      } else {
        const [state, setState] = useState(0);
        const month = [curr.month, next.month];
        const data =[curr.data, next.data];
        const button = ["来月の予定を表示", "今月の予定を表示"];
        return (
          <>
            <input
              type="button"
              value={button[state]}
              onClick={async () => {
                setState((state+1)%2);
              }}
              className="px-1 m-2 text-white bg-teal-400 rounded"
            />
            <OverallSchedule month={month[state]} data={data[state]} />
            <Link href={`${id}/${curr.month}`} className="inline-block mx-4 my-2 text-gray-400 underline">&#9658;今月の日程を編集</Link>
            <Link href={`${id}/${next.month}`} className="inline-block mx-4 my-2 text-gray-400 underline">&#9658;来月の日程を編集</Link>
          </>
        );
      }
    } else {
      return (
        <>
          <OverallSchedule month={curr.month} data={curr.data} />
          <Link href={`${id}/${curr.month}`} className="inline-block mx-4 my-2 text-gray-400 underline">&#9658;今月の日程を編集</Link>
        </>
      );
    }
  }
}