import { APIGatewayEvent, Context } from 'aws-lambda';
import { HttpResponse } from 'aws-sdk';
import { Lambda } from '../types/lambda';
import { LambdaService } from '../services/LambdaService';

export const lambdaWrapper = async (
  event: APIGatewayEvent,
  context: Context,
  lambdaLogic: () => Promise<any>,
): Promise<HttpResponse> => {
  const lambda: Lambda = async () => await lambdaLogic();
  return await new LambdaService(lambda, event, context).execute();
};
