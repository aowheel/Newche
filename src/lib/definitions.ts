export type Schedule = {
  day: string;
  start: string;
  end: string;
  status: number;
  comment: string | null;
}

export type ScheduleTemplate = {
  day: string;
  start: string;
  end: string;
  comment: string | null;
}

export type OverallData = {
  ids: number[],
  names: string[],
  classes: number[],
  days: string[][],
  status: number[][],
  overallComment: string[][],
  individualComment: string[][]
}

export type RecentData = {
  day: string,
  start: string,
  end: string,
  participants: {
      class: number;
      name: string[];
  }[]
}