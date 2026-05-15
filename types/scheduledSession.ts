export type ScheduledSessionStatus = "scheduled" | "completed" | "cancelled" | "missed";

export type ScheduledSession = {
  id: string;
  coach_id: string;
  client_id: string;
  title: string;
  description: string | null;
  session_type: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  status: ScheduledSessionStatus;
  created_at?: string;
  updated_at?: string;
  client_profiles?: {
    profiles?: {
      full_name: string;
    } | null;
  } | null;
  coach_profiles?: {
    profiles?: {
      full_name: string;
    } | null;
  } | null;
};

export type CreateScheduledSessionInput = {
  coachId: string;
  clientId: string;
  title: string;
  description?: string | null;
  sessionType?: string | null;
  startTime: string;
  endTime: string;
  location?: string | null;
};

export type UpdateScheduledSessionInput = {
  sessionId: string;
  title: string;
  description?: string | null;
  sessionType?: string | null;
  startTime: string;
  endTime: string;
  location?: string | null;
};
