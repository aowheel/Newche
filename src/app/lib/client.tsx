"use client";
import { useState, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { eachMembersTable, setStatus, addComment, toEachMembersTable, searchName, addMonth } from "@/app/lib/server";
import { Day, State } from "@/app/lib/definition";
import { clsx } from "clsx";

function week(dateString: string) {
  const daysOfWeek = ["日","月","火","水","木","金","土"];
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

function symbolStatus(status: number) {
  switch (status) {
    case 0:
      return (
        <svg className="w-10 h-6 fill-none stroke-current">
          <path
            d="
              M 20,4
              A 8,8 0 0,1 28,12
              A 8,8 0 0,1 20,20
              A 8,8 0 0,1 12,12
              A 8,8 0 0,1 20,4
            "
          />
        </svg>
      );
    case 1:
      return (
        <svg className="w-10 h-6 fill-none stroke-current">
          <path d="M 12,4 L 28,20" />
          <path d="M 12,20 L 28,4" />
        </svg>
      );
    default:
      return null;
  }
}

export function Table({month, names, days, status}:{month: string; names:string[], days: string[][], status: number[][]})
{
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="container mt-2 mx-auto">
      <div className="overflow-x-auto relative">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white h-10 border border-teal-100 text-3xl text-teal-200">{`${parseInt(month.split("-")[1], 10)}`}</th>
              {
                days.map((item, index) => {
                  return (
                    <th
                      key={index}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="min-w-10 border border-teal-100 select-none"
                    >
                      <span
                        className={clsx("leading-none text-xl", {
                          "hidden": isHovered,
                        })}
                      >
                        {parseInt(item[0], 10)}
                      </span>
                      <span
                        className={clsx("leading-none text-xs", {
                          "hidden": isHovered,
                        })}
                      >
                        {week(`${month}-${item[0]}`)}
                      </span>
                      <span
                        className={clsx("block leading-none text-xs text-gray-500", {
                          "hidden": !isHovered,
                        })}
                      >
                        {item[1]}<br />|<br />{item[2]}
                      </span>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              names.map((item1, index1) => {
                return (
                  <tr key={index1}>
                    <th className="sticky left-0 bg-white border border-teal-100 min-w-10 whitespace-nowrap">
                      {item1}
                    </th>
                    {
                      status[index1].map((item2, index2) =>{
                        return (
                          <td
                            key={index2}
                            className={
                              clsx("text-center border border-teal-100", {
                                "bg-blue-100 font-black": item2 === 0,
                                "bg-red-100": item2 === 1,
                                "bg-teal-100": item2 === 2,
                              })
                            }
                          >
                            { symbolStatus(item2) }
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

export function SelectName({ids, names}: {ids: number[], names: string[]})
{
  return (
    <>
      <select
        onChange={(event) => {
          toEachMembersTable(event.target.value);
        }}
        className="px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 text-teal-700 font-semibold"
      >
        <option className="text-gray-500">名前を選択</option>
        {
          ids.map((item, index) => {
            return (
              <option key={index} value={item}>{names[index]}</option>
            );
          })
        }
      </select>
    </>
  );
}

export function SearchName() {
  const initialState = { status: 0, message: undefined, name: undefined, month: undefined }
  const [state, dispatch] = useFormState(searchName, initialState);

  return (
    <>
      <form action={ dispatch }>
        <input
          type="text"
          name="name"
          onChange={
            async (event) => {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }
          className="mt-2 px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 rounded w-28"
          placeholder="名前を検索"
        />
      </form>
      {
        state.status !== 0 &&
          <p
            className={clsx("mt-2 font-semibold", {
              "text-teal-800": state.status <= 3,
              "text-red-500": state.status === 4,
              "text-white": state.status === 5
            })}
          >
            { state.message }
          </p>
      }
      {
        (state.status === 2 || state.status === 3) &&
          <input
            type="button"
            value={state.month?.[0]}
            onClick={
              async () => {
                await addMonth(state.name, state.month?.[0]);
              }
            }
            className="text-white bg-teal-950 px-1 rounded mt-1 mx-1 transition-colors duration-300 active:bg-teal-500"
          />
      }
      {
        (state.status === 1 || state.status === 3) &&
          <input
            type="button"
            value={state.month?.[1]}
            onClick={
              async () => {
                await addMonth(state.name, state.month?.[1]);
              }
            }
            className="text-white bg-teal-950 px-1 rounded mt-1 mx-1 transition-colors duration-300 active:bg-teal-500"
          />
      }
    </>
  );
}

export function EachMembersTable(
  {
    membersId, currentMonth, currentSchedule
  }:{
    membersId: number, currentMonth: string, currentSchedule: Day[] | null
  }
) {
  const initialState: State = {
    params: {
      id: membersId,
      month: currentMonth,
      schedule: currentSchedule
    }
  };
  const [state, dispatch] = useFormState(eachMembersTable, initialState);
  const { pending } = useFormStatus();
  const [isEditor, setIsEditor] = useState(false);
  const text = () => {
    if (isEditor) {
      return ("一覧に戻る");
    } else {
      return ("編集");
    }
  };
  const [selectedDay, setSelectedDay] = useState("");
  const [enteredComment, setEnteredComment] = useState("");
  const [placeholder, setPlaceholder] = useState("Enterで削除 / コメントを入力");

  function viewStatus(option: number) {
    switch (option) {
      case 0:
        return (
          <svg className="w-6 h-6 fill-none stroke-current">
            <path
              d="
                M 12,4
                A 8,8 0 0,1 20,12
                A 8,8 0 0,1 12,20
                A 8,8 0 0,1 4,12
                A 8,8 0 0,1 12,4
              "
            />
          </svg>
        );
      case 1:
        return (
          <svg className="w-6 h-6 fill-none stroke-current">
            <path d="M 4,4 L 20,20" />
            <path d="M 4,20 L 20,4" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-6 h-6 fill-none stroke-current">
            <path
              d={`
                M 12,4
                L ${12-16/Math.sqrt(3)},20
                L ${12+16/Math.sqrt(3)},20
                Z
              `}
            />
          </svg>
        );
      default:
        return null;
    }
  }

  const monthRef = useRef<HTMLInputElement | null>(null);
  const commentRef = useRef<HTMLInputElement | null>(null);

  return (
    <form action={ dispatch } className="p-2">
      <input
        type="month" ref={ monthRef } name="month" defaultValue={ state.params.month } disabled={ pending }
        className="px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 text-teal-700 font-semibold"
        onChange={
          (event) => {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
            monthRef.current?.blur();
          }
        }
      />
      <table className="mt-1">
        <tbody>
          {
            state.params.schedule?.map((item, index) => {
              return (
                <tr key={ index }>
                  <th className="w-40 border border-teal-800">
                    { parseInt(item.day, 10) } ({ week(`${state.params.month}-${item.day}`) }) { item.start }-{ item.end }
                  </th>
                  {
                  !isEditor &&
                    <>
                      <td className="border border-teal-800">{ viewStatus(item.status) }</td>
                      <td className="border border-teal-800">{ item.comment }</td>
                    </>
                  }
                  {
                  isEditor &&
                    <td className="border border-teal-800">
                      <div className="flex">
                        <input
                          type="radio"
                          id={ `option${index}-0` }
                          name={ `option${index}` }
                          defaultChecked={ item.status === 0 }
                          disabled={ pending }
                          className="appearance-none"
                          onChange={
                            async () => {
                              await setStatus(state.params.id, state.params.month, item.day, 0);
                            }
                          }
                        />
                        <label htmlFor={ `option${index}-0` } className="mx-1">
                          <svg className="w-8 h-8 fill-none stroke-current">
                            <path
                              d="
                                M 16,5
                                A 11,11 0 0,1 27,16
                                A 11,11 0 0,1 16,27
                                A 11,11 0 0,1 5,16
                                A 11,11 0 0,1 16,5
                              "
                            />
                          </svg>
                        </label>
                        <input
                          type="radio"
                          id={ `option${index}-1` }
                          name={ `option${index}` }
                          defaultChecked={ item.status === 1 }
                          disabled={ pending }
                          className="appearance-none"
                          onChange={
                            async () => {
                              await setStatus(state.params.id, state.params.month, item.day, 1);
                            }
                          }
                        />
                        <label htmlFor={ `option${index}-1` } className="mx-1">
                          <svg className="w-8 h-8 fill-none stroke-current">
                            <path d="M 5,5 L 27,27" />
                            <path d="M 5,27 L 27,5" />
                          </svg>
                        </label>
                        <input
                          type="radio"
                          id={ `option${index}-2` }
                          name={ `option${index}` }
                          defaultChecked={ item.status === 2 }
                          disabled={ pending }
                          className="appearance-none"
                          onChange={
                            async () => {
                              await setStatus(state.params.id, state.params.month, item.day, 2);
                            }
                          }
                        />
                        <label htmlFor={ `option${index}-2` } className="mx-1">
                          <svg className="w-8 h-8 fill-none stroke-current">
                            <path
                              d={`
                                M 16,5
                                L ${16-22/Math.sqrt(3)},27
                                L ${16+22/Math.sqrt(3)},27
                                Z
                              `}
                            />
                          </svg>
                        </label>
                      </div>
                    </td>
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <p className="text-red-500">{ state.error }</p>
      {
      isEditor &&
        <>
          <select
            name="day"
            className="mt-4 px-2 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 text-teal-700 font-semibold"
            onChange={(event) => {
              setSelectedDay(event.target.value);
              commentRef.current?.focus();
            }}
          >
            <option className="text-gray-500">日を選択</option>
            {
              state.params.schedule?.map((item, index) => {
                return (
                  <option
                    key={ index } value={ item.day } className="text-gray-500"
                  >
                    { parseInt(item.day, 10) }
                  </option>
                );
              })
            }
          </select>
          <br />
          <input
            type="text"
            ref={ commentRef }
            onChange={
              (event) => {
                setEnteredComment(event.target.value);
              }
            }
            onKeyDown={
              async (event) => {
                if (event.key === "Enter" && selectedDay !== "") {
                  event.preventDefault();
                  addComment(state.params.id, state.params.month, selectedDay, enteredComment)
                    .then (() => {
                      setPlaceholder("完了");
                      setTimeout(() => setPlaceholder("Enterで削除 / コメントを入力"), 1000);
                    });
                  commentRef.current?.blur();
                  setPlaceholder("送信中...");
                  setEnteredComment("");
                }
              }
            }
            className="w-80 mt-1 px-1 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300"
            value={ enteredComment }
            placeholder={ placeholder }
            disabled={ pending }
          />
          {
            (enteredComment !== "") &&
              <>
                <br />
                <label className="text-gray-400">&rArr;Enterで確定</label>
              </>
          }
          <br />
        </>
      }
      <input 
        type="button" value={ text() }
        onClick={
          (event) => {
            if (isEditor) {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
            setIsEditor(!isEditor);
          }
        }
        className="text-white bg-teal-950 px-1 rounded mt-4 transition-colors duration-300 active:bg-teal-500"
      />
    </form>
  );
}
