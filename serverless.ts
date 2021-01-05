import type { Serverless, ApiGateway } from 'serverless/aws';
import { Functions } from 'serverless/plugins/aws/provider/awsProvider';
import { apiGatewayErrors } from './src/resources';

interface UpdatedServerless {
  useDotenv: boolean;
}

type LatestServerless = Serverless & UpdatedServerless;

const LONDON_REGION = 'eu-west-2';

type httpMethod = 'get' | 'put' | 'post' | 'delete' | 'ANY';

const awsFunction = (name: string, method: httpMethod = 'get'): Functions => ({
  [name]: {
    handler: `src/api/${name}.main`,
    events: [
      {
        http: {
          path: 'auth',
          method: 'ANY',
        },
      },
      {
        http: {
          path: 'auth/{proxy+}',
          method: 'ANY',
        },
      },
    ],
  },
});

const serverlessConfig: LatestServerless = {
  service: 'pr-finder-api',
  frameworkVersion: '2',
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: LONDON_REGION,
    stage: 'production',
    environment: {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    },
    apiGateway: {
      shouldStartNameWithService: true,
    } as ApiGateway,
  },
  resources: {
    Resources: {
      ...apiGatewayErrors,
    },
  },
  package: {
    individually: true,
  },
  plugins: [
    'serverless-bundle',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  useDotenv: true,
  functions: {
    ...awsFunction('auth', 'ANY'),
  },
};

module.exports = serverlessConfig;
