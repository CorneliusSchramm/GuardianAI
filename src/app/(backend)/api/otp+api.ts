import { telnyx } from "@/backend/config/clients";
import { sendPhoneVerficationToken } from "@/backend/services/telnyxService";

const TELNYX_BEARER = process.env.TELNYX_BEARER;


export async function POST(request: Request) {

    const requestData = await request.json();
    return await sendPhoneVerficationToken(requestData.phone);
}