export default {
  name: 'appsync-twitter-api',
  schema: 'schema.api.graphql',
  authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  userPoolConfig: {
    awsRegion: 'eu-central-1',
    defaultAction: 'ALLOW',
    userPoolId: {Ref: 'CognitoUserPool'},
  },
}
