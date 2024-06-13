"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OverallData } from "./definitions";

export async function transition1(id: string) {
  cookies().set("id", id, {maxAge: 60*60*24*365});
  revalidatePath(`/${id}`);
  redirect(`/${id}`);
}

export async function transition2(id: number, month: string) {
  revalidatePath(`/${id}`);
  redirect(`/${id}/${month}`);
}

export async function transition3() {
  cookies().delete("id");
  redirect("/entry");
}

export async function month() {
  const curr = new Date();
  const currYear = curr.getFullYear();
  const currMonth = curr.getMonth() + 1;
  const next = new Date(currYear, currMonth);
  const nextYear = next.getFullYear();
  const nextMonth = next.getMonth() + 1;
  return {
    curr: `${currYear}-${currMonth < 10 ? "0" : ""}${currMonth}`,
    next: `${nextYear}-${nextMonth < 10 ? "0" : ""}${nextMonth}`
  };
}

export async function day() {
  const date = new Date();
  const currYear = date.getFullYear();
  const currMonth = date.getMonth() + 1;
  const currDay = date.getDate();
  date.setDate(currDay + 1);
  const nextYear = date.getFullYear();
  const nextMonth = date.getMonth() + 1;
  const nextDay = date.getDate();
  return {
    curr: {month: `${currYear}-${currMonth < 10 ? "0" : ""}${currMonth}`, day: currDay},
    next: {month: `${nextYear}-${nextMonth < 10 ? "0" : ""}${nextMonth}`, day: nextDay}
  }
}

export async function dataExtraction(
  recentDay: {month: string, day: number},
  status: {month: string, data: OverallData} | undefined
) {
  if (status !== undefined) {
    if (recentDay.month === status.month) {
      let dayIndex = -1;
      let participantsIndex: number[] = [];
      for (let i = 0; i < status.data.days.length; i++){
        if (recentDay.day === parseInt(status.data.days[i][0], 10)) {
          dayIndex = i;
        }
      }
      if (dayIndex !== -1) {
        for (let i = 0; i < status.data.status.length; i++) {
          if (status.data.status[i][dayIndex] === 0) {
            participantsIndex.push(i);
          }
        }
        const participants: {class: number, name: string[]}[] = [];
        for (let i = 0; i < participantsIndex.length; i++) {
          let classesIndex = -1;
          for (let j = 0; j < participants.length; j++) {
            if (participants[j].class === status.data.classes[participantsIndex[i]]) {
              classesIndex = j;
            }
          }
          if (classesIndex !== -1) {
            participants[classesIndex].name.push(status.data.names[participantsIndex[i]]);
          } else {
            participants.push({class: status.data.classes[participantsIndex[i]], name: [status.data.names[participantsIndex[i]]]});
          }
        }
        return {
          day: `${parseInt(recentDay.month.split("-")[1], 10)}/${recentDay.day}`,
          start: status.data.days[dayIndex][1],
          end: status.data.days[dayIndex][2],
          participants: participants
        };
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export async function recentData(
  recentDay: {month: string, day: number},
  currStatus: {month: string; data: OverallData},
  nextStatus: {month: string; data: OverallData} | undefined
) {
  let data = await dataExtraction(recentDay, currStatus);
  if (data === undefined) {
    data = await dataExtraction(recentDay, nextStatus);
  }
  return (data);
}
