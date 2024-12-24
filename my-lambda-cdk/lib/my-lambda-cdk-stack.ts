import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class MyLambdaCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Path to the directory containing the Dockerfile (adjust as needed)
    const dockerContextPath = path.join(__dirname, '../../test-task');

    console.log('Using Docker context path:', dockerContextPath);

    // Create a Lambda function using a local Docker build
    const newLambdaFunction = new lambda.DockerImageFunction(this, 'NewNestJSLambda', {
      code: lambda.DockerImageCode.fromImageAsset(dockerContextPath),
      functionName: 'NestCustomLambdaFunctionName',
      memorySize: 256,
      timeout: cdk.Duration.seconds(90),
      environment: {
        AWS_BUCKET_NAME: 'access-user',
      },
    });

    // Set up API Gateway with proxy enabled
    const api = new apigateway.LambdaRestApi(this, 'TestApi', {
      handler: newLambdaFunction,
      proxy: true,
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: newLambdaFunction.functionName,
    });
  }
}
