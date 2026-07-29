# n8n-nodes-langbly

[n8n](https://n8n.io/) community node for the [Langbly](https://langbly.com/?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=readme-intro) translation API. Context-aware machine translation at a 75% lower published usage rate than Google Cloud Translation Basic.

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

1. [Create a Langbly account](https://langbly.com/signup?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=readme-api-key) and add payment details to activate API access. The first 500K input characters each month are included.
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

| Item | Price |
|------|------:|
| Base fee | $0 |
| Included each month | First 500K input characters |
| Additional usage | $5 per 1M input characters |

[Create an API key →](https://langbly.com/signup?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=readme-pricing-cta)

## License

MIT

## Links

- [Langbly Website](https://langbly.com/?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=readme-links)
- [Pricing](https://langbly.com/pricing/?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=readme-pricing)
- [API Documentation](https://langbly.com/docs/?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=readme-docs)
- [GitHub Repository](https://github.com/Langbly/n8n-nodes-langbly)
