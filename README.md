# Github Actions - AWS CDK Lambda Monorepo Starter

[![GitHub Actions Status](https://github.com/nguyenkhavi/gha-cdk-lambda-monorepo/actions/workflows/dev.yaml/badge.svg)](https://github.com/nguyenkhavi/gha-cdk-lambda-monorepo/actions)

The AGithub Actions - AWS CDK Lambda Monorepo Starter is a comprehensive template designed for efficiently building and deploying multiple Lambda functions using AWS Cloud Development Kit (CDK), GitHub Actions, and NX monorepo. This starter project streamlines the creation of a robust CI/CD pipeline, allowing you to focus on developing serverless functions while maintaining a scalable and organized codebase.

- [Motivation](#motivation)
- [Features](#features)
- [Prerequisites](#prerequisites)
  - [IAM Role for GitHub Actions](#iam-role-for-github-actions)
  - [GitHub Repository Vars (or Secrets)](#github-repository-vars-or-secrets)
  - [IAM Trust Relationship](#iam-trust-relationship)
- [Glossary](#glossary)
- [Usage](#usage)
  - [Creating a Shared Package](#creating-a-shared-package)
  - [Creating a New Lambda Function](#creating-a-new-lambda-function)
- [Customization](#customization)
  - [Changing Source Code](#changing-source-code)
  - [Adapting Dockerfile](#adapting-dockerfile)
  - [Customizing AWS CDK Scripts](#customizing-aws-cdk-scripts)
- [To-Do List](#to-do-list)

## Motivation

Building serverless applications with multiple Lambda functions can be a breeze! Our motivation behind this project is to empower developers like you to:

- **Share Code Efficiently:** Leverage the power of NX monorepo to ensure that multiple Lambdas can easily share code. No more copy-pasting headaches!

- **Consistent Lambda Deployments:** With AWS CDK, deploying Lambdas becomes a straightforward and consistent process. No more wrestling with deployment scripts.

- **Effortless Role and Secret Changes:** Making updates to roles and secrets related to your Lambdas is now a piece of cake. No more stumbling through complex configurations by applying IaC.

We believe that your coding experience should be as smooth as possible, allowing you to focus on what matters—creating awesome serverless applications!

## Features

**AWS CDK Integration**: Utilize the AWS CDK to define and deploy Lambda functions with ease, using familiar programming languages.
**NX Monorepo Structure**: Organize your serverless functions in a structured NX monorepo, simplifying development, testing, and maintenance.
**GitHub Actions CI/CD Pipeline**: Automate the build and deployment workflows for your Lambda functions with GitHub Actions, ensuring a streamlined and efficient development lifecycle.
**Multiple Lambda Functions**: Easily manage and deploy multiple Lambda functions within the same project, keeping your serverless architecture organized.

## Prerequisites

### IAM Role for GitHub Actions

Create an IAM role in the AWS Management Console that GitHub Actions can assume when deploying resources (Ex: `github-actions-role`).
Note the Role ARN; you will use it as a variable in the GitHub repository.

### GitHub Repository Vars (or Secrets)

In your GitHub repository, add the following secrets:

- `AWS_ACCOUNT_ID`: Your AWS account id.
- `AWS_REGION`: The AWS region where your ECS cluster is located.
- `AWS_ROLE`: The ARN of the IAM role created for GitHub Actions.

### IAM Trust Relationship

Ensure the IAM role created has a trust relationship with GitHub Actions. This can be done by updating the trust policy with the GitHub Actions account ID.

1. In the IAM console, select the IAM role created for GitHub Actions.

2. Under the "Trust relationships" tab, click "Edit trust relationship."

3. Update the JSON document with the GitHub Actions account ID:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:<github-username>/<github-repo>:*",
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           }
         }
       }
     ]
   }
   ```

4. Follow [these steps](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html) to add the GitHub OIDC provider to IAM. For the provider URL: Use https://token.actions.githubusercontent.com and use `sts.amazonaws.com` for the "Audience" if you are using the [official action](https://github.com/aws-actions/configure-aws-credentials).

## Glossary

- **`apps/function-name`:** This directory contains the AWS Lambda function code. Each Lambda function has its dedicated directory under `apps`, making it easy to manage and deploy individual functions independently.

- **`libs`:** The `libs` directory is reserved for shared code that can be used across multiple Lambda functions. This centralizes common functionality, promoting code reuse and maintainability.

- **`infra`:** The `infra` directory houses the AWS CDK code responsible for defining and deploying the cloud infrastructure, including Lambda functions, roles, and any other resources needed for your serverless application.

## Usage

### Creating a Shared Package

To create a shared package in the `libs` directory, run the following command:

```bash
yarn nx g lib <package-name> --directory=libs
```

This will generate a new directory in libs with the specified package name, allowing you to organize and share code across multiple Lambda functions.

### Creating a New Lambda Function

To create a new Lambda function, run the following command:

```bash
yarn nx generate application <function-name>
```

Open the `apps/<function-name>/project.json` file and ensure that the `"build"` target includes the `"bundle": true` option:

This will scaffold a new Lambda function in the apps directory. You can then customize the function code as needed. Here's an example Lambda function code:

```typescript
// apps/<function-name>/src/index.ts

import { S3Event } from 'aws-lambda';
import { extractParams } from '@s3-utils';

export const handler = async (event: S3Event): Promise<void> => {
  const { videoFileName, triggerBucketName } = extractParams(event);
  console.log({ videoFileName, triggerBucketName });
};
```

Don't forget to configure alias import paths in your `tsconfig.base.json` file:

```json
// tsconfig.base.json
{
  "compilerOptions": {
    // other options...
    "paths": {
      "@<package-name>/*": ["libs/<package-name>/*"]
      // Add more alias paths as needed
    }
  }
}
```

## Customization

### Changing Source Code

The source code is located in the src/ directory. Customize the Node.js application logic to meet your specific requirements.

### Adapting Dockerfile

The Dockerfile (Dockerfile) in the root directory defines the configuration for containerizing your source code. Modify the Dockerfile as needed to ensure compatibility with your application.

### Customizing AWS CDK Scripts

The AWS CDK scripts are located in the infra directory. Customize the scripts in infra to define your AWS infrastructure according to your requirements.

## To-Do List

- [ ] **Use S3 for Build Artifacts**:

Configure your CI/CD pipeline to store build artifacts in Amazon S3 instead of GitHub artifacts to have more control on that. Update your GitHub Actions workflow accordingly.`
