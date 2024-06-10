"use client";

export default function RecentDetails(
  { data }: {
    data: {
      day: string,
      start: string,
      end: string, 
      participants: {
        class: number, name: string[]
      }[],
      comments: {
        name: string, comment: string
      }[]
    }
  }
) {
  return (
    <div className="mx-2 mt-4 p-2 rounded-2xl text-teal-200 bg-black border-2 border-teal-200">
      <span className="text-2xl px-2 mx-1 font-bold">
      {data.day}</span>
      <span className="text-lg font-bold">{data.start}-{data.end}</span>
      <table className="mx-6 my-2">
        <tbody>
          {data.participants.map((item1, index1) => {
            return (
              <tr key={index1}>
                <th>{item1.class}期&#9656;</th>
                {item1.name.map((item2, index2) => {
                  return (
                    <td key={index2} className="px-2">{item2}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.comments.map((item, index) => {
        return (
          <span key={index} className="mx-6">{item.name}&#9656;&ensp;{item.comment}</span>
        );
      })}
    </div>
  );
}