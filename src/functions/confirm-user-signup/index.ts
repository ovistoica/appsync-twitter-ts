import {handlerPath} from '@libs/handlerResolver'
import {GetAtt} from '@libs/utils'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    USERS_TABLE: {Ref: 'UsersTable'},
    REGION: 'eu-central-1',
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: 'dynamodb:PutItem',
      Resource: GetAtt('UsersTable.Arn'),
    },
  ],
}
