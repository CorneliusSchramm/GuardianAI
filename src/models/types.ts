export type TelnyxEvent = {
  data: TelnyxEventData;
  meta: {
    attempt: number;
    delivered_to: string;
  };
};

export type TelnyxEventData = {
  event_type: string;
  id: string;
  occurred_at: string;
  payload: TelnyxEventPayload;
  record_type: string;
};

export type TelnyxEventPayload = {
  call_control_id: string;
  call_leg_id: string;
  call_session_id: string;
  client_state: null | string;
  connection_id: string;
  transcription_data?: any; // Optional, replace 'any' with the actual type if known
  media_name?: string; // Optional
  media_url?: string; // Optional
  overlay?: boolean; // Optional
  playback_id?: string; // Optional
  status?: string; // Optional
  status_detail?: string; // Optional
  from?: string; // Optional
  to?: string; // Optional
  start_time?: string; // Optional
};

export type AnalysisOutput = {
  analyses_chunk_id?: never;
  category?: string;
  confidence?: number;
  created_at?: string;
  previous_score: number;
  reasoning?: string;
  score?: number;
  sub_category?: string;
  updated_at?: string;
};

export type TelnyxPhoneVerificationResponse = {
  data: {
    phone_number: string,
    response_code: string
  }
};
