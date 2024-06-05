"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  redirect('/entry');
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