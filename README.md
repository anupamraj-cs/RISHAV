# Portfolio

A static website. No build step, no installs.

## Open it in VS Code

1. Unzip this folder and open it in VS Code (File > Open Folder).
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **Open with Live Server**.

Use Live Server, not a double-click. A page opened from disk (`file://`) cannot read your PDFs, so the card previews would not draw.

## Where things are

| File | What it does |
| --- | --- |
| `data.js` | All your text, links, certificates and achievements. Edit this one most. |
| `style.css` | Colours, fonts, layout. |
| `script.js` | Builds the page from `data.js`. |
| `assets/` | Your photo, resume, and PDF or image files. |

## Add or change a certificate

1. Copy the PDF (or an image) into `assets/certificates/`.
2. In `data.js`, add or edit a line in `certificates`:

```js
{ title: "AWS", issuer: "AMAZON", date: "2026", file: "assets/certificates/aws.pdf" },
```

3. Save. The card shows a picture of the PDF's first page, and clicking it opens the PDF.

If `file` is an image (`.png`, `.jpg`), the image itself is the preview.

To show a different picture on the card, add a `preview`:

```js
{ title: "AWS", issuer: "AMAZON", file: "assets/certificates/aws.pdf", preview: "assets/certificates/aws.png" },
```

## When a PDF cannot be previewed: company logo

If a certificate's PDF is missing, or the browser cannot draw it, the card shows the issuing company's logo. With no logo file it shows the issuer's name in large letters, for example ISRO or DUCAT.

1. Save the logo in `assets/logos/` (for example `assets/logos/ducat.png`).
2. In `data.js`, point the certificate at it:

```js
{ title: "C & Java Beginner", issuer: "DUCAT", file: "assets/certificates/ducat.pdf", logo: "assets/logos/ducat.png" },
```

To show the logo on a card even when the PDF is fine, add `preview: "logo"`:

```js
{ title: "AWS", issuer: "AMAZON", file: "assets/certificates/aws.pdf", logo: "assets/logos/aws.png", preview: "logo" },
```

Use logos you have the right to display, such as ones from the company's own press or brand page.

## Add or change an achievement

Same idea, in `achievements`, with files in `assets/achievements/`:

```js
{ text: "Winner, college hackathon", file: "assets/achievements/hackathon.pdf" },
```

Leave out `file` for an achievement that needs no document.

## Your photo and resume

- Photo: save it as `assets/profile.jpg` (or change the path in `data.js`). Until it loads, your initials show.
- Resume: save it as `assets/resume.pdf`.

## Put it online

Upload the whole folder to Netlify (drag and drop), GitHub Pages or Vercel. The previews work there too.

## Files this project expects

```
assets/profile.jpg
assets/resume.pdf
assets/certificates/python-isro.pdf
assets/certificates/aws.pdf
assets/certificates/cpp-gfg.pdf
assets/certificates/java-ducat.pdf
assets/certificates/ml-isro.pdf
assets/achievements/excellence.pdf
```

Rename your files to match, or change the names in `data.js`.
