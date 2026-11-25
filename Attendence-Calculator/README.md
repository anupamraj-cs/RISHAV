# Attendance Calculator (with screenshot analyser)

## Files
- index.html: the page
- style.css: Nexyes-style black, green and gold design
- script.js: calculator + screenshot analyser
- config.js: where you paste your free AI key

## How the screenshot analyser works
1. With no key: an offline reader (Tesseract.js) finds numbers like 38/45.
2. With a free Gemini key: an AI reads the screenshot and understands almost any layout.
   If the AI fails (limit reached, no internet), it falls back to the offline reader.

## Add your free Gemini key (about 2 minutes)
1. Open https://aistudio.google.com/apikey and sign in with Google.
2. Click "Create API key" and copy it.
3. Open config.js and paste it: GEMINI_API_KEY: "your-key-here"
4. Upload the files to your site again. The page will say "Mode: AI (Gemini)".

## Keep the key safe (important)
Your site is plain HTML, so the key is visible to anyone who views the page source.
Do this so nobody can misuse it:
1. Open https://console.cloud.google.com/apis/credentials and click your key.
2. Under "Application restrictions" choose "Websites" and add:
   https://rishavtiwari.dpdns.org/*
3. Under "API restrictions" choose "Generative Language API".
4. Save. Stay on the free tier (do not enable billing) so it can never cost money.

## If the AI says "model not found"
Models change often. Open https://ai.google.dev/gemini-api/docs/models,
copy a current free Flash or Flash-Lite model name and put it in GEMINI_MODEL in config.js.

## Test locally
Double-click index.html. If the AI is blocked on file://, run:
python -m http.server 8000
and open http://localhost:8000
