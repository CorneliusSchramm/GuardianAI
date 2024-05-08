import { telnyx } from "@/backend/config/clients";

const WARNING_AUDIO =
  "https://kjkdpsfjyswkowwymfge.supabase.co/storage/v1/object/public/test/warning_sound_bite.mp3?t=2024-04-30T20%3A20%3A53.697Z";

export async function startTranscription(callControlId: string) {
  const telnyxCall = new telnyx.Call({
    call_control_id: callControlId,
  });
  try {
    await telnyxCall.transcription_start({
      language: "en",
      transcription_engine: "B",
      transcription_tracks: "both",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function playWarningSound(callControlId: string) {
  const telnyxCall = new telnyx.Call({
    call_control_id: callControlId,
  });
  try {
    telnyxCall.playback_start({
      audio_url: WARNING_AUDIO,
      target_legs: "both",
    });
    console.log(`Played warning sound on call ${telnyxCall}`);
  } catch (error) {
    console.error(error);
  }
}
