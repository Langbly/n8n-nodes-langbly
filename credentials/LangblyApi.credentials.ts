import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LangblyApi implements ICredentialType {
	name = 'langblyApi';
	displayName = 'Langbly API';
	documentationUrl = 'https://docs.langbly.com';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'langbly_...',
			description: 'Your Langbly API key. Find it at https://langbly.com/dashboard/api-keys',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: 'https://api.langbly.com',
			url: '/language/translate/v2',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				q: 'hello',
				target: 'nl',
				source: 'en',
			}),
		},
	};
}
