import { telnyx } from "@/config/clients";

const WARNING_AUDIO = "@assets/warning_sound_bite.mp3";

export async function startTranscription(callControlId: string) {
  const telnyxCall = new telnyx.Call({
    call_control_id: callControlId,
  });
  try {
    await telnyxCall.transcription_start({ language: "en" });
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
  } catch (error) {
    console.error(error);
  }
}
