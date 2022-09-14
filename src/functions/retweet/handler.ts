import {Handler} from 'aws-lambda'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import {TweetType} from '@types'

const DocumentClient = new DynamoDB.DocumentClient()
const ulid = require('ulid')

interface RetweetHandlerEvent {
  identity: {
    username: string
  }
  arguments: {
    tweetId: string
  }
}

const handler: Handler<RetweetHandlerEvent> = async event => {
  const {USERS_TABLE, TWEETS_TABLE, TIMELINES_TABLE, RETWEETS_TABLE} =
    process.env
  const {username} = event.identity
  const {tweetId} = event.arguments
  const id = ulid.ulid()
  const timestamp = new Date().toJSON()

  const getTweetResp = await DocumentClient.get({
    TableName: TWEETS_TABLE,
    Key: {
      id: tweetId,
    },
  }).promise()
  console.log('RESPONSE RETWEEEET', {getTweetResp})

  const tweet = (getTweetResp as any).tweet

  if (!tweet) {
    throw new Error('Tweet is not found')
  }

  const newTweet = {
    __typename: TweetType.RETWEET,
    id,
    createdAt: timestamp,
    creator: username,
    retweetOf: tweetId,
  }

  const transactItems: unknown[] = [
    {
      Put: {
        TableName: TWEETS_TABLE,
        Item: newTweet,
      },
    },
    {
      Put: {
        TableName: RETWEETS_TABLE,
        Item: {
          userId: username,
          tweetId,
          createdAt: timestamp,
        },
        ConditionExpression: 'attribute_not_exists(tweetId)',
      },
    },

    {
      Update: {
        TableName: TWEETS_TABLE,
        Key: {
          id: tweetId,
        },
        UpdateExpression: 'ADD retweets :one',
        ExpressionAttributeValues: {
          ':one': 1,
        },
        ConditionExpression: 'attribute_exists(id)',
      },
    },
    {
      Update: {
        TableName: USERS_TABLE,
        Key: {
          id: username,
        },
        UpdateExpression: 'ADD tweetsCount :one',
        ExpressionAttributeValues: {
          ':one': 1,
        },
        ConditionExpression: 'attribute_exists(id)',
      },
    },
  ]

  console.log(`creator: [${tweet.creator}; username: [${username}`)
  if (tweet.creator !== username) {
    transactItems.push({
      Put: {
        TableName: TIMELINES_TABLE,
        Item: {
          userId: username,
          tweetId: id,
          retweetOf: tweetId,
          timestamp,
        },
      },
    })
  }

  await DocumentClient.transactWrite({
    TransactItems: transactItems,
  }).promise()

  return true
}

export const main = handler
