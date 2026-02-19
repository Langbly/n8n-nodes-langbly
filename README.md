# n8n-nodes-langbly

[n8n](https://n8n.io/) community node for the [Langbly](https://langbly.com) translation API. Context-aware machine translation, 81-90% cheaper than Google Translate.

## Features

- **Translate Text** - Translate any text to 100+ languages with context-aware quality
- **Detect Language** — Auto-detect the language of input text
- **HTML Support** — Preserve HTML tags during translation
- **Formality Control** — Choose formal or informal tone
- **Batch Processing** — Translate multiple items in a workflow

## Installation

### In n8n Desktop / Self-hosted

1. Go to **Settings → Community Nodes**
2. Click **Install a community node**
3. Enter: `n8n-nodes-langbly`
4. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-langbly
```

## Setup

1. Sign up at [langbly.com/signup](https://langbly.com/signup) (free, 500K chars/month)
2. Create an API key in your dashboard
3. In n8n, go to **Credentials → New → Langbly API**
4. Paste your API key

## Operations

### Translate Text

Translate text from one language to another.

| Parameter | Required | Description |
|-----------|----------|-------------|
| Text | Yes | The text to translate |
| Target Language | Yes | ISO 639-1 code (e.g., `nl`, `de`, `fr`) |
| Source Language | No | Auto-detected if empty |
| Format | No | `text` (default) or `html` |
| Formality | No | `formal`, `informal`, or default |

**Output:**
```json
{
  "translatedText": "Hallo wereld",
  "detectedSourceLanguage": "en",
  "sourceText": "Hello world",
  "targetLanguage": "nl"
}
```

### Detect Language

Detect the language of input text.

**Output:**
```json
{
  "detectedLanguage": "fr",
  "sourceText": "Bonjour le monde",
  "confidence": "high"
}
```

## Example Workflows

### Translate Incoming Emails

1. **Email Trigger** → receives email
2. **Langbly** → translates body to your language
3. **Slack** → sends translated email to channel

### Multilingual Content Pipeline

1. **Webhook** → receives content
2. **Langbly** (Dutch) → translate to NL
3. **Langbly** (German) → translate to DE
4. **Langbly** (French) → translate to FR
5. **Google Sheets** → save all translations

### Translate Spreadsheet Rows

1. **Google Sheets Trigger** → new row added
2. **Langbly** → translate specific column
3. **Google Sheets** → update row with translation

## Pricing

| Plan | Price | Characters/mo |
|------|-------|--------------|
| Free | $0 | 500K |
| Starter | $19/mo | 5M |
| Growth | $69/mo | 25M |
| Scale | $199/mo | 100M |

[Sign up free →](https://langbly.com/signup)

## License

MIT

## Links

- [Langbly Website](https://langbly.com)
- [API Documentation](https://langbly.com/docs/)
- [GitHub Repository](https://github.com/Langbly/n8n-nodes-langbly)
