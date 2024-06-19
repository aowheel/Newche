"use client";

import { transition3 } from "@/lib/server-utils";
import { Orbitron } from "next/font/google";
import Link from "next/link";
const orbitron = Orbitron({
  weight: ["600"],
  subsets: ["latin"]
});

export default function NewcheLogo({ name }: {name?: string}) {
  if (name !== undefined) {
    return (
      <div className="flex justify-between items-baseline mx-2">
        <div className={`flex-none ${orbitron.className} text-4xl text-teal-500`}>
          Newche
        </div>
        <div className="flex-none">
          <Link href="/" className="text-gray-400 border-dashed border-b-2">🔗情報を見る</Link>
        </div>
        <div className="flex-none">
          <input
            type="button"
            onClick={async () => {
              const confirmed = confirm("別の名前を選択しますか?");
              if (confirmed) {
                await transition3();
              }
            }}
            value={name}
            className="mr-1 px-2 text-white bg-gray-400 rounded-full"
          />
          <span className="text-xs text-gray-400">さんのページ</span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="mx-2">
        <div className={`${orbitron.className} text-4xl text-teal-500`}>
          Newche
        </div>
      </div>
    );
  }
}
