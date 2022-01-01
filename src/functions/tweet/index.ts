import {handlerPath} from '@libs/handlerResolver'
import {GetAtt} from '@libs/utils'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    USERS_TABLE: {Ref: 'UsersTable'},
    TWEETS_TABLE: {Ref: 'TweetsTable'},
    TIMELINES_TABLE: {Ref: 'TimelinesTable'},
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: 'dynamodb:UpdateItem',
      Resource: GetAtt('UsersTable.Arn'),
    },
    {
      Effect: 'Allow',
      Action: 'dynamodb:PutItem',
      Resource: [GetAtt('TimelinesTable.Arn'), GetAtt('TweetsTable.Arn')],
    },
  ],
}
