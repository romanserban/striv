import { supabase } from "@/lib/supabase";
import type {
  CreateScheduledSessionInput,
  ScheduledSession,
  UpdateScheduledSessionInput
} from "@/types/scheduledSession";

const sessionSelect =
  "id, coach_id, client_id, title, description, session_type, start_time, end_time, location, status, created_at, updated_at, client_profiles(profiles(full_name)), coach_profiles(profiles(full_name))";

export const calendarService = {
  async createSession({
    coachId,
    clientId,
    title,
    description,
    sessionType,
    startTime,
    endTime,
    location
  }: CreateScheduledSessionInput) {
    const { data, error } = await supabase
      .from("scheduled_sessions")
      .insert({
        coach_id: coachId,
        client_id: clientId,
        title,
        description: description || null,
        session_type: sessionType || null,
        start_time: startTime,
        end_time: endTime,
        location: location || null,
        status: "scheduled"
      })
      .select(sessionSelect)
      .single<ScheduledSessionRow>();

    if (error) {
      throw error;
    }

    return normalizeSession(data);
  },

  async updateSession({
    sessionId,
    title,
    description,
    sessionType,
    startTime,
    endTime,
    location
  }: UpdateScheduledSessionInput) {
    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({
        title,
        description: description || null,
        session_type: sessionType || null,
        start_time: startTime,
        end_time: endTime,
        location: location || null
      })
      .eq("id", sessionId)
      .select(sessionSelect)
      .single<ScheduledSessionRow>();

    if (error) {
      throw error;
    }

    return normalizeSession(data);
  },

  async cancelSession(sessionId: string) {
    const { data, error } = await supabase
      .from("scheduled_sessions")
      .update({ status: "cancelled" })
      .eq("id", sessionId)
      .select(sessionSelect)
      .single<ScheduledSessionRow>();

    if (error) {
      throw error;
    }

    return normalizeSession(data);
  },

  async listCoachSessions() {
    const { data, error } = await supabase
      .from("scheduled_sessions")
      .select(sessionSelect)
      .order("start_time", { ascending: true });

    if (error) {
      throw error;
    }

    return ((data ?? []) as unknown as ScheduledSessionRow[]).map(normalizeSession);
  },

  async listClientSessions() {
    const { data, error } = await supabase
      .from("scheduled_sessions")
      .select(sessionSelect)
      .order("start_time", { ascending: true });

    if (error) {
      throw error;
    }

    return ((data ?? []) as unknown as ScheduledSessionRow[]).map(normalizeSession);
  }
};

type SessionProfileRow = {
  profiles?: { full_name: string } | { full_name: string }[] | null;
};

type ScheduledSessionRow = Omit<ScheduledSession, "client_profiles" | "coach_profiles"> & {
  client_profiles?: SessionProfileRow | SessionProfileRow[] | null;
  coach_profiles?: SessionProfileRow | SessionProfileRow[] | null;
};

function normalizeSession(row: ScheduledSessionRow): ScheduledSession {
  const clientProfile = Array.isArray(row.client_profiles) ? row.client_profiles[0] ?? null : row.client_profiles ?? null;
  const coachProfile = Array.isArray(row.coach_profiles) ? row.coach_profiles[0] ?? null : row.coach_profiles ?? null;

  return {
    ...row,
    client_profiles: clientProfile
      ? {
          profiles: Array.isArray(clientProfile.profiles) ? clientProfile.profiles[0] ?? null : clientProfile.profiles ?? null
        }
      : null,
    coach_profiles: coachProfile
      ? {
          profiles: Array.isArray(coachProfile.profiles) ? coachProfile.profiles[0] ?? null : coachProfile.profiles ?? null
        }
      : null
  };
}
