import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  AWS_ACCOUNT_ID,
  AWS_REGION,
  BaseStackProps,
  getResourceId,
} from '../utils';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    props.functionNames.forEach((name) => {
      new Function(this, getResourceId('LambdaFunction', name), {
        runtime: Runtime.NODEJS_20_X,
        code: Code.fromAsset(`../dist/apps/${name}`),
        timeout: Duration.seconds(50), // ? https://stackoverflow.com/questions/36419442/the-role-defined-for-the-function-cannot-be-assumed-by-lambda
        environment: {},
        handler: 'main.handler',
        role: Role.fromRoleName(
          this,
          getResourceId('IAM', name),
          `${this.stackName}-${name}-lambda-function-execution`
        ),
        functionName: `${this.stackName}-${name}`,
      });
    });
  }
}
