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

async function getCallDetails(telephonySessionId: string) {
  try {
    var resp = await platform.get(
      `/restapi/v1.0/account/~/telephony/sessions/${telephonySessionId}`,
      {
        view: "Simple",
      }
    );
    // Response should be something like:
    //   {
    //     "creationTime": "2024-03-29T21:17:38Z",
    //     "id": "s-a1d145704da1cz18e8c134b27z1547700000",
    //     "origin": {
    //       "type": "RingOut"
    //     },
    //     "parties": [
    //       {
    //         "accountId": "893779005",
    //         "attributes": {},
    //         "brandId": "1210",
    //         "direction": "Inbound",
    //         "extensionId": "893779005",
    //         "from": {
    //           "phoneNumber": "+16467715728"
    //         },
    //         "id": "p-a1d145704da1cz18e8c134b27z1547700000-1",
    //         "muted": false,
    //         "owner": {
    //           "accountId": "893779005",
    //           "brandId": "1210",
    //           "extensionId": "893779005"
    //         },
    //         "ringOutRole": "Initiator",
    //         "standAlone": false,
    //         "status": {
    //           "code": "Disconnected"
    //         },
    //         "to": {
    //           "phoneNumber": "+14707817034"
    //         }
    //       },
    //       {
    //         "attributes": {},
    //         "direction": "Inbound",
    //         "from": {
    //           "name": "GUARDIAN AI",
    //           "phoneNumber": "+14707817034"
    //         },
    //         "id": "p-a1d145704da1cz18e8c134b27z1547700000-2",
    //         "muted": false,
    //         "ringOutRole": "Target",
    //         "standAlone": false,
    //         "status": {
    //           "code": "Disconnected"
    //         },
    //         "to": {
    //           "phoneNumber": "+16467715728"
    //         }
    //       }
    //     ]
    //   }
    const callDetails = await resp.json();
    console.log("Call Details: ", callDetails);
    return callDetails;
  } catch (e) {
    console.log("error ins RC api call ", e.message);
  }
}

export async function GET(
  request: Request,
  { session }: Record<string, string>
) {
  console.log("GET request received");
  // const sessionId = new URL(request.url).searchParams.get("session");
  console.log("Session ID: ", session);
  await platform.login({
    jwt: process.env.RC_JWT,
  });
  const callDetails = await getCallDetails(session);

  return new Response(JSON.stringify({ message: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
