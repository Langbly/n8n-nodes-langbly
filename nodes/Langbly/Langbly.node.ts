import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Langbly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Langbly',
		name: 'langbly',
		icon: 'file:langbly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Translate text using the Langbly Translation API',
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
			// ------ Resource ------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Translation',
						value: 'translation',
					},
				],
				default: 'translation',
			},

			// ------ Operation ------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['translation'],
					},
				},
				options: [
					{
						name: 'Translate Text',
						value: 'translate',
						description: 'Translate text to a target language',
						action: 'Translate text',
					},
				],
				default: 'translate',
			},

			// ------ Fields: Translate ------
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Enter text to translate...',
				description: 'The text to translate',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['translation'],
						operation: ['translate'],
					},
				},
			},
			{
				displayName: 'Target Language',
				name: 'targetLanguage',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. nl, fr, de, es',
				description: 'ISO 639-1 language code for the target language',
				displayOptions: {
					show: {
						resource: ['translation'],
						operation: ['translate'],
					},
				},
			},
			{
				displayName: 'Additional Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['translation'],
						operation: ['translate'],
					},
				},
				options: [
					{
						displayName: 'Source Language',
						name: 'sourceLanguage',
						type: 'string',
						default: '',
						placeholder: 'e.g. en (leave empty to auto-detect)',
						description: 'ISO 639-1 language code for the source language. Leave empty to auto-detect.',
					},
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'Plain Text',
								value: 'text',
							},
							{
								name: 'HTML',
								value: 'html',
							},
						],
						default: 'text',
						description: 'Format of the input text. Use HTML to preserve markup during translation.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				if (resource === 'translation' && operation === 'translate') {
					const text = this.getNodeParameter('text', i) as string;
					const targetLanguage = this.getNodeParameter('targetLanguage', i) as string;
					const options = this.getNodeParameter('options', i) as {
						sourceLanguage?: string;
						format?: string;
					};

					if (!text.trim()) {
						throw new NodeOperationError(this.getNode(), 'Text to translate cannot be empty', {
							itemIndex: i,
						});
					}

					if (!targetLanguage.trim()) {
						throw new NodeOperationError(this.getNode(), 'Target language is required', {
							itemIndex: i,
						});
					}

					// Build request body
					const body: Record<string, unknown> = {
						q: text,
						target: targetLanguage.trim().toLowerCase(),
					};

					if (options.sourceLanguage) {
						body.source = options.sourceLanguage.trim().toLowerCase();
					}

					if (options.format && options.format !== 'text') {
						body.format = options.format;
					}

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'langblyApi',
						{
							method: 'POST',
							url: 'https://api.langbly.com/language/translate/v2',
							headers: {
								'Content-Type': 'application/json',
								'User-Agent': 'n8n-nodes-langbly/1.0.0',
							},
							body,
							json: true,
						},
					);

					const translations = response?.data?.translations;

					if (!translations || !Array.isArray(translations) || translations.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'Unexpected API response: no translations returned',
							{ itemIndex: i },
						);
					}

					const translation = translations[0];

					returnData.push({
						json: {
							translatedText: translation.translatedText,
							detectedSourceLanguage: translation.detectedSourceLanguage || options.sourceLanguage || '',
							targetLanguage,
							originalText: text,
						},
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
