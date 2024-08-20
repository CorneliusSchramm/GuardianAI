# Overview
*Guardian AI was initially developed as part of a startup project. Though we ultimately decided to pivot, we figured the code and concept may hold some value to share. It was fun to go through the motions of the initial stages of creating a startup and building a scrappy first proof of concept while learning react native, expo router and supabase.*
Guardian AI is an in-call AI assistant designed to protect the elderly from phone scams. Using LLMs and VOIP call forwarding, Guardian monitors incoming phone calls for signs of scams or non-human voices, alerting the user in real-time and providing a safer calling experience.

# Motivation
Elderly individuals are increasingly targeted by phone scammers, leading to significant financial losses and emotional distress. Guardian AI aimed to mitigate this risk by offering a user-friendly solution that detects potential fraud during phone calls and proactively warns users.
Here is Warren Buffet talking about his concerns regarding AI enabled scamming:
https://github.com/user-attachments/assets/27573039-5b15-4252-aaef-5223aba53d6c

# Marketing Materials
[Here](https://www.storydoc.com/4d343fe70f8e5a4178ab2339e5508d0d/b2509dda-27f1-46e4-8678-d01ba70392f5/660796d569c9c1f409702a30) is our slide deck with which we tried to raise money before we stopped the project.
[Here](https://www.guardian-ai.io/) is our website.

Here is a proof of concept video. 
In this working demo, an example scam call is routed through our VOIP network and monitored by our Guardian AI agent. As the call progresses, the console logs shows the the current analysis of the agent. When it becomes clear that the likelihood of a scam is high, GuardianAI intervenes.
https://github.com/user-attachments/assets/0558321b-a052-4fe2-8a65-f090ae35cf92
Here is a demo of our app and sign up flow.
https://github.com/user-attachments/assets/d59daf09-5e02-4ef8-af94-ae9acb1fa741

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
![contact](https://github.com/user-attachments/assets/54a62be0-6981-44d5-ace0-0f6a43a82a92)

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
