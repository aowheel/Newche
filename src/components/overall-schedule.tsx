"use client";

import { OverallData } from "@/lib/definitions";
import { week, statusSymbol1 } from "@/lib/client-utils";
import clsx from "clsx";
import { useState } from "react";

export default function OverallSchedule({month, data}: {month: string, data: OverallData})
{
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="m-2">
      <div className="overflow-x-auto relative">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white border border-teal-100 text-3xl text-teal-200">
                <div className="h-10 flex items-center justify-center">
                  <span>
                    {`${parseInt(month.split("-")[1], 10)}`}
                  </span>
                </div>
              </th>
              {
                data.days.map((item, index) => {
                  return (
                    <th
                      key={index}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="min-w-10 border border-teal-100"
                    >
                      <div className={clsx("h-10 flex items-center justify-center",{"hidden": isHovered})}>
                        <span>
                          <span className="text-xl">{parseInt(item[0], 10)}</span>
                          <span className="text-xs">{week(`${month}-${item[0]}`)}</span>
                        </span>
                      </div>
                      <div className={clsx("h-10 flex items-center justify-center",{"hidden": !isHovered})}>
                        <span className="leading-none text-xs text-gray-500">
                          {item[1]}<br />&#x23F7;<br />{item[2]}
                        </span>
                      </div>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              data.names.map((item1, index1) => {
                return (
                  <tr key={index1}>
                    <th className="sticky left-0 bg-white border border-teal-100 whitespace-nowrap">
                      {item1}
                    </th>
                    {
                      data.status[index1].map((item2, index2) => {
                        return (
                          <td
                            key={index2}
                            className={
                              clsx("border border-teal-100", {
                                "bg-blue-100 font-black": item2 === 0,
                                "bg-red-100": item2 === 1,
                                "bg-teal-100": item2 === 2,
                              })
                            }
                          >
                            <div className="h-6 flex items-center justify-center">
                              <span>
                                { statusSymbol1(item2) }
                              </span>
                            </div>
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
      </div>
    </div>
  );
}