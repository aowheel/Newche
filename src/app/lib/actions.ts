'use server';

import { sql } from '@vercel/postgres';
import { fetchMonthData } from "@/app/lib/data";
 
type State = { message?: string };

export async function addMember (prevState: State, formData: FormData) {
  const name = formData.get("name");
  if (typeof(name) === "string" && name.length <= 5) {
    try {
      await sql`
        INSERT INTO member (name) VALUES (${name});
      `
    } catch {
      return {message: "Failed to add member."};
    }
    return {message: "Success!"};
  } else {
    return {message: "Too long."};
  }
}

export async function addDay (prevState: State, formData: FormData) {
  const scheduleData = formData.get("schedule");
  if (typeof(scheduleData) === "string") {
      const splitScheduleData = scheduleData.match(/[0-9]+/g);
      if (splitScheduleData !== null && splitScheduleData[0].length === 6) {
        const year = splitScheduleData[0].slice(0,4);
        const month = splitScheduleData[0].slice(4);

        for (let i = 1; i < splitScheduleData.length; i++) {
          const dayData = splitScheduleData[i];
          const date = `
            ${year}-${month}-${dayData.slice(0,2)}
          `;
          const start_time = `
            ${dayData.slice(2,4)}:${dayData.slice(4,6)}
          `;
          const end_time = `
            ${dayData.slice(6,8)}:${dayData.slice(8,10)}
          `;
          console.log(dayData, date, start_time, end_time);

          try {
            await sql`
            INSERT INTO day (date, start_time, end_time)
            VALUES (${date}, ${start_time}, ${end_time});
            `;
          } catch {
            return {message: "Failed to add a day."}
          }
        }
        return {message: "Success!"}
      } else {
        return {message: "First row is wrong."};
      }
  } else {
    return {message: "Not string."};
  }
}

export async function selectAttendance(prevState: State, formData: FormData) {
  const attendance: string[] = [];
  const schedules = await fetchMonthData(2024, 5);
  
  for (let i = 0; i < schedules.length; i++) {
    const attendanceOption = formData.get(`options${i}`);
    console.log(typeof(attendanceOption), schedules[i].id);
    if (attendanceOption === "participate") {
      attendance.push(schedules[i].date);
    }
    if (typeof(attendanceOption) === "string"){
      try {
        await sql`
          UPDATE day
          SET participate = participate || ARRAY['牧野']
          WHERE id = ${schedules[i].id};
        `;
      } catch {
        return {message: "Failed to select attendance."};
      }
    }
  }
  return {message: "Success!"}
}