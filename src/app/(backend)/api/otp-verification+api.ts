import { supabase } from "@/backend/config/clients";
import { verifyPhone } from "@/backend/services/telnyxService";

const TELNYX_BEARER = process.env.TELNYX_BEARER;


export async function POST(request: Request) {

  const requestData = await request.json();

  const telnyxResponse = await verifyPhone(requestData.phone, requestData.token);

  if (telnyxResponse.data?.response_code == "accepted") {
    return await supabase
      .from("users")
      .update({ phone_number: requestData.phone })
      .eq("user_id", requestData.user_id);
  }
  else {
    return new Response(null, {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}