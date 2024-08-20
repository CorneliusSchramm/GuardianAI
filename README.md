# Overview

*Guardian AI was initially developed as part of a startup project. Though we ultimately decided to pivot, we figured the code and concept may hold some value to share. It was fun to go through the motions of the initial stages of creating a startup and building a scrappy first proof of concept while learning react native, expo router and supabase.*

Guardian AI is an in-call AI assistant designed to protect the elderly from phone scams. Using LLMs and VOIP call forwarding, Guardian monitors incoming phone calls for signs of scams or non-human voices, alerting the user in real-time and providing a safer calling experience.

# Motivation

Elderly individuals are increasingly targeted by phone scammers, leading to significant financial losses and emotional distress. Guardian AI aimed to mitigate this risk by offering a user-friendly solution that detects potential fraud during phone calls and proactively warns users.

Here is Warren Buffet talking about his concerns regarding AI enabled scamming:

[warren buffet.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/ef259715-4608-4d5d-9dcb-3f99b9830a60/893b76f9-468f-46f1-891b-ac33650a00cb/warren_buffet.mp4)

# Marketing Materials

[Here](https://www.storydoc.com/4d343fe70f8e5a4178ab2339e5508d0d/b2509dda-27f1-46e4-8678-d01ba70392f5/660796d569c9c1f409702a30) is our slide deck with which we tried to raise money before we stopped the project.

[Here](https://www.guardian-ai.io/) is our website.

Here is a proof of concept video. 
In this working demo, an example scam call is routed through our VOIP network and monitored by our Guardian AI agent. As the call progresses, the console logs shows the the current analysis of the agent. When it becomes clear that the likelihood of a scam is high, GuardianAI intervenes.

[yc demo.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/ef259715-4608-4d5d-9dcb-3f99b9830a60/a051bd2a-895a-415a-9789-d817d58d2931/yc_demo.mp4)

Here is a demo of our app and sign up flow.

[Sequence 01 from Clideo.mp4](https://prod-files-secure.s3.us-west-2.amazonaws.com/ef259715-4608-4d5d-9dcb-3f99b9830a60/2489abfd-c9b7-4468-b9d0-118e81d50282/Sequence_01_from_Clideo.mp4)

# Tech Stack

- **App**: Expo + React Native, TypeScript, NativeWind
- **Database & Auth**: Supabase
- **VoIP Services & Transcription**: Telnyx
- **Scam Detection**: OpenAI Assistants API
- **Server**: Expo server components with TypeScript, deployed on Vercel and Expo Application Services

# Ideas for Future Work

- **Dynamic Model**: Continuously improves through a database of fraud attempts and user interactions.
- **Non-Human Voice Detection**: Identifies and warns about calls from non-human sources.
- Integration with **additional VoIP services**
- Expansion to **B2B markets**, offering services to telecom providers
- Adding **more user-friendly features** based on feedback (e.g. set up relatives as emergency contacts)

# Contact

For any questions or feedback, please contact us at:

![Screenshot 2024-08-19 at 4.06.14 PM.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/ef259715-4608-4d5d-9dcb-3f99b9830a60/f4ddbf1c-1771-4c14-a231-df5d506e1817/b448edbd-f02e-4c47-b35a-e23d56bf0463.png)

# Getting Started

## Prerequisites

- Node.js and npm
- Expo CLI
- Telnyx account for VoIP services
- OpenAI API key for scam detection via transcript analysis

## Installation

1. **Clone the repository**
    
    ```bash
    git clone <https://github.com/your-username/guardian-ai.git>
    cd guardian-ai
    ```
    
2. **Install dependencies**
    
    ```bash
    npm install
    ```
    
3. **Set up environment variables**
Create a `.env` file in the root directory with the following content:
    
    ```
    TELNYX_API_KEY=your_telnyx_api_key
    OPENAI_API_KEY=your_openai_api_key
    ```
    
4. **Set up development server / environment**
    1. install and set up ngrok as explained here https://ngrok.com/download (needed to receive telnyx webhook events locally)
    2. start expo with ngrok
        
        ```
        npx expo start --tunnel
        ```
        
    3. Update environment variables and ngrok urls
        - include the TELNYX_API_KEY in .env, this should the respective Voice API Application ID
        - Similarly update the webhook url in the telnyx portal, also set "Custom webhook timeout" to a few seconds in the portal
    4. Now you should be able to trigger a call through postman and see the logs in the app.
        
        Example in Postman: POST https://api.telnyx.com/v2/calls with
        
        ```
        {
         "to": "+49112345678",
         "from": "+12232323",
         "from_display_name": "Guardian",
         "connection_id": "240871809522509876"
        }
        ```
        
    5. Use "tail -f -n100 out.log" to track secondary console.

## Usage

1. **Running the App**: Open the Expo Go app on your phone and scan the QR code from the terminal to run the app.
2. **VoIP Configuration**: Ensure your Telnyx account is configured correctly to route calls through the Guardian AI app.
3. **AI Monitoring**: The app will automatically monitor calls and provide real-time alerts for any detected scams or non-human voices.
