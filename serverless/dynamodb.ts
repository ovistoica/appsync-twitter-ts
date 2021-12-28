export const dynamoDBResources = {
  UsersTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
      Tags: [
        {Key: 'Environment', Value: '${self:custom.stage}'},
        {Key: 'Name', Value: 'twitter-users-table'},
      ],
    },
  },
}

