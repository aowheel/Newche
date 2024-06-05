"use client";

import { useFormState } from "react-dom";
import { filteredMembers } from "@/lib/data";
import { transition1 } from "@/lib/server-utils";

export default function SelectMember({ names }: { names: string[][]}) {
  const initialState = {
    names: names
  };
  const [state, dispatch] = useFormState(filteredMembers, initialState);

  return (
    <div className="flex justify-center py-8">
      <div className="flex flex-col p-4 border rounded-xl">
        <form action={ dispatch }>
          <input
            type="number"
            name="class"
            placeholder="期を入力"
            onChange={(event) => {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }}
            className="border rounded w-24 px-2"
          />
          <p className="text-xs text-red-600">{ state?.message }</p>
        </form>
        <select
          name="name"
          onChange={async (event) => {
            const id = event.target.value;
            await transition1(id);
          }}
          className="border rounded w-36 mt-4 px-2"
        >
          <option className="text-gray-400">名前を選択</option>
          { state.names?.map((item, index) => {
            return (
              <option key={index} value={ item[0] }>{ item[1] }</option>
            );
          }) }
        </select>
      </div>
    </div>
  );
}