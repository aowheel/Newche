import { sql } from '@vercel/postgres';

export async function fetchMonthData(year: number, month: number) {
  try {
    const day = await sql`
      SELECT 
      id,
      TO_CHAR(date, 'YYYY-MM-DD') as date,
      TO_CHAR(date, 'DD') as day,
      TO_CHAR(date, 'Dy') as week,
      TO_CHAR(start_time, 'HH24:MI') as start,
      TO_CHAR(end_time, 'HH24:MI') as end
      FROM day WHERE DATE_PART('year', date) = ${year} AND DATE_PART('month', date) = ${month}
      ORDER BY id;
    `;
    return day.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch month data.');
  }
}

export async function fetchMembersData(year: number, month: number) {
  try {
    const data = await sql`
      SELECT DISTINCT summary
      FROM (
          SELECT unnest(participate) AS summary FROM info WHERE DATE_PART('year', date) = ${year} AND DATE_PART('month', date) = ${month}
          UNION
          SELECT unnest(not_participate) FROM info WHERE DATE_PART('year', date) = ${year} AND DATE_PART('month', date) = ${month}
          UNION
          SELECT unnest(undecided) FROM info WHERE DATE_PART('year', date) = ${year} AND DATE_PART('month', date) = ${month}
      );
      SELECT array(summary)
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch members information.');
  }
}
