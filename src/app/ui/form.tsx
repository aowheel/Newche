'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { addMember, addDay, selectAttendance } from "@/app/lib/actions";
import { fetchMonthData } from "@/app/lib/data";

export function AddMember() {
  const initialState = {message: "Not yet sent."};
  const [state, dispatch] = useFormState(addMember, initialState);

  return (
    <form action={dispatch}>
      <input type="text" id="name" name="name" />
      <button type="submit" id="member-submit">Member Add</button>
      <p>{state.message}</p>
    </form>
  );
}

export function AddDay() {
  const initialState = {message: "Not yet sent."};
  const [state, dispatch] = useFormState(addDay, initialState);
 
  return (
    <form action={dispatch}>
      <textarea id="schedule" name="schedule" className="block w-[150px] min-h-[100px]" />
      <button type="submit" id="day-submit">Day Add</button>
      <p>{state.message}</p>
    </form>
  );
}

export async function SelectAttendance() {
  const initialState = {message: "Not yet sent."};
  const [state, dispatch] = useFormState(selectAttendance, initialState);
  const schedules = await fetchMonthData(2024, 5);

  return(
    <form action={dispatch}>
      <table>
        <tbody>
          {
            schedules.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{item.day}{item.week}{item.start}~{item.end}</th>
                  <td>
                    <input type="radio" id={`participate${index}`} name={`options${index}`} value="participate" />
                    <label>参加</label>
                    <input type="radio" id={`not_participate${index}`} name={`options${index}`} value="not_participate" />
                    <label>不参加</label>
                    <input type="radio" id={`undecided${index}`} name={`options${index}`} value="undecided" />
                    <label>未定</label>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <button type="submit" id="attendance-submit">Select Day</button>
      <p>{state.message}</p>
    </form>
  );
}