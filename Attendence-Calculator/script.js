// ---------- Elements ----------
const totalEl = document.getElementById('totalClasses');
const attendedEl = document.getElementById('attendedClasses');
const targetEl = document.getElementById('targetAttendance');

const percentEl = document.getElementById('attendancePercent');
const presentEl = document.getElementById('presentResult');
const absentEl = document.getElementById('absentResult');
const bunkEl = document.getElementById('bunkResult');
const needEl = document.getElementById('needAttendResult');
const statusEl = document.getElementById('statusResult');
const barEl = document.getElementById('progressBar');

// Optional settings from config.js (the page still works if it is missing)
const CFG = window.APP_CONFIG || {};
const GEMINI_KEY = (CFG.GEMINI_API_KEY || '').trim();
const GEMINI_MODEL = (CFG.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();

// ---------- Calculator ----------
function calculate() {
    const total = parseInt(totalEl.value, 10);
    const attended = parseInt(attendedEl.value, 10);
    const target = parseFloat(targetEl.value);

    if (isNaN(total) || isNaN(attended) || total <= 0 || attended < 0) {
        alert('Please enter valid total and attended classes.');
        return;
    }
    if (attended > total) {
        alert('Attended classes cannot be more than total classes.');
        return;
    }
    if (isNaN(target) || target < 1 || target > 100) {
        alert('Target must be between 1 and 100.');
        return;
    }

    const pct = (attended / total) * 100;
    const absent = total - attended;

    // Classes you can still skip and stay at or above the target
    let bunk = Math.floor((attended * 100) / target - total);
    if (bunk < 0) bunk = 0;

    // Classes you must attend in a row to reach the target
    let needText = '0';
    if (pct < target) {
        if (target >= 100) {
            needText = 'Not possible';
        } else {
            needText = String(Math.ceil((target * total - 100 * attended) / (100 - target)));
        }
    }

    const safe = pct >= target;

    percentEl.textContent = pct.toFixed(2) + '%';
    presentEl.textContent = attended;
    absentEl.textContent = absent;
    bunkEl.textContent = bunk;
    needEl.textContent = needText;
    statusEl.textContent = safe ? 'Safe' : 'Low';
    statusEl.className = safe ? 'safe' : 'low';

    barEl.style.width = Math.min(pct, 100) + '%';
    barEl.classList.toggle('low', !safe);
}

function resetAll() {
    totalEl.value = '';
    attendedEl.value = '';
    targetEl.value = 75;
    percentEl.textContent = '0%';
    presentEl.textContent = '0';
    absentEl.textContent = '0';
    bunkEl.textContent = '0';
    needEl.textContent = '0';
    statusEl.textContent = '-';
    statusEl.className = '';
    barEl.style.width = '0%';
    barEl.classList.remove('low');
    clearScan();
}

document.getElementById('calculateBtn').addEventListener('click', calculate);
document.getElementById('resetBtn').addEventListener('click', resetAll);

// Enter key calculates
[totalEl, attendedEl, targetEl].forEach((el) =>
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calculate();
    })
);

// ---------- Screenshot analyser ----------
const scanBtn = document.getElementById('scanBtn');
const fileInput = document.getElementById('screenshotInput');
const dropZone = document.getElementById('dropZone');
const previewImg = document.getElementById('previewImg');
const scanProgress = document.getElementById('scanProgress');
const scanBar = document.getElementById('scanProgressBar');
const scanStatus = document.getElementById('scanStatus');
const scanMode = document.getElementById('scanMode');

scanMode.textContent = GEMINI_KEY
    ? 'Mode: AI (Gemini), falls back to offline reader if needed'
    : 'Mode: offline reader (add a free Gemini key in config.js for AI mode)';

function setStatus(msg, type) {
    scanStatus.textContent = msg;
    scanStatus.className = 'scan-status' + (type ? ' ' + type : '');
}

function clearScan() {
    previewImg.hidden = true;
    previewImg.removeAttribute('src');
    scanProgress.hidden = true;
    scanBar.style.width = '0%';
    setStatus('');
    fileInput.value = '';
}

// Shrink big screenshots so the AI call is fast and light
function imageToBase64(file, maxSide = 1600) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            URL.revokeObjectURL(url);
            resolve(dataUrl.split(',')[1]);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Could not open the image.'));
        };
        img.src = url;
    });
}

// ----- Option A: AI analysis with Gemini -----
async function analyseWithGemini(file) {
    const base64 = await imageToBase64(file);
    const prompt =
        'This is a screenshot of a student attendance page. ' +
        'Find the overall total number of classes held and the number of classes attended. ' +
        'If the screenshot shows several subjects, add them together. ' +
        'If only a percentage and a total are shown, work out attended from them. ' +
        'Reply with JSON only, like {"total": 45, "attended": 38}. ' +
        'If you cannot find the numbers, reply {"total": null, "attended": null}.';

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
        encodeURIComponent(GEMINI_MODEL) + ':generateContent';

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_KEY
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { inline_data: { mime_type: 'image/jpeg', data: base64 } }
                ]
            }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0 }
        })
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error('Gemini error ' + res.status + ': ' + body.slice(0, 160));
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
    const json = JSON.parse(text.replace(/```json|```/g, '').trim());
    const total = parseInt(json.total, 10);
    const attended = parseInt(json.attended, 10);

    if (!isNaN(total) && !isNaN(attended) && total > 0 && attended >= 0 && attended <= total) {
        return { total, attended, note: 'AI read total ' + total + ' and attended ' + attended + '.' };
    }
    return null;
}

