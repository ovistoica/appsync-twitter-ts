import {GetAtt} from '@libs/utils'

console.log("sth")

interface AppSyncMappingTemplate {
  type:
    | 'Query'
    | 'Mutation'
    | 'Tweet'
    | 'UnhydratedTweetsPage'
    | 'MyProfile'
    | 'OtherProfile'
    | 'Retweet'
  field: string
  dataSource: string
  request?: string | false
  response?: string | false
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
  substitutions: {
    TweetsTable: {Ref: 'TweetsTable'}
    LikesTable: {Ref: 'LikesTable'}
    UsersTable: {Ref: 'UsersTable'}
  }
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
    {
      type: 'Query',
      dataSource: 'likesTable',
      field: 'getLikes',
    },
    {
      type: 'Mutation',
      dataSource: 'likeMutation',
      field: 'like',
    },
    {
      type: 'Mutation',
      dataSource: 'unlikeMutation',
      field: 'unlike',
    },
    {
      type: 'Mutation',
      field: 'retweet',
      dataSource: 'retweetFunction',
      request: false,
      response: false,
    },

    /* NESTED FIELDS */
    {
      type: 'Tweet',
      field: 'profile',
      dataSource: 'usersTable',
    },

    {
      type: 'Retweet',
      field: 'profile',
      dataSource: 'usersTable',
      request: 'Tweet.profile.request.vtl',
      response: 'Tweet.profile.response.vtl',
    },
    {
      type: 'Retweet',
      field: 'retweetOf',
      dataSource: 'tweetsTable',
    },
    {
      type: 'UnhydratedTweetsPage',
      field: 'tweets',
      dataSource: 'tweetsTable',
    },
    {type: 'Tweet', field: 'liked', dataSource: 'likesTable'},
    {type: 'MyProfile', field: 'tweets', dataSource: 'tweetsTable'},
    {
      type: 'OtherProfile',
      field: 'tweets',
      dataSource: 'tweetsTable',
      request: 'MyProfile.tweets.request.vtl',
      response: 'MyProfile.tweets.response.vtl',
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
      type: 'AMAZON_DYNAMODB',
      name: 'likesTable',
      config: {
        tableName: {Ref: 'LikesTable'},
      },
    },
    {
      type: 'AMAZON_DYNAMODB',
      name: 'likeMutation',
      config: {
        tableName: {Ref: 'LikesTable'},
        iamRoleStatements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:PutItem',
            Resource: GetAtt('LikesTable.Arn'),
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:UpdateItem',
            Resource: [GetAtt('UsersTable.Arn'), GetAtt('TweetsTable.Arn')],
          },
        ],
      },
    },
    {
      type: 'AMAZON_DYNAMODB',
      name: 'unlikeMutation',
      config: {
        tableName: {Ref: 'LikesTable'},
        iamRoleStatements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:DeleteItem',
            Resource: GetAtt('LikesTable.Arn'),
          },
          {
            Effect: 'Allow',
            Action: 'dynamodb:UpdateItem',
            Resource: [GetAtt('UsersTable.Arn'), GetAtt('TweetsTable.Arn')],
          },
        ],
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
    {
      type: 'AWS_LAMBDA',
      name: 'retweetFunction',
      config: {
        functionName: 'retweet',
      },
    },
  ],

  substitutions: {
    TweetsTable: {Ref: 'TweetsTable'},
    LikesTable: {Ref: 'LikesTable'},
    UsersTable: {Ref: 'UsersTable'},
  },
}
