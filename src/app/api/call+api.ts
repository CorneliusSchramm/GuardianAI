// import RC from "@ringcentral/sdk";
// run with $ node sample.js
const RC = require("@ringcentral/sdk").SDK;
require("dotenv").config();

const RINGOUT_CALLER = process.env.RINGOUT_CALLER;
const RECIPIENT_NUMBER = process.env.RECIPIENT_NUMBER;

var rcsdk = new RC({
  server: process.env.RC_SERVER_URL,
  clientId: process.env.RC_CLIENT_ID,
  clientSecret: process.env.RC_CLIENT_SECRET,
});

var platform = rcsdk.platform();

async function call_ringout() {
  try {
    var resp = await platform.post(
      "/restapi/v1.0/account/~/extension/~/ring-out",
      {
        from: { phoneNumber: RINGOUT_CALLER },
        to: { phoneNumber: RECIPIENT_NUMBER },
        playPrompt: false,
      }
    );
    var jsonObj = await resp.json();
    console.log(
      "Call placed from call_ringout in API route. Call status: " +
        jsonObj.status.callStatus
    );
    return jsonObj;
  } catch (e) {
    console.log("error", e.message);
  }
}

export async function GET(request: Request) {
  // return Response.json({ hello: "world" });
  await platform.login({
    jwt: process.env.RC_JWT,
  });

  // platform.on(platform.events.loginSuccess, () => {
  //   call_ringout();
  // });

  const res = await call_ringout();
  console.log("res: ", res);
  const callStatus = res.status.callStatus;
  return new Response(JSON.stringify({ message: callStatus }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
