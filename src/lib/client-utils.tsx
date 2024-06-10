"use client";

import { transition3 } from "./server-utils";

export function week(dateString: string) {
  const daysOfWeek = ["日","月","火","水","木","金","土"];
  const date = new Date(dateString);
  const dayIndex = date.getDay();
  return daysOfWeek[dayIndex];
}

export function statusSymbol1(status: number) {
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

export function statusSymbol2(status: number) {
  switch (status) {
    case 0:
      return (
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
      );
    case 1:
      return (
        <svg className="w-8 h-8 fill-none stroke-current">
          <path d="M 5,5 L 27,27" />
          <path d="M 5,27 L 27,5" />
        </svg>
      );
    case 2:
      return (
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
      );
    default:
      return null;
  }
}

/*要検討*/
export function classEntry(
  prevState: { status: boolean, message: string, value?: number },
  formData: FormData
) {
  const membersClass = Number(formData.get("class"));
  if (typeof(membersClass) === "number" && membersClass > 0) {
    return {
      status: true, message: "登録可能です。", value: membersClass
    }
  } else {
    return {
      status: false, message: "期の条件を満たしていません。"
    };
  }
}
