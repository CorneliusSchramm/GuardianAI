const RC_SDK = require("@ringcentral/sdk").SDK;

const CALLER = "9084186493"; // alex
const RECIPIENT = "6467715728";

// const CALLER = "6467715728"; // alex
// const RECIPIENT = "9084186493"; corn get call from alex , alex call from rando number

var rcsdk = new RC_SDK({
  server: "https://platform.devtest.ringcentral.com",
  clientId: "eJzja15FmpfcFQe1pVomNT",
  clientSecret: "7Xi5iQN4jjqcmhjyUBp8tTWFJvqT3V8Cncz1KmvCpNqB",
});
var platform = rcsdk.platform();
platform.login({
  jwt: "eyJraWQiOiI4NzYyZjU5OGQwNTk0NGRiODZiZjVjYTk3ODA0NzYwOCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJodHRwczovL3BsYXRmb3JtLmRldnRlc3QucmluZ2NlbnRyYWwuY29tL3Jlc3RhcGkvb2F1dGgvdG9rZW4iLCJzdWIiOiI4OTM3NzkwMDUiLCJpc3MiOiJodHRwczovL3BsYXRmb3JtLmRldnRlc3QucmluZ2NlbnRyYWwuY29tIiwiZXhwIjozODU5MDczNjc3LCJpYXQiOjE3MTE1OTAwMzAsImp0aSI6IkRCeXg4SUwwU2FLUHpzVWRuazRkNncifQ.SsDff2JfBlgEhVhP4_Zp1zl-sIvRq7ZEVsu1q0LekdbKkMqR8lba0xM0KTOmRrZLDFbhxF2dt2Wn7JjKMayDSReQS3TMcqv99uV5V6fox949xzOc0GzaIfafKPyOwtwauYDfvRM4LBnKLdoyNlme0dwSFopHaoOUaLHnBwhgI9-BttK1H0dtFfK3bOVOpkh5HpVRgDfIXYjDGvIpxYzwHNtyko1S4SvphvCevDtE9E14NR2RIR2GSVWR3jexVl6UxMsRRXw-0ZFKNN3vMKPSX3VowPJF1ftS-X5rxVPMeYqoJSgC1SXbfWOAXR3hptvyRNl-9wHofwn08pW3afmKdQ",
});

platform.on(platform.events.loginSuccess, () => {
  call_ringout();
});

/*
 * Place a ring-out call
 */
async function call_ringout() {
  try {
    var resp = await platform.post(
      "/restapi/v1.0/account/~/extension/~/ring-out",
      {
        from: { phoneNumber: CALLER },
        to: { phoneNumber: RECIPIENT },
        playPrompt: false,
      }
    );
    var jsonObj = await resp.json();
    console.log("Call placed. Call status: " + jsonObj.status.callStatus);
  } catch (e) {
    console.log("Unable to place a ring-out call.", e.message);
  }
}
