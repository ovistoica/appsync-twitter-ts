import {handlerPath} from '@libs/handlerResolver'
import {GetAtt} from '@libs/utils'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    USERS_TABLE: {Ref: 'UsersTable'},
    TWEETS_TABLE: {Ref: 'TweetsTable'},
    TIMELINES_TABLE: {Ref: 'TimelinesTable'},
    RETWEETS_TABLE: {Ref: 'RetweetsTable'},
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: 'dynamodb:GetItem',
      Resource: GetAtt('TweetsTable.Arn'),
    },
    {
      Effect: 'Allow',
      Action: 'dynamodb:UpdateItem',
      Resource: GetAtt('UsersTable.Arn'),
    },
    {
      Effect: 'Allow',
      Action: 'dynamodb:PutItem',
      Resource: [
        GetAtt('TimelinesTable.Arn'),
        GetAtt('TweetsTable.Arn'),
        GetAtt('RetweetsTable.Arn'),
      ],
    },
  ],
}
