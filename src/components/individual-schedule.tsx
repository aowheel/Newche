"use client";

import { editComment, editStatus } from "@/lib/actions";
import { statusSymbol2, week } from "@/lib/client-utils";
import { Schedule } from "@/lib/definitions";
import clsx from "clsx";
import { useState } from "react";

export default function IndividualSchedule(
  {id, month, data}: {id: number, month: string, data: Schedule[]}
) {
  const [day, setDay] = useState<string>("");
  const [comment, setComment] = useState<string | null>("");
  const [pending, setPending] = useState<boolean>(false);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="m-4">
          <tbody>
            {
              data.map((item, index) => {
                return (
                  <tr key={ index }>
                    <th className="px-1 py-2 border border-teal-300 whitespace-nowrap">
                      { parseInt(item.day, 10) }&ensp;({ week(`${month}-${item.day}`) })&ensp;{ item.start }-{ item.end }
                    </th>
                    <td className="border border-teal-300">
                      <div className="flex px-1">
                        <input
                          type="radio"
                          id={ `option${index}-0` }
                          name={ `option${index}` }
                          defaultChecked={ item.status === 0 }
                          className="appearance-none"
                          onChange={
                            async () => {
                              await editStatus(id, month, item.day, 0);
                            }
                          }
                        />
                        <label htmlFor={ `option${index}-0` }>{statusSymbol2(0)}</label>
                        <input
                          type="radio"
                          id={ `option${index}-1` }
                          name={ `option${index}` }
                          defaultChecked={ item.status === 1 }
                          className="appearance-none"
                          onChange={
                            async () => {
                              await editStatus(id, month, item.day, 1);
                            }
                          }
                        />
                        <label htmlFor={ `option${index}-1` }>{statusSymbol2(1)}</label>
                        <input
                          type="radio"
                          id={ `option${index}-2` }
                          name={ `option${index}` }
                          defaultChecked={ item.status === 2 }
                          className="appearance-none"
                          onChange={
                            async () => {
                              await editStatus(id, month, item.day, 2);
                            }
                          }
                        />
                        <label htmlFor={ `option${index}-2` }>{statusSymbol2(2)}</label>
                      </div>
                    </td>
                    <td className="border px-1 border-teal-300">{item.comment}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
      <div className="mb-4 mx-4 p-4 border border-teal-300 rounded">
        <div>
          <select
            name="day"
            className="px-2 w-24 rounded border-2 border-teal-700 focus:border-teal-500 transition-colors duration-300"
            onChange={(event) => {
              const index = parseInt(event.target.value, 10);
              setDay(data[index] === undefined ? "" : data[index].day);
              setComment(data[index] === undefined ? "" : data[index].comment);
            }}
          >
            <option value={9999} className="text-gray-400">日にち</option>
            {
              data.map((item, index) => {
                return (
                  <option key={index} value={index}>{ parseInt(item.day, 10) }</option>
                );
              })
            }
          </select>
        </div>
        <div className="mt-2">
          <input
            type="text"
            name="comment"
            defaultValue={comment === null ? "" : comment}
            onChange={
              (event) => {
                /* 要検討 */
                setComment(event.target.value);
              }
            }
            className="px-2 w-64 rounded border-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300"
            placeholder="コメントを記入"
            disabled={pending}
          />
        </div>
        <div className="mt-2">
          <input
            type="button"
            value={comment !== "" ? "送信" : "削除"}
            onClick={async () => {
              setPending(true);
              if (comment !== null) {
                await editComment(id, month, day, comment);
              }
              setPending(false);
            }}
            className={clsx("px-2 rounded text-white transition-colors duration-300", {
              "bg-teal-400 focus:bg-teal-300": comment !== "",
              "bg-red-600 focus:bg-red-400": comment === ""
            })}
            disabled={pending}
          />
        </div>
      </div>
    </>
  );
}