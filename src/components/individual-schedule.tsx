"use client";

import { editComment, editStatus } from "@/lib/actions";
import { statusSymbol2, week } from "@/lib/client-utils";
import { Schedule } from "@/lib/definitions";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export default function IndividualSchedule(
  {id, month, data}: {id: number, month: string, data: Schedule[]}
) {
  const [day, setDay] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  let allChecked = true;
  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 9999) {
      allChecked = false;
    }
  }
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
                      { parseInt(item.day, 10) }&ensp;({ week(`${month}-${parseInt(item.day, 10) < 10 ? "0" : ""}${item.day}`) })&ensp;{ item.start }-{ item.end }
                    </th>
                    <td className="border border-teal-300">
                      <div className="relative flex px-1">
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
                        <label htmlFor={ `option${index}-0` } className="mx-1">{statusSymbol2(0)}</label>
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
                        <label htmlFor={ `option${index}-1` } className="mx-1">{statusSymbol2(1)}</label>
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
                        <label htmlFor={ `option${index}-2` } className="mx-1">{statusSymbol2(2)}</label>
                        {
                          item.status === 9999 &&
                          <>
                            <span className="animate-ping absolute top-0 -left-1 h-3 w-3 rounded-full bg-teal-300 opacity-75"></span>
                            <span className="absolute top-0 -left-1 rounded-full border border-white h-3 w-3 bg-teal-200"></span>
                          </>
                        }
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
      <div className="flex justify-between mx-4 mb-4">
        <span className="flex items-center px-1 bg-gray-100 rounded">{statusSymbol2(0)}<span className="px-1">参加</span></span>
        <span className="flex items-center px-1 bg-gray-100 rounded">{statusSymbol2(1)}<span className="px-1">不参加</span></span>
        <span className="flex items-center px-1 bg-gray-100 rounded">{statusSymbol2(2)}<span className="px-1">未定</span></span>
      </div>
      <div className="mb-4 mx-4 p-4 border border-teal-300 rounded">
        <div>
          <select
            name="day"
            className="px-1 text-teal-800 font-semibold rounded border-2 border-teal-700 focus:border-teal-500 transition-colors duration-300"
            onChange={(event) => {
              const index = parseInt(event.target.value, 10);
              setDay(data[index] === undefined ? "" : data[index].day);
            }}
          >
            <option value={-1}>日付を選択</option>
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
            value={comment === null ? "" : comment}
            onChange={
              (event) => {
                setComment(event.target.value);
              }
            }
            className="px-2 w-64 rounded border-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300"
            placeholder="コメントを記入"
            disabled={pending}
          />
        </div>
        {
          day !== "" &&
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
        }
      </div>
      <div className="flex justify-center items-center mb-4">
        {
          !allChecked &&
          <>
            <svg className="animate-spin h-8 w-8 fill-none">
              <path d="M 16,4 A 12,12 0 0,1 28,16" strokeWidth={3} className="stroke-gray-300" />
              <path d="M 28,16 A 12,12 0 0,1 16,28 A 12,12 0 0,1 4,16 A 12,12 0 0,1 16,4" strokeWidth={3} className="stroke-gray-300 opacity-75" />
            </svg>
            <p className="px-2 animate-pulse text-lg text-gray-500">すべて入力してください</p>
          </>
        }
        {
          allChecked &&
          <Link href={`/${id}`} className="px-2 text-lg text-teal-400 border border-teal-400 rounded">一覧へ戻る</Link>
        }
      </div>
    </>
  );
}