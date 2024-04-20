# Expo Router and Tailwind CSS

Use [Expo Router](https://docs.expo.dev/router/introduction/) with [Nativewind](https://www.nativewind.dev/v4/overview/) styling.

## 🚀 How to get started

1. Clone Repo

2.  Install dependencies
```sh
npm install
```

3. Start server
```sh
npm start
```

## For Call control:
1. install and set up ngrok as explained here https://ngrok.com/download

2. start expo with ngrok
```sh
npx expo start --tunnel
```

3. Update environment variables and ngrok urls
    - include the TELNYX_BEARER in .env, this should the respective Voice API Application ID
    - Update "audio_url" in call_control+api.ts with correct ngrok url
    - Similarly update the webhook url in the telnyx portal, also set "Custom webhook timeout" to a few seconds in the portal
 
 Now you should be able to trigger a call through postman and see the logs in the app.

 Example in Postman: POST https://api.telnyx.com/v2/calls with

 ```json
 {
  "to": "+4917678210785",
  "from": "+12678609986",
  "from_display_name": "Guardian",
  "connection_id": "2408718095225980103"
}
 ```

Use "tail -f -n100 out.log" to track secondary console.


I also recommend installing the following VS add-ons:

- [Inline fold](https://marketplace.visualstudio.com/items?itemName=moalamri.inline-fold)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

