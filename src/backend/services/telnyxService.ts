import { telnyx } from "@/config/clients";
import { getCurrentDateTimeUrlEncoded } from "@/utils/datetime";

const curretTimeISO = getCurrentDateTimeUrlEncoded();
const WARNING_AUDIO = `https://kjkdpsfjyswkowwymfge.supabase.co/storage/v1/object/public/test/warning_sound_bite.mp3?t=${curretTimeISO}`;

export async function startTranscription(callControlId: string) {
  try {
    await telnyx.post(`calls/${callControlId}/actions/transcription_start`, {
      language: "en",
      transcription_engine: "B",
      transcription_tracks: "both",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function playWarningSound(callControlId: string) {
  try {
    await telnyx.post(`calls/${callControlId}/actions/playback_start`, {
      audio_url: WARNING_AUDIO,
      target_legs: "both",
    });
  } catch (error) {
    console.error(error);
  }
}
