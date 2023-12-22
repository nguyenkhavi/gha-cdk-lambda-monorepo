import { StackProps } from 'aws-cdk-lib';
import { readdirSync } from 'fs';

const { AWS_REGION = '', AWS_ACCOUNT_ID = '', ENVIRONMENT = '' } = process.env;

export { AWS_REGION, AWS_ACCOUNT_ID, ENVIRONMENT };

export type BaseStackProps = StackProps & {
  functionNames: string[];
};

export const getFunctionNames = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const camalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

export const getResourceId = (resourceName: string, funcName: string) => {
  return `${camalize(funcName)}${resourceName}`;
};

export const getLambdaExecRoleName = (funcName: string) => {
  return `${ENVIRONMENT}-${funcName}-lambda-function-execution`;
};
