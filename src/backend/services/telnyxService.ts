import { getCurrentDateTimeUrlEncoded } from "@/utils/datetime";
import { telnyx } from "../config/clients";
import { AnalysisOutput, TelnyxPhoneVerificationResponse } from "@/models/types";

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

export async function sendPhoneVerficationToken(phone: string) {
  try {
    return await telnyx.post("verifications/sms", {
      phone_number: phone,
      verify_profile_id: "4900018f-1715-f92e-1ea4-f8e6c268aaf8",
      type: "sms",
    });
  } catch (error) {
    console.error(error);
  }
}

export async function verifyPhone(phone: string, token: string): Promise<TelnyxPhoneVerificationResponse> {
  try {
    return await telnyx.post(
      `verifications/by_phone_number/${phone}/actions/verify`,
      {
        code: token,
        verify_profile_id: "4900018f-1715-f92e-1ea4-f8e6c268aaf8",
      });
  } catch (error) {
    console.error(error);
  }
}