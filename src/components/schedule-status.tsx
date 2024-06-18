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
  const [state, setState] = useState<number>(0);

  if (!curr.exist) {
    return (
      <div className="px-4 pt-4">
        <input
          type="button"
          value="今月の日程を追加"
          onClick={async () => {
            setPending(true);
            await insertMonth(id, curr.month);
            setPending(false);
            transition2(id, curr.month);
          }}
          className="inline-block px-2 text-lg text-white bg-red-400 rounded"
          disabled={pending}
        />
      </div>
      
    );
  } else {
    if (next !== undefined) {
      if (!next.exist) {
        return (
          <>
            <div className="px-4 pt-4">
              <input
                type="button"
                value="来月の日程を追加"
                onClick={async () => {
                  setPending(true);
                  await insertMonth(id, next.month);
                  setPending(false);
                  transition2(id, next.month);
                }}
                className="inline-block px-2 text-lg text-white bg-red-400 rounded"
                disabled={pending}
              />
            </div>
            <OverallSchedule month={curr.month} data={curr.data} />
            <div className="px-4 pb-4">
              <Link href={`${id}/${curr.month}`} className="inline-block px-2 text-lg text-teal-400 border border-teal-400 rounded">今月の日程を編集</Link>
            </div>
          </>
        );
      } else {
        const month = [curr.month, next.month];
        const data = [curr.data, next.data];
        const button = ["来月の日程を表示", "今月の日程を表示"];
        return (
          <>
            <div className="px-4 pt-4">
              <input
                type="button"
                value={button[state]}
                onClick={async () => {
                  setState((state+1)%2);
                }}
                className="inline-block px-2 text-lg text-white bg-teal-600 rounded"
              />
            </div>
            <OverallSchedule month={month[state]} data={data[state]} />
            <div className="px-4 pb-4">
              <Link href={`${id}/${curr.month}`} className="inline-block mr-4 px-2 text-lg text-teal-400 border border-teal-400 rounded">今月の日程を編集</Link>
              <Link href={`${id}/${next.month}`} className="inline-block px-2 text-lg text-teal-400 border border-teal-400 rounded">来月の日程を編集</Link>
            </div>
          </>
        );
      }
    } else {
      return (
        <>
          <OverallSchedule month={curr.month} data={curr.data} />
          <div className="px-4 pb-4">
            <Link href={`${id}/${curr.month}`} className="inline-block px-2 text-lg text-teal-400 border border-teal-400 rounded">今月の日程を編集</Link>
          </div>
        </>
      );
    }
  }
}