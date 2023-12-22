import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  AWS_ACCOUNT_ID,
  AWS_REGION,
  BaseStackProps,
  getLambdaExecRoleName,
  getResourceId,
} from '../utils';

export class IAMStack extends Stack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    props.functionNames.forEach((name) => {
      // 👇 Task execution role creation
      const role = new Role(
        this,
        getResourceId('LambdaFunctionExecutionRole', name),
        {
          assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
          roleName: getLambdaExecRoleName(name),
          managedPolicies: [
            ManagedPolicy.fromAwsManagedPolicyName(
              'service-role/AWSLambdaBasicExecutionRole'
            ),
          ],
        }
      );
      role.addToPolicy(
        new PolicyStatement({
          actions: ['secretsmanager:GetSecretValue'],
          resources: [
            `arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${this.stackName}-${name}-env-vars:*`,
          ],
        })
      );
    });
  }
}
