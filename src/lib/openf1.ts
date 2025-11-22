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

export interface Session {
  meeting_key: number;
  session_key: number;
  session_name: string;
}

export interface Result {
  position: number;
  driver_number: number;
  number_of_laps: number;
  points: number;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  gap_to_leader: number;
  meeting_key: number;
  session_key: number;
}

export interface Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  team_name: string;
  team_colour: string;
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

export async function fetchSession(
  meetingKey: number,
  sessionName: string = "Race",
): Promise<Session> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sessions?meeting_key=${meetingKey}&session_name=${sessionName}`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No session found");
    }
    return data[0];
  } catch (error) {
    console.error("Failed to fetch session:", error);
    throw error;
  }
}

export async function fetchResults(sessionKey: number): Promise<Result[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/session_result?session_key=${sessionKey}`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch results:", error);
    throw error;
  }
}

export async function fetchDrivers(sessionKey: number): Promise<Driver[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/drivers?session_key=${sessionKey}`,
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    throw error;
  }
}
