"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function insertMonth(id: number, month: string) {
  try {
    await sql`
      SELECT insert_month(${id}, ${month});
    `;
  } catch(error) {
    throw error;
  }
}

export async function editStatus(id: number, month: string, day: string, status: number)
{
  try {
    await sql`
      SELECT update_status(${id}, ${month}, ${day}, ${status});
    `;
  } catch(error) {
    throw error;
  }
  revalidatePath(`/${id}`);
  revalidatePath(`/${id}/${month}`);
}

export async function editComment(id: number, month: string, day?: string, comment?: string | null)
{
  try {
    await sql`
      SELECT update_comment(${id}, ${month}, ${day}, ${comment});
    `;
  } catch(error) {
    throw error;
  }
  revalidatePath(`/${id}`);
  revalidatePath(`/${id}/${month}`);
}

/*要検討*/
export async function addMember(membersName?: string, membersClass?: number) {
  try {
    if (membersName !== undefined && membersClass !== undefined) {
      await sql`
        INSERT INTO members (name, class, schedule)
        VALUES (${membersName}, ${membersClass}, '{}');
      `;
    }
  } catch(error) {
    console.error("Database Error:", error);
  }
  revalidatePath("/");
  redirect("/");
}