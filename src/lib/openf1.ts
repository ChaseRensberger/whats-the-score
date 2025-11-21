export interface Meeting {
  meeting_key: number;
  meeting_name: string;
  circuit_short_name: string;
  date_start: string;
  year: number;
}

export interface Schedule {
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = "https://api.openf1.org/v1";

export async function fetchSchedule(year: number): Promise<Meeting[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/meetings?year=${year}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    throw error;
  }
}

export function sortByDate(meetings: Meeting[]): Meeting[] {
  return [...meetings].sort(
    (a, b) =>
      new Date(a.date_start).getTime() - new Date(b.date_start).getTime(),
  );
}

export function getRoundNumber(meetings: Meeting[], meeting: Meeting): number {
  const sorted = sortByDate(meetings);
  return sorted.findIndex((m) => m.meeting_key === meeting.meeting_key) + 1;
}

export function formatDateRange(dateStart: string): string {
  const date = new Date(dateStart);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 2);
  const endDay = endDate.getDate();

  return `${month}/${day}-${month}/${endDay}`;
}
