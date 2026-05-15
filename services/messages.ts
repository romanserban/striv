import { supabase } from "@/lib/supabase";
import type { Conversation, Message } from "@/types/chat";

export const messagesService = {
  async listConversations() {
    const { data, error } = await supabase
      .from("conversations")
      .select("id, coach_id, client_id, created_at, coach_profiles(profiles(full_name)), client_profiles(profiles(full_name))")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as unknown as ConversationRow[]).map(normalizeConversation);
  },

  async getOrCreateConversation(clientProfileId: string) {
    const { data, error } = await supabase.rpc("get_or_create_conversation", {
      client_profile_id: clientProfileId
    });

    if (error) {
      throw error;
    }

    return data as string;
  },

  async listMessages(conversationId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at, read_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as Message[];
  },

  async sendMessage({ conversationId, senderId, body }: { conversationId: string; senderId: string; body: string }) {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        body
      })
      .select("id, conversation_id, sender_id, body, created_at, read_at")
      .single<Message>();

    if (error) {
      throw error;
    }

    return data;
  },

  subscribeToMessages(conversationId: string, onChange: () => void) {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
};

type ConversationProfileRow = {
  profiles?: { full_name: string } | { full_name: string }[] | null;
};

type ConversationRow = Omit<Conversation, "coach_profiles" | "client_profiles"> & {
  coach_profiles?: ConversationProfileRow | ConversationProfileRow[] | null;
  client_profiles?: ConversationProfileRow | ConversationProfileRow[] | null;
};

function normalizeConversation(row: ConversationRow): Conversation {
  const coachProfile = Array.isArray(row.coach_profiles) ? row.coach_profiles[0] ?? null : row.coach_profiles ?? null;
  const clientProfile = Array.isArray(row.client_profiles)
    ? row.client_profiles[0] ?? null
    : row.client_profiles ?? null;

  return {
    ...row,
    coach_profiles: coachProfile
      ? {
          profiles: Array.isArray(coachProfile.profiles) ? coachProfile.profiles[0] ?? null : coachProfile.profiles ?? null
        }
      : null,
    client_profiles: clientProfile
      ? {
          profiles: Array.isArray(clientProfile.profiles)
            ? clientProfile.profiles[0] ?? null
            : clientProfile.profiles ?? null
        }
      : null
  };
}
