import type {AWS} from '@serverless/typescript'
import {appsyncConfig} from './serverless/appsync'
import {dynamoDBResources} from './serverless/dynamodb'
import {cognitoOutput, cognitoResources} from './serverless/cognito'
import {s3Outputs, s3Resources} from './serverless/s3'
import {functionsConfig} from '@functions/index'

const serverlessConfiguration: AWS = {
  service: 'appsync-twitter',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-appsync-plugin',
    'serverless-iam-roles-per-function',
    'serverless-export-env',
    'serverless-manifest-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: 'eu-central-1',
      STAGE: '${self:custom.stage}',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {...functionsConfig},
  package: {individually: true},
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node12',
      define: {'require.resolve': undefined},
      platform: 'node',
      concurrency: 10,
    },
    appSync: {...appsyncConfig},
    manifest: {
      postProcess: './scripts/processManifest.js',
      disablePostDeployGeneration: true,
      disableOutput: true,
      silent: true,
    },
  },
  resources: {
    Resources: {
      ...dynamoDBResources,
      ...cognitoResources,
      ...s3Resources,
    },
    Outputs: {
      AwsRegion: {Value: '${self:custom.region}'},
      ...cognitoOutput,
      ...s3Outputs,
    },
  },
}

module.exports = serverlessConfiguration
