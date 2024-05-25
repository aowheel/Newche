"use server";
import { sql } from "@vercel/postgres";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { Day, State } from "@/app/lib/definition";

export async function eachMembersTable(prevState: State, formData: FormData)
{
  const month = formData.get("month");
  if (typeof(month) === "string")
  {
    try {
      const data = await sql<{ month: Day[] | null }>`
        SELECT schedule->${month}
        AS month
        FROM members
        WHERE id = ${prevState.params.id};
      `;
      const schedule = data.rows[0].month;
      if (schedule !== null) {
        return {
          params: {
            id: prevState.params.id,
            month: month,
            schedule: schedule
          }
        };
      } else {
        return {
          params: prevState.params,
          error: "データがありません。別の月を選択してください。"
        };
      }
    } catch(error) {
      console.error("Database Error:", error);
      return {
        params: prevState.params
      };
    }
  } else {
    return {
      params: prevState.params
    };
  }
}

export async function setStatus(id: number, month: string, day: string, status: number)
{
  try {
    await sql`
      SELECT update_status(${id}, ${month}, ${day}, ${status});
    `;
  } catch(error) {
    console.error("Database Error:", error);
  }
  revalidatePath("/");
  revalidatePath(`/${id}`);
}

export async function addComment(id: number, month: string, day: string, comment: string) {
  try {
    await sql`
      SELECT update_comment(${id}, ${month}, ${day}, ${comment});
    `;
  } catch(error) {
    console.error("Database Error:", error);
  }
  revalidatePath("/");
  revalidatePath(`/${id}`);
}

export async function toEachMembersTable(id: string) {
  redirect(`/${id}`);
}

export async function searchName(
  prevState: {status: number, message?: string, name?: string, month?: string[] },
  formData: FormData
) {
  const name = formData.get("name");
  if (typeof(name) === "string" && name.length > 0) {
    try {
      const data = await sql`
        SELECT *
        FROM members
        WHERE name = ${name}
      `
      const month = () => {
        const currentDate = new Date();
        const year1 = currentDate.getFullYear();
        const month1 = currentDate.getMonth() + 1;
        const nextDate = new Date(year1, month1 + 1);
        const year2 = nextDate.getFullYear();
        const month2 = nextDate.getMonth() + 1;
        return [
          `${year1}-${month1 < 10 ? "0" : ""}${month1}`,
          `${year2}-${month2< 10 ? "0" : ""}${month2}`
        ];
      }
      const [month1, month2] = month();

      if (data.rows.length === 1){
        const currentMonth = data.rows[0].schedule[month1];
        const nextMonth = data.rows[0].schedule[month2];
        if (currentMonth === undefined || nextMonth === undefined) {
          if (currentMonth !== undefined) {
            const exist = await sql`
              SELECT *
              FROM schedule
              WHERE month = ${month2};
            `;
            if (exist.rows[0] !== undefined) {
              return {
                status: 1,
                message: "来月の予定を登録",
                name: name,
                month: [month1, month2]
              };
            } else {
              return {
                status: 4,
                message: "来月の予定がまだありません。"
              }
            }
          } else if (nextMonth !== undefined) {
            return {
              status: 2,
              message: "今月の予定を登録",
              name: name,
              month: [month1, month2]
            };
          } else {
            const exist = await sql`
              SELECT *
              FROM schedule
              WHERE month = ${month2};
            `;
            if (exist.rows[0] !== undefined) {
              return {
                status: 3,
                message: "今月、または来月の予定を登録",
                name: name,
                month: [month1, month2]
              };
            } else {
              return {
                status: 2,
                message: "今月の予定を登録",
                name: name,
                month: [month1, month2]
              };
            }
          }
        } else {
          return {
            status: 4,
            message: "直近2か月は登録済みです。"
          };
        }
      } else {
        return {
          status: 5,
          message: "検索中..."
        };
      }
    } catch(error) {
      console.error("Database Error:", error);
      return prevState;
    }
  } else {
    return { status: 0 };
  }
}

export async function addMonth(name?: string, month?: string) {
  if (name !== undefined && month !== undefined) {
    let id;
    try {
      await sql`
        SELECT add_month(${name}, ${month});
      `
      const data = await sql<{id: number}>`
        SELECT id
        FROM members
        WHERE name = ${name};
      `
      id = data.rows[0].id;
    } catch(error) {
      console.error("Database Error:", error);
    }
    revalidatePath("/");
    revalidatePath(`/${id}`);
    redirect(`/${id}`);
  }
}

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

export async function classEntry(
  prevState: { status: boolean, message: string, value?: number },
  formData: FormData
) {
  const membersClass = Number(formData.get("class"));
  if (typeof(membersClass) === "number" && membersClass > 0) {
    return {
      status: true, message: "登録可能です。", value: membersClass
    }
  } else {
    return {
      status: false, message: "期の条件を満たしていません。"
    };
  }
}

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