"use client";
import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { nameEntry, classEntry, addMember } from "@/app/lib/server";
import NewcheLogo from "@/app/ui/newche-logo";
import Link from "next/link";
import clsx from "clsx";

export default function Page()
{
  const [nameState, nameDispatch] = useFormState(nameEntry, { status: false, message: "" });

  const [classState, classDispatch] = useFormState(classEntry,  { status: false, message: "" });
  
  return (
    <>
      <Link href="/"><NewcheLogo /></Link>
      <div className="flex justify-center">
        <div className="flex flex-col">
          <form action={nameDispatch}>
            <input 
              type="text"
              name="name"
              placeholder="名前(字数:2~5)"
              onChange={(event) => {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }}
              className="text-white bg-black mt-12 px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 rounded w-40"
            />
            <p className={clsx("mx-2", {
              "text-teal-400": nameState.status,
              "text-red-500": !nameState.status
            })}>
              {nameState.message}
            </p>
          </form>
          <form action={classDispatch}>
            <input
              type="number"
              name="class"
              placeholder="期"
              onChange={(event) => {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }}
              className="text-white bg-black mt-6 px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 rounded w-40"
            />
            <p className={clsx("mx-2", {
              "text-teal-400": classState.status,
              "text-red-500": !classState.status
            })}>
              {classState.message}
            </p>
          </form>
          {
            nameState.status && classState.status &&
              <input
                type="button"
                value="メンバーを追加"
                onClick={(event) => {
                  event.preventDefault();
                  addMember(nameState.value, classState.value)
                }}
                className="text-white bg-teal-500 rounded px-2 mx-2 mt-6"
              />
          }
        </div>
        
      </div>
    </>
  );
}