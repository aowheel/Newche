import { useState } from "react"
import { Day } from "@/app/lib/definition"
import { sql } from "@vercel/postgres"
import { clsx } from "clsx";

export async function Table()
{
  const currentMonth = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}-${month < 10 ? "0" : ""}${month}`;
  }

  const names: string[] = [];
  const days:string[][] = [];
  const status: number[][] = [];

  try {
    const data = await sql<{name: string, month: Day[]}>`
      SELECT
      name,
      schedule->${currentMonth()} AS month
      FROM members
    `;
    const schedule = data.rows;

    for (let i = 0; i < schedule.length; i++) {
      names.push(schedule[i].name);
    }
    for (let i = 0; i < schedule[0].month.length; i++) {
      const month = schedule[0].month[i];
      days.push([month.day, month.start, month.end]);
    }
    for (let k = 0; k < schedule.length; k++) {
      const eachMembersStatus: number[] = [];
      for (let l = 0; l < schedule[0].month.length; l++) {
        eachMembersStatus.push(schedule[k].month[l].status);
      }
      status.push(eachMembersStatus);
    }
  } catch(error) {
    console.error("Database Error:", error);
  }
  
  const [isHovered, setIsHovered] = useState(false);

  return(
    <table>
      <tbody>
        <tr>
          <th></th>
          {
            days.map((item, index) => {
              return (
                <th key={index}>{item[0]}{item[1]}~{item[2]}</th>
              );
            })
          }
        </tr>
        {
          names.map((item1, index1) => {
            return (
              <tr key={index1}>
                <th>
                  {item1}
                </th>
                {
                  status[index1].map((item2, index2) =>{
                    return (
                      <td key={index2} className="text-center">
                        {item2}
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}
