#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IAMStack } from './stacks/iam-stack';
import {
  AWS_ACCOUNT_ID,
  AWS_REGION,
  ENVIRONMENT,
  getFunctionNames,
} from './utils';
import { LambdaStack } from './stacks/lambda-stack';

const tags = {
  'company:environment': ENVIRONMENT,
};
const env = { account: `${AWS_ACCOUNT_ID}`, region: `${AWS_REGION}` };

const app = new cdk.App();
const functionNames = getFunctionNames('../apps');

new IAMStack(app, 'IAMStack', {
  stackName: `lambda-monorepo-${ENVIRONMENT}-iam-stack`,
  tags: tags,
  env,
  functionNames,
});

new LambdaStack(app, 'LambdaStack', {
  stackName: `lambda-monorepo-${ENVIRONMENT}-lambda-stack`,
  tags: tags,
  env,
  functionNames,
});
