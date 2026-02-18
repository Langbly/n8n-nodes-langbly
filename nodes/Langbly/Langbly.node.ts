import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export class Langbly implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Langbly',
    name: 'langbly',
    icon: 'file:langbly.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Translate text using the Langbly API. Context-aware, 81-90% cheaper than Google Translate.',
    defaults: {
      name: 'Langbly',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'langblyApi',
        required: true,
      },
    ],
    properties: [
      // Operation
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Translate Text',
            value: 'translate',
            description: 'Translate text to another language',
            action: 'Translate text to another language',
          },
          {
            name: 'Detect Language',
            value: 'detect',
            description: 'Detect the language of a text',
            action: 'Detect the language of a text',
          },
        ],
        default: 'translate',
      },

      // ── Translate Operation ──────────────────────────────
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        typeOptions: {
          rows: 4,
        },
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: ['translate', 'detect'],
          },
        },
        description: 'The text to translate or detect language of',
      },
      {
        displayName: 'Target Language',
        name: 'targetLanguage',
        type: 'string',
        default: 'nl',
        required: true,
        displayOptions: {
          show: {
            operation: ['translate'],
          },
        },
        description: 'ISO 639-1 language code (e.g., nl, de, fr, es, ja, ko, zh-CN)',
        placeholder: 'nl',
      },
      {
        displayName: 'Source Language',
        name: 'sourceLanguage',
        type: 'string',
        default: '',
        displayOptions: {
          show: {
            operation: ['translate'],
          },
        },
        description: 'ISO 639-1 source language code. Leave empty for auto-detection.',
        placeholder: 'en (auto-detect if empty)',
      },

      // ── Additional Options ──────────────────────────────
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            operation: ['translate'],
          },
        },
        options: [
          {
            displayName: 'Format',
            name: 'format',
            type: 'options',
            options: [
              { name: 'Plain Text', value: 'text' },
              { name: 'HTML', value: 'html' },
            ],
            default: 'text',
            description: 'Set to "html" to preserve HTML tags in the translation',
          },
          {
            displayName: 'Formality',
            name: 'formality',
            type: 'options',
            options: [
              { name: 'Default', value: '' },
              { name: 'Formal', value: 'formal' },
              { name: 'Informal', value: 'informal' },
            ],
            default: '',
            description: 'Control the formality level of the translation',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        if (operation === 'translate') {
          const text = this.getNodeParameter('text', i) as string;
          const targetLanguage = this.getNodeParameter('targetLanguage', i) as string;
          const sourceLanguage = this.getNodeParameter('sourceLanguage', i) as string;
          const additionalOptions = this.getNodeParameter('additionalOptions', i) as {
            format?: string;
            formality?: string;
          };

          const body: Record<string, unknown> = {
            q: text,
            target: targetLanguage,
          };

          if (sourceLanguage) {
            body.source = sourceLanguage;
          }

          if (additionalOptions.format) {
            body.format = additionalOptions.format;
          }

          if (additionalOptions.formality) {
            body.formality = additionalOptions.formality;
          }

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'langblyApi',
            {
              method: 'POST',
              url: 'https://api.langbly.com/language/translate/v2',
              body,
              json: true,
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-nodes-langbly/0.1.0',
              },
            },
          );

          const translation = response.data?.translations?.[0];

          returnData.push({
            json: {
              translatedText: translation?.translatedText ?? '',
              detectedSourceLanguage: translation?.detectedSourceLanguage ?? sourceLanguage,
              sourceText: text,
              targetLanguage,
            },
            pairedItem: { item: i },
          });
        }

        if (operation === 'detect') {
          const text = this.getNodeParameter('text', i) as string;

          // Use translate with a short substring to detect language
          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'langblyApi',
            {
              method: 'POST',
              url: 'https://api.langbly.com/language/translate/v2',
              body: {
                q: text.slice(0, 500), // Use first 500 chars for detection
                target: 'en', // Translate to English to get detection
              },
              json: true,
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-nodes-langbly/0.1.0',
              },
            },
          );

          const detected = response.data?.translations?.[0]?.detectedSourceLanguage ?? 'unknown';

          returnData.push({
            json: {
              detectedLanguage: detected,
              sourceText: text,
              confidence: detected !== 'unknown' ? 'high' : 'none',
            },
            pairedItem: { item: i },
          });
        }
      } catch (error: unknown) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          returnData.push({
            json: {
              error: errorMessage,
              sourceText: this.getNodeParameter('text', i, '') as string,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeApiError(this.getNode(), error as Record<string, unknown>);
      }
    }

    return [returnData];
  }
}
