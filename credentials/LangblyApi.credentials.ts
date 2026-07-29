import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class LangblyApi implements ICredentialType {
  name = 'langblyApi';
  displayName = 'Langbly API';
  icon = 'file:langbly.svg' as const;
  documentationUrl = 'https://langbly.com/docs/authentication?utm_source=n8n.io&utm_medium=plugin&utm_campaign=n8n-community-node&utm_content=credential-documentation';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Create an API key at langbly.com/signup. Payment details are required; the first 500K input characters each month are included.',
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
      baseURL: 'https://api.langbly.com',
      url: '/health',
      method: 'GET',
    },
  };
}
