import { APIGatewayEvent, Context } from 'aws-lambda';
import { HttpResponse } from 'aws-sdk';
import { Lambda, LambdaInput } from '../types/lambda';

export class LambdaService {
  private body: string | any;
  private statusCode?: 200 | 500;

  constructor(
    private lambda: Lambda,
    private event: APIGatewayEvent,
    private context: Context,
  ) {}

  get lambdaInput(): LambdaInput {
    return {
      event: this.event,
      context: this.context,
    };
  }

  get headers(): {
    [key: string]: string | boolean;
  } {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };
  }

  private setError(error: Error) {
    this.statusCode = 200;
    this.body = {
      error: error.message,
    };
  }

  private async run() {
    try {
      this.body = await this.lambda(this.lambdaInput);
      this.statusCode = 200;
    } catch (error) {
      this.setError(error);
    }
  }

  public async execute() {
    await this.run();
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(this.body),
      headers: this.headers,
    } as HttpResponse;
  }
}
