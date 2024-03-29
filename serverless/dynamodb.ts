export type KeyDefinition = {
  AttributeName: string
  KeyType: 'HASH' | 'RANGE'
}

export type AttributeDefinition = {
  AttributeName: string
  AttributeType: 'S' | 'N'
}

export type Tag = {
  Key: string
  Value: string
}

export type Index = {
  IndexName: string
  KeySchema: KeyDefinition[]

  // This means that when we retrieve this global secondary index, we get all data associated
  // with the index
  Projection?: {ProjectionType: 'ALL'}
}

interface Table {
  Type: 'AWS::DynamoDB::Table'
  Properties: {
    BillingMode: 'PAY_PER_REQUEST'
    KeySchema: KeyDefinition[]
    AttributeDefinitions: AttributeDefinition[]
    Tags?: Tag[]
    GlobalSecondaryIndexes?: Index[]
  }
}

export const dynamoDBResources: Record<string, Table> = {
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

  TweetsTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [
        {AttributeName: 'id', AttributeType: 'S'},
        {AttributeName: 'creator', AttributeType: 'S'},
        {AttributeName: 'retweetOf', AttributeType: 'S'},
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'byCreator',
          KeySchema: [
            {AttributeName: 'creator', KeyType: 'HASH'},
            {AttributeName: 'id', KeyType: 'RANGE'},
          ],
          Projection: {ProjectionType: 'ALL'},
        },
        {
          IndexName: 'retweetsByCreator',
          KeySchema: [
            {AttributeName: 'creator', KeyType: 'HASH'},
            {AttributeName: 'retweetOf', KeyType: 'RANGE'},
          ],
          Projection: {ProjectionType: 'ALL'},
        },
      ],
      Tags: [
        {Key: 'Environment', Value: '${self:custom.stage}'},
        {Key: 'Name', Value: 'twitter-tweets-table'},
      ],
    },
  },

  TimelinesTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        {AttributeName: 'userId', KeyType: 'HASH'},
        {AttributeName: 'tweetId', KeyType: 'RANGE'},
      ],
      AttributeDefinitions: [
        {AttributeName: 'userId', AttributeType: 'S'},
        {AttributeName: 'tweetId', AttributeType: 'S'},
      ],
      Tags: [
        {Key: 'Environment', Value: '${self:custom.stage}'},
        {Key: 'Name', Value: 'twitter-timelines-table'},
      ],
    },
  },

  LikesTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        {AttributeName: 'userId', KeyType: 'HASH'},
        {AttributeName: 'tweetId', KeyType: 'RANGE'},
      ],
      AttributeDefinitions: [
        {AttributeName: 'userId', AttributeType: 'S'},
        {
          AttributeName: 'tweetId',
          AttributeType: 'S',
        },
      ],
      Tags: [
        {Key: 'Environment', Value: '${self:custom.stage}'},
        {Key: 'Name', Value: 'twitter-likes-table'},
      ],
    },
  },

  RetweetsTable: {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
      BillingMode: 'PAY_PER_REQUEST',
      KeySchema: [
        {AttributeName: 'userId', KeyType: 'HASH'},
        {AttributeName: 'tweetId', KeyType: 'RANGE'},
      ],
      AttributeDefinitions: [
        {AttributeName: 'userId', AttributeType: 'S'},
        {
          AttributeName: 'tweetId',
          AttributeType: 'S',
        },
      ],
      Tags: [
        {Key: 'Environment', Value: '${self:custom.stage}'},
        {Key: 'Name', Value: 'twitter-likes-table'},
      ],
    },
  },
}
