const RC = require("@ringcentral/sdk").SDK;
require("dotenv").config();

// Instantiate the SDK and get the platform instance
var rcsdk = new RC({
  server: process.env.RC_SERVER_URL,
  clientId: process.env.RC_CLIENT_ID,
  clientSecret: process.env.RC_CLIENT_SECRET,
});
var platform = rcsdk.platform();

/* Authenticate a user using a personal JWT token */
platform.login({ jwt: "SANDBOX-JWT" });

platform.on(platform.events.loginSuccess, async () => {
  let supervisorDeviceId = process.env.RC_SUPERVISOR_DEVICE_ID;
  let agentExtensionId = process.env.RC_AGENT_EXTENSION_ID;
  await read_agent_active_calls(agentExtensionId, supervisorDeviceId);
});

platform.on(platform.events.loginError, function (e) {
  console.log(
    "Unable to authenticate to platform. Check credentials.",
    e.message
  );
  process.exit(1);
});

/*
 * Read agent active calls
 */

async function read_agent_active_calls(agentExtensionId, supervisorDeviceId) {
  try {
    let endpoint = `/restapi/v1.0/account/~/extension/${agentExtensionId}/active-calls`;
    let resp = await platform.get(endpoint);
    let jsonObj = await resp.json();
    for (var record of jsonObj.records) {
      if (record.result == "In Progress") {
        submit_call_supervise_request(
          record.telephonySessionId,
          agentExtensionId,
          supervisorDeviceId
        );
        break;
      }
    }
  } catch (e) {
    console.log("Unable to read agent's active calls.", e.message);
  }
}

/*
 * Supervise an active call session
 */
async function submit_call_supervise_request(
  telephonySessionId,
  agentExtensionId,
  supervisorDeviceId
) {
  try {
    let endpoint = `/restapi/v1.0/account/~/telephony/sessions/${telephonySessionId}/supervise`;
    var bodyParams = {
      mode: "Listen",
      supervisorDeviceId: supervisorDeviceId,
      agentExtensionId: agentExtensionId,
    };
    let resp = await platform.post(endpoint, bodyParams);
    let jsonObj = await resp.json();
    console.log(jsonObj);
    return jsonObj;
  } catch (e) {
    console.log("Unable to supervise this call.", e.message);
  }
}

export async function GET(request: Request, { id }: Record<string, string>) {
  console.log("GET request received");
  // const sessionId = new URL(request.url).searchParams.get("session");
  console.log("Session ID: ", id);
  await platform.login({
    jwt: process.env.RC_JWT,
  });
  const callDetails = await submit_call_supervise_request(
    id,
    process.env.RC_AGENT_EXTENSION_ID,
    process.env.RC_SUPERVISOR_DEVICE_ID
  );

  return new Response(JSON.stringify({ message: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
