/*要検討*/
"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { addMember } from "@/lib/actions";
import { classEntry } from "@/lib/client-utils"
import { nameEntry } from "@/lib/data";
import NewcheLogo from "@/ui/newche-logo";
import Link from "next/link";
import clsx from "clsx";

export default function Page()
{
  const [nameState, nameDispatch] = useFormState(nameEntry, { status: false, message: "" });
  const [classState, classDispatch] = useFormState(classEntry,  { status: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <>
      <Link href="/"><NewcheLogo /></Link>
      <div className="flex justify-center">
        <div className="flex flex-col bg-black mt-10 px-8 py-20 rounded-xl">
          <form action={nameDispatch}>
            <input 
              type="text"
              name="name"
              placeholder="名前(字数:2~5)"
              onChange={(event) => {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }}
              className="text-white bg-black px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 rounded w-60"
            />
          </form>
          <p className={clsx({
            "text-teal-400": nameState.status,
            "text-red-500": !nameState.status
          })}>
            {nameState.message}
          </p>
          <form action={classDispatch}>
            <input
              type="number"
              name="class"
              placeholder="期"
              onChange={(event) => {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }}
              className="text-white bg-black mt-10 px-3 border-b-2 border-teal-700 focus:outline-none focus:border-teal-500 transition-colors duration-300 rounded w-60"
            />
          </form>
          <p className={clsx({
            "text-teal-400": classState.status,
            "text-red-500": !classState.status
          })}>
            {classState.message}
          </p>
          {
            nameState.status && classState.status &&
              <input
                type="button"
                value="メンバーを追加"
                onClick={ async (event) => {
                  setIsLoading(true);
                  event.preventDefault();
                  await addMember(nameState.value, classState.value);
                  setIsLoading(false);
                }}
                disabled={ isLoading }
                className="text-white bg-teal-500 rounded px-2 mt-10 mx-auto"
              />
          }
        </div>
      </div>
    </>
  );
}