// ----- Option B: offline OCR (Tesseract.js) -----
function parseAttendance(text) {
    const clean = text.replace(/[,|]/g, ' ').replace(/\s+/g, ' ');

    // "38/45" pairs, one per subject or one overall
    const pairs = [];
    const pairRe = /(\d{1,3})\s*\/\s*(\d{1,3})(?!\d)/g;
    let m;
    while ((m = pairRe.exec(clean)) !== null) {
        const a = parseInt(m[1], 10);
        const t = parseInt(m[2], 10);
        if (t > 0 && a <= t && t <= 500) pairs.push([a, t]);
    }
    if (pairs.length === 1) {
        return { attended: pairs[0][0], total: pairs[0][1], note: 'Found ' + pairs[0][0] + '/' + pairs[0][1] + '.' };
    }
    if (pairs.length > 1) {
        const a = pairs.reduce((s, p) => s + p[0], 0);
        const t = pairs.reduce((s, p) => s + p[1], 0);
        return { attended: a, total: t, note: 'Found ' + pairs.length + ' subjects and added them together.' };
    }

    // Labelled numbers
    const grab = (words) => {
        const re = new RegExp('(?:' + words + ')[^0-9]{0,20}(\\d{1,3})(?!\\d)', 'i');
        const r = clean.match(re);
        return r ? parseInt(r[1], 10) : null;
    };
    const total = grab('total|held|conducted|delivered|lectures|classes');
    const attended = grab('attended|present|attendance count');
    if (total && attended !== null && attended <= total) {
        return { attended, total, note: 'Found total ' + total + ' and attended ' + attended + '.' };
    }

    // Percentage + total
    const pctMatch = clean.match(/(\d{1,3}(?:\.\d+)?)\s*%/);
    if (pctMatch && total) {
        const pct = parseFloat(pctMatch[1]);
        const a = Math.round((pct / 100) * total);
        return { attended: a, total, note: 'Worked out attended from ' + pct + '% of ' + total + '.' };
    }

    return null;
}

async function analyseWithOCR(file) {
    if (typeof Tesseract === 'undefined') {
        throw new Error('The offline reader could not load. Check your internet and refresh.');
    }
    const result = await Tesseract.recognize(file, 'eng', {
        logger: (info) => {
            if (info.status === 'recognizing text') {
                scanBar.style.width = Math.round(info.progress * 100) + '%';
            }
        }
    });
    return parseAttendance(result.data.text || '');
}

// ----- Main flow -----
async function analyseImage(file) {
    if (!file || !file.type || !file.type.startsWith('image/')) {
        setStatus('Please choose an image file (PNG, JPG, WEBP).', 'warn');
        return;
    }

    previewImg.src = URL.createObjectURL(file);
    previewImg.hidden = false;
    scanProgress.hidden = false;
    scanBar.style.width = '5%';
    scanBtn.disabled = true;

    let parsed = null;
    let aiError = '';

    try {
        if (GEMINI_KEY) {
            setStatus('AI is reading your screenshot...');
            try {
                parsed = await analyseWithGemini(file);
                scanBar.style.width = '100%';
            } catch (err) {
                aiError = err.message;
            }
        }

        if (!parsed) {
            setStatus(aiError ? 'AI failed, using offline reader...' : 'Reading screenshot...');
            parsed = await analyseWithOCR(file);
        }

        if (parsed) {
            totalEl.value = parsed.total;
            attendedEl.value = parsed.attended;
            setStatus(parsed.note + ' Please check the numbers.', 'ok');
            calculate();
        } else {
            setStatus('Could not find attendance numbers. Try a clearer or cropped screenshot, or type them in.', 'warn');
        }
    } catch (err) {
        setStatus(err.message || 'Something went wrong. Please try again.', 'warn');
    } finally {
        scanBtn.disabled = false;
        scanBar.style.width = '100%';
        fileInput.value = '';
    }
}

// Click to choose a file
scanBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) analyseImage(fileInput.files[0]);
});

// Drag and drop anywhere on the page (stops the browser opening the image)
let dragDepth = 0;
window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragDepth++;
    dropZone.classList.add('drag');
});
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dropZone.classList.remove('drag');
});
window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDepth = 0;
    dropZone.classList.remove('drag');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) analyseImage(file);
});

// Paste (Ctrl+V)
document.addEventListener('paste', (e) => {
    const items = e.clipboardData ? e.clipboardData.items : [];
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            analyseImage(item.getAsFile());
            break;
        }
    }
});
