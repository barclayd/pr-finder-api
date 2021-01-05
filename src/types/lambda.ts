import { APIGatewayEvent, Context } from 'aws-lambda';

export interface LambdaInput {
  event: APIGatewayEvent;
  context: Context;
}

export type Lambda = ({ event, context }: LambdaInput) => Promise<any>;
