"use server";

import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { z } from "zod";
import { OverallData, Schedule, ScheduleTemplate } from "./definitions";

export async function members() {
  try {
    const data = await sql<{id: string, name: string}>`
      SELECT id, name FROM members;
    `;
    let names: string[][] = [];
    for (let i = 0; i < data.rows.length; i++) {
      names.push([data.rows[i].id, data.rows[i].name]);
    }
    return names;
  } catch(error) {
    throw error;
  }
}

export async function filteredMembers(
  prevState: { names?: string[][], message?: string},
  formData: FormData
) {
  const classNumber = z.string().parse(formData.get("class"));
  try {
    const data = await sql<{id: string, name: string}>`
      SELECT id, name FROM members WHERE class = ${classNumber};
    `;
    let names: string[][] = [];
    for (let i = 0; i < data.rows.length; i++) {
      names.push([data.rows[i].id, data.rows[i].name]);
    }
    return { names: names };
  } catch {
    return { message: "期を入力してください。" };
  }
}

export async function schedule(id: number, month: string) {
  const data: OverallData = {ids: [], names: [], days: [], status: []};

  try {
    const templateData = await sql<{days: ScheduleTemplate[]}>`
      SELECT days
      FROM schedule
      WHERE month = ${month};
    `;
    if (templateData.rows[0] !== undefined) {
      const column = templateData.rows[0].days;
      const eachMembersData = await sql<{month: Schedule[]}>`
        SELECT schedule->${month} AS month
        FROM members
        WHERE id=${id} AND schedule::jsonb ? ${month};
      `;
      if (eachMembersData.rows[0] !== undefined) {
        const overallData = await sql<{id: number, name: string, month: Schedule[]}>`
          SELECT
          id, name, schedule->${month} AS month
          FROM members
          WHERE schedule::jsonb ? ${month};
        `;
        const row = overallData.rows;

        for (let i = 0; i < row.length; i++) {
          data.ids.push(row[i].id);
          data.names.push(row[i].name);
        }
        for (let i = 0; i < column.length; i++) {
          const month = column[i];
          data.days.push([month.day, month.start, month.end]);
        }
        for (let k = 0; k < row.length; k++) {
          const eachMembersStatus: number[] = [];
          for (let l = 0; l < column.length; l++) {
            eachMembersStatus.push(row[k].month[l].status);
          }
          data.status.push(eachMembersStatus);
        }
        return {month: month, exist: true, data: data};
      } else {
        return {month: month, exist: false, data: data};
      }
    } else {
      return undefined;
    }
  } catch(error) {
    throw error;
  }
}

export async function membersName(id: number) {
  try {
    const data = await sql<{name: string}>`
      SELECT name FROM members WHERE id=${id};
    `;
    if(data.rows[0] !== undefined) {
      return data.rows[0].name;
    }
  } catch(error) {
    throw error;
  }
}

export async function individualData(id: number, month: string) {
  try {
    const data = await sql<{month: Schedule[]}>`
      SELECT schedule->${month} AS month
      FROM members
      WHERE id=${id} AND schedule::jsonb ? ${month};
    `;
    if (data.rows[0] !== undefined) {
      return data.rows[0].month;
    }
  } catch(error) {
    throw error;
  }
}

/*要検討*/
export async function nameEntry(
  prevState: { status: boolean, message: string, value?: string },
  formData: FormData
) {
  const membersName = formData.get("name");
  if (typeof(membersName) === "string" && membersName.length >= 2 && membersName.length <= 5) {
    try {
      const data = await sql`
        SELECT *
        FROM members
        WHERE name = ${membersName}
      `
      if (data.rows.length === 0) {
        return {
          status: true, message: "登録可能な名前です。", value: membersName
        };
      } else {
        return {
          status: false, message: "すでに登録済みの名前です。"
        };
      }
    } catch(error) {
      console.error("Database Error:", error);
      return {
        status: false, message: "Database Error."
      };
    }
  } else {
    return {
      status: false, message: "名前の条件を満たしていません。"
    };
  }
}