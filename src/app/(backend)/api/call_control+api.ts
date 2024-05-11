import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

const TELNYX_BEARER = process.env.TELNYX_BEARER;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Using require to access fs module
const fs = require("fs");

// tail -f -n100 out.log
// Using require to access console module
const { Console } = require("console");

// Creating write Stream
// const output = fs.createWriteStream("./out.log");
// const errorOutput = fs.createWriteStream("./err.log");

let warningColor = "color:red; font-size:20px;";

//
const options = {
  stdout: output,
  stderr: errorOutput,
  ignoreErrors: true,
  colorMode: true,
};
// const logger = new Console(options);

export async function POST(request: Request) {
  // Log request headers for debugging
  console.log(request.headers);

  // Parse the request body from JSON
  const requestData = await request.json();
  console.log(requestData);

  if (requestData.data.event_type === "call.answered") {
    // logger.log(
    //   `[${getCurrentTime()}] Call answered. Starting transcription...`
    // );
    startTranscription(requestData.data.payload.call_control_id);

    return new Response(null, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (requestData.data.event_type === "call.hangup") {
    // logger.log(`[${getCurrentTime()}] Call ended. Stopping transcription...`);

    return new Response(null, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (requestData.data.event_type !== "call.transcription") {
    // return 200
    return new Response(null, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // analyze the transcription by calling the OpenAI API
  // return analyzeTranscription(requestData);
  await storeTranscription(requestData);

  // aggregate the transcription and send it to OpenAI
  aggregateTranscription(requestData);

  return new Response(null, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function startTranscription(call_control_id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + TELNYX_BEARER);

  var raw = JSON.stringify({
    transcription_engine: "B",
    language: "en",
    transcription_tracks: "both",
  });

  var requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://api.telnyx.com/v2/calls/" +
      call_control_id +
      "/actions/transcription_start",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

async function storeTranscription(requestData) {
  // append the transcription to a file
  const transcription_text =
    requestData.data.payload.transcription_data.transcript;
  const call_control_id = requestData.data.payload.call_control_id;

  console.log(transcription_text);

  // store in supabase
  return await supabase.from("transcriptions").insert({
    transcription: transcription_text,
    call_control_id: call_control_id,
  });
}

async function aggregateTranscription(requestData) {
  const call_control_id = requestData.data.payload.call_control_id;

  const { data, error } = await supabase
    .from("transcriptions")
    .select(`id, transcription, analyzed`)
    .eq("call_control_id", call_control_id)
    .eq("analyzed", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  console.log(data);
  let transcription_text = data.map((d) => d.transcription).join(" ");

  console.log(transcription_text);

  // if transcription_text contains end of a sentence, then analyze the transcription
  // or if the transcription is longer than 200 characters
  if (
    transcription_text.length > 200 ||
    transcription_text.includes("credit card")
  ) {
    // transcription_text.includes(".") || transcription_text.includes("?") ||
    console.log("Analyzing the transcription");
    // logger.log(`[${getCurrentTime()}] Analyzing the transcript...`);

    analyzeTranscription(transcription_text, call_control_id);

    const update = data.map((d) => ({ id: d.id, analyzed: true }));

    // update the transcription in the database, mark as analyzed
    await supabase
      .from("transcriptions")
      // upsert data ids, set analyzed to true, use data.id as an identifier
      .upsert(update);
  }
}

async function analyzeTranscription(transcription_text, call_control_id) {
  const assistant_id = "asst_6j3mCmqHeBm1GQP0T8llXTMm";
  const thread_id = "thread_jkjV6Q6kQPouKz2f4x0SQ0kV";

  try {
    const message = await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: transcription_text,
    });

    let run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistant_id,
      // instructions: "Please provide your assessment of the full phone call in the JSON format outlined in the instructions you received.",
    });

    while (["queued", "in_progress", "cancelling"].includes(run.status)) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
    }

    let result;

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        // console.log(`${message.role} > ${message.content[0]["text"].value}`);
        result = message.content[0]["text"].value;
      }
    } else {
      console.log(run.status);
    }

    // Extracting and returning the result
    result = JSON.parse(result);

    // logger.log({
    //   score: result.score,
    //   confidence: result.confidence,
    //   reasoning: result.reasoning,
    // });

    result.transcription = transcription_text;

    console.log(result);

    if (result.score > 80) {
      console.log("Scam detected!");
      // logger.log(
      //   "\x1b[31m%s\x1b[0m",
      //   `[${getCurrentTime()}] Scam detected!!! Warning the user...`
      // );
      playWarningSound(call_control_id);
    }

    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function playWarningSound(call_control_id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + TELNYX_BEARER);

  var raw = JSON.stringify({
    audio_url:
      "https://zwbrsmk-anonymous-8081.exp.direct/assets/warning_sound_bite.mp3",
    target_legs: "both",
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://api.telnyx.com/v2/calls/" +
      call_control_id +
      "/actions/playback_start",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

function getCurrentTime() {
  var d = new Date();
  d = new Date(d.getTime() - 3000000);
  return (
    d.getFullYear().toString() +
    "-" +
    ((d.getMonth() + 1).toString().length == 2
      ? (d.getMonth() + 1).toString()
      : "0" + (d.getMonth() + 1).toString()) +
    "-" +
    (d.getDate().toString().length == 2
      ? d.getDate().toString()
      : "0" + d.getDate().toString()) +
    " " +
    (d.getHours().toString().length == 2
      ? d.getHours().toString()
      : "0" + d.getHours().toString()) +
    ":" +
    (((d.getMinutes() / 5) * 5).toString().length == 2
      ? ((d.getMinutes() / 5) * 5).toString()
      : "0" + ((d.getMinutes() / 5) * 5).toString()) +
    ":" +
    (((d.getSeconds() / 5) * 5).toString().length == 2
      ? ((d.getSeconds() / 5) * 5).toString()
      : "0" + ((d.getSeconds() / 5) * 5).toString())
  );
}
