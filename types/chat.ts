export type Conversation = {
  id: string;
  coach_id: string;
  client_id: string;
  created_at: string;
  coach_profiles?: {
    profiles?: {
      full_name: string;
    } | null;
  } | null;
  client_profiles?: {
    profiles?: {
      full_name: string;
    } | null;
  } | null;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};
