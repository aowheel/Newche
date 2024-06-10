"use client";

import { OverallData } from "@/lib/definitions";
import { week, statusSymbol1 } from "@/lib/client-utils";
import clsx from "clsx";
import { useState } from "react";

export default function OverallSchedule({month, data}: {month: string, data: OverallData})
{
  return (
    <div className="px-2 py-4">
      {data.overallComment.map((item, index) => {
        return (
          <div key={index} className="mx-2 px-2 py-1 rounded bg-teal-100">
            <span className="px-2 mr-2 rounded-full text-white bg-teal-700 font-bold">{item[0]}</span>
            <span className="font-semibold">{item[1]}</span>
          </div>
        );
      })}
      <div className="mt-2">
        <div className="overflow-x-auto relative">
          <table className="min-w-full">
            <thead>
              <tr>
                <th rowSpan={2} className="sticky left-0 bg-white border border-teal-100 text-4xl text-teal-300">
                  <div className="h-10 flex items-center justify-center">
                    <span>
                      {parseInt(month.split("-")[1], 10)}
                    </span>
                  </div>
                </th>
                {
                  data.days.map((item, index) => {
                    return (
                      <th
                        key={index}
                        className="min-w-10 border border-teal-100 select-none"
                      >
                        <div className="h-10 flex items-center justify-center">
                          <span>
                            <span className="text-xl">{item[0]}</span>
                            <span className="text-xs">{week(`${month}-${parseInt(item[0], 10) < 10 ? "0" : ""}${item[0]}`)}</span>
                          </span>
                        </div>
                      </th>
                    );
                  })
                }
              </tr>
              <tr>
                {
                  data.days.map((item, index) => {
                    return (
                      <th
                        key={index}
                        className="min-w-10 border border-teal-100 select-none"
                      >
                        <div className="h-10 flex items-center justify-center">
                          <span className="leading-none text-xs text-gray-500">
                            {item[1]}<br />&#9662;<br />{item[2]}
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
      <div>
        {data.individualComment.map((item, index) => {
          return (
            <div key={index} className="mx-2 mt-2 px-2 py-1 rounded bg-gray-100">
              <span className="mr-2 px-2 rounded text-sm text-white bg-gray-400">{item[0].trim()}</span>
              <span>{item[1]}&#9656;&ensp;</span>
              <span>{item[2]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}