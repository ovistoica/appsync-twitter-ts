import {Handler} from 'aws-lambda'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import {TweetType} from '@types'

const DocumentClient = new DynamoDB.DocumentClient()
const ulid = require('ulid')

interface TweetHandlerEvent {
  identity: {
    username: string
  }
  arguments: {
    text: string
  }
}

const handler: Handler<TweetHandlerEvent> = async event => {
  const {USERS_TABLE, TWEETS_TABLE, TIMELINES_TABLE} = process.env
  const {username} = event.identity
  const {text} = event.arguments
  const id = ulid.ulid()
  const timestamp = new Date().toJSON()

  const newTweet = {
    __typename: TweetType.TWEET,
    id,
    text,
    createdAt: timestamp,
    replies: 0,
    likes: 0,
    retweets: 0,
    creator: username,
  }

  await DocumentClient.transactWrite({
    TransactItems: [
      {
        Put: {
          TableName: TWEETS_TABLE,
          Item: newTweet,
        },
      },
      {
        Put: {
          TableName: TIMELINES_TABLE,
          Item: {
            userId: username,
            tweetId: id,
            timestamp,
          },
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
    ],
  }).promise()

  return newTweet
}

export const main = handler
