# Appsync masterclass typescript version

This project contains the course files for the [Appsync Masterclass](https://appsyncmasterclass.com/) held by
[@theburningmonk](https://github.com/theburningmonk).

You can find the original version of the project [here](https://github.com/theburningmonk/appsyncmasterclass-backend)

This project has been generated using the `aws-nodejs-typescript` template from
the [Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions

### Deployment

- Run `npm i` to install the project dependencies
- Run `npm run deploy` to deploy this stack to AWS

## Test your service

- Run `npm run integration-test` to run integration tests
- Run `npm run e2e-test` to run acceptance tests
- Run `npm run unit-test` to run unit tests

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── serverless                  # Serverless resources split by category
│       └── appsync.ts          # Appsync CloudFormation config
│       └── cognito.ts          # Cognito CloudFormation resources config
│       └── dynamodb.ts         # DynamoDB CloudFormation config
│
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│       └── utils.ts            # Project utils, generally used for Cloud Formation configs
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
└── jest.config.js              # Jest configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API
  Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template
  uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert
  API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for
  your `serverless.ts` service file
