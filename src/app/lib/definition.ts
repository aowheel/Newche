export type Day = {
  day: string;
  start: string;
  end: string;
  status: number;
  comment: string | null;
}

export type State = {
  params: {
    id: number;
    month: string;
    schedule: Day[] | null;
  };
  error?: string;
};