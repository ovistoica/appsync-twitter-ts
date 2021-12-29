export const appsyncConfig = {
  name: 'appsync-twitter-api',
  schema: 'schema.api.graphql',
  authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  userPoolConfig: {
    awsRegion: 'eu-central-1',
    defaultAction: 'ALLOW',
    userPoolId: {Ref: 'CognitoUserPool'},
  },
  mappingTemplatesLocation: 'mapping-templates',
  mappingTemplates: [
    {
      type: 'Query',
      field: 'getMyProfile',
      dataSource: 'usersTable',
    },
  ],
  dataSources: [
    {
      type: 'NONE',
      name: 'none',
    },
    {
      type: 'AMAZON_DYNAMODB',
      name: 'usersTable',
      config: {
        tableName: {Ref: 'UsersTable'},
      },
    },
  ],
}
