import { CloudFormationResources } from 'serverless/plugins/aws/provider/awsProvider';

export const apiGatewayErrors: CloudFormationResources = {
  GatewayResponseDefault4XX: {
    Type: 'AWS::ApiGateway::GatewayResponse',
    Properties: {
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
      },
      ResponseType: 'DEFAULT_4XX',
      RestApiId: {
        Ref: 'ApiGatewayRestApi',
      },
    },
  },
  GatewayResponseDefault5XX: {
    Type: 'AWS::ApiGateway::GatewayResponse',
    Properties: {
      ResponseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
      },
      ResponseType: 'DEFAULT_5XX',
      RestApiId: {
        Ref: 'ApiGatewayRestApi',
      },
    },
  },
};
