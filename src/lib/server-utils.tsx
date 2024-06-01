"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function transition1(id: string) {
  cookies().set("id", id);
  revalidatePath(`/${id}`);
  redirect(`/${id}`);
}

export async function transition2(id: number, month: string) {
  revalidatePath(`/${id}`);
  redirect(`/${id}/${month}`);
}
