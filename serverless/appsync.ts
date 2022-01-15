interface AppSyncMappingTemplate {
  type: 'Query' | 'Mutation' | 'Tweet' | 'TimelinePage'
  field: string
  dataSource: string
  request?: false
  response?: false
}

interface AppSyncDataSource {
  type: 'NONE' | 'AMAZON_DYNAMODB' | 'AWS_LAMBDA'
  name: string
  config?: Record<string, unknown>
}

interface AppSyncConfig {
  name: string
  schema: string
  authenticationType: 'AMAZON_COGNITO_USER_POOLS'
  userPoolConfig?: {
    awsRegion: 'eu-central-1'
    defaultAction: 'ALLOW'
    userPoolId: {Ref: string}
  }
  mappingTemplatesLocation?: string
  mappingTemplates: AppSyncMappingTemplate[]
  dataSources: AppSyncDataSource[]
  substitutions: {TweetsTable: {Ref: 'TweetsTable'}}
}

export const appsyncConfig: AppSyncConfig = {
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
    {
      type: 'Mutation',
      field: 'editMyProfile',
      dataSource: 'usersTable',
    },
    {
      type: 'Query',
      field: 'getImageUploadUrl',
      dataSource: 'getImageUploadUrlFunction',
      request: false,
      response: false,
    },
    {
      type: 'Mutation',
      field: 'tweet',
      dataSource: 'tweetFunction',
      request: false,
      response: false,
    },
    {
      type: 'Query',
      field: 'getTweets',
      dataSource: 'tweetsTable',
    },
    {
      type: 'Query',
      dataSource: 'timelinesTable',
      field: 'getMyTimeline',
    },

    /* NESTED FIELDS */
    {
      type: 'Tweet',
      field: 'profile',
      dataSource: 'usersTable',
    },

    {
      type: 'TimelinePage',
      field: 'tweets',
      dataSource: 'tweetsTable',
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
    {
      type: 'AMAZON_DYNAMODB',
      name: 'tweetsTable',
      config: {
        tableName: {Ref: 'TweetsTable'},
      },
    },
    {
      type: 'AMAZON_DYNAMODB',
      name: 'timelinesTable',
      config: {
        tableName: {Ref: 'TimelinesTable'},
      },
    },
    {
      type: 'AWS_LAMBDA',
      name: 'getImageUploadUrlFunction',
      config: {
        functionName: 'getImageUploadUrl',
      },
    },
    {
      type: 'AWS_LAMBDA',
      name: 'tweetFunction',
      config: {
        functionName: 'tweet',
      },
    },
  ],

  substitutions: {
    TweetsTable: {Ref: 'TweetsTable'},
  },
}
