# n8n-nodes-langbly

This is an [n8n](https://n8n.io/) community node for the [Langbly Translation API](https://langbly.com). Translate text between 100+ languages using LLM-powered translations right from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Usage](#usage) · [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install a community node**
3. Enter `n8n-nodes-langbly`
4. Agree to the risks and select **Install**

## Operations

### Translation

- **Translate Text**: Translate text to a target language

#### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| Text | Yes | The text to translate |
| Target Language | Yes | ISO 639-1 language code (e.g., `nl`, `fr`, `de`, `es`) |
| Source Language | No | ISO 639-1 code. Leave empty to auto-detect |
| Format | No | `text` (default) or `html` to preserve markup |

#### Output

| Field | Description |
|-------|-------------|
| `translatedText` | The translated text |
| `detectedSourceLanguage` | Detected or provided source language code |
| `targetLanguage` | The target language code used |
| `originalText` | The original input text |

## Credentials

You need a Langbly API key to use this node.

1. Sign up at [langbly.com](https://langbly.com)
2. Go to your [Dashboard > API Keys](https://langbly.com/dashboard/api-keys)
3. Create a new API key
4. In n8n, create new **Langbly API** credentials and paste your key

The free tier includes 500,000 characters per month. No credit card required.

## Usage

### Basic translation

1. Add the **Langbly** node to your workflow
2. Set up your API credentials
3. Enter the text to translate
4. Set the target language code (e.g., `nl` for Dutch)
5. Run the workflow

### Translate incoming data

Connect the Langbly node after any node that outputs text. Use expressions to reference the text field:

- Set **Text** to `{{ $json.text }}` or `{{ $json.body }}`
- Set **Target Language** to `{{ $json.language }}` or a fixed value like `fr`

### HTML content

When translating HTML content (e.g., from a CMS), set the **Format** option to **HTML**. This preserves all markup, links, and formatting during translation.

## Supported Languages

Langbly supports 100+ languages. Common codes:

| Code | Language | Code | Language |
|------|----------|------|----------|
| `en` | English | `nl` | Dutch |
| `fr` | French | `de` | German |
| `es` | Spanish | `it` | Italian |
| `pt` | Portuguese | `ja` | Japanese |
| `zh` | Chinese | `ko` | Korean |
| `ar` | Arabic | `ru` | Russian |

Full list: [docs.langbly.com/languages](https://docs.langbly.com/languages)

## Resources

- [Langbly website](https://langbly.com)
- [API documentation](https://docs.langbly.com)
- [n8n community nodes docs](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
