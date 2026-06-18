Agent Factory Mini App
======================

Local/free use:
1. Start the existing agent with start_agent.bat.
2. Open: http://127.0.0.1:5000/app
3. Enter your Telegram chat_id.

Upload/free hosting:
1. Upload index.html, styles.css and app.js to any static host.
2. In the API field, enter your public Flask/ngrok URL.
3. The app reads:
   GET /flow/{chat_id}
   GET /

Telegram Mini App:
Use the uploaded HTTPS URL as the Web App URL in BotFather.
The backend must be reachable over HTTPS if Telegram opens it inside the app.
