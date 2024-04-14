import OpenAI from "openai";

const OPEN_API_KEY = process.env.OPEN_API_KEY;
const openai = new OpenAI({ apiKey: OPEN_API_KEY });

const TELNYX_BEARER = process.env.TELNYX_BEARER;

export async function POST(request: Request) {
    // Log request headers for debugging
    console.log(request.headers);

    // Parse the request body from JSON
    const requestData = await request.json();
    console.log(requestData);

    if (requestData.data.event_type === "call.answered") {
        startTranscription(requestData.data.payload.call_control_id);

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
    return analyzeTranscription(requestData);
};

function startTranscription(call_control_id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + TELNYX_BEARER);

    var raw = JSON.stringify({
        "transcription_engine": "B",
        "language": "en",
        "transcription_tracks": "both"
    });

    var requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.telnyx.com/v2/calls/" + call_control_id + "/actions/transcription_start", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
};

async function analyzeTranscription(requestData) {
    let transcription_text = requestData.data.payload.transcription_data.transcript;

    const assistant_id = "asst_6j3mCmqHeBm1GQP0T8llXTMm";
    const thread_id = "thread_jkjV6Q6kQPouKz2f4x0SQ0kV";

    try {
        const message = await openai.beta.threads.messages.create(
            thread_id,
            {
                role: "user",
                content: transcription_text,
            }
        );

        let run = await openai.beta.threads.runs.create(
            thread_id,
            {
                assistant_id: assistant_id,
                // instructions: "Please provide your assessment of the full phone call in the JSON format outlined in the instructions you received.",
            }
        );

        while (['queued', 'in_progress', 'cancelling'].includes(run.status)) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            run = await openai.beta.threads.runs.retrieve(
                run.thread_id,
                run.id
            );
        }

        let result;

        if (run.status === 'completed') {
            const messages = await openai.beta.threads.messages.list(
                run.thread_id
            );
            for (const message of messages.data.reverse()) {
                // console.log(`${message.role} > ${message.content[0]["text"].value}`);
                result = message.content[0]["text"].value;
            }
        } else {
            console.log(run.status);
        }

        // Extracting and returning the result
        result = JSON.parse(result);
        result.transcription = transcription_text;

        console.log(result);

        if (result.score > 80) {
            console.log("Scam detected!");
            playWarningSound(requestData.data.payload.call_control_id);
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
};


function playWarningSound(call_control_id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + TELNYX_BEARER);

    var raw = JSON.stringify({
        "audio_url": "https://zwbrsmk-anonymous-8081.exp.direct/assets/scam_warning.mp3",
        "target_legs": "both"
    });

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://api.telnyx.com/v2/calls/" + call_control_id + "/actions/playback_start", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
};
