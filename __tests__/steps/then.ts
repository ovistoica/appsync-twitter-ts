import AWS from 'aws-sdk'
import http from 'axios'
import fs from 'fs'
import get from 'lodash/get'

export const user_exists_in_UsersTable = async (id: string) => {
  const {USERS_TABLE, AWS_REGION} = process.env
  if (!USERS_TABLE || !AWS_REGION) {
    throw new Error('No USERS_TABLE env variable provided')
  }

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  console.log(`Looking for user [${id}] in table [${USERS_TABLE}]`)

  const resp = await DynamoDB.get({
    TableName: USERS_TABLE,
    Key: {
      id,
    },
  }).promise()

  expect(resp.Item).toBeTruthy()

  return resp.Item
}

export const user_can_upload_image_to_url = async (
  url: string,
  filePath: string,
  contentType: string,
) => {
  const data = fs.readFileSync(filePath)
  await http({
    method: 'put',
    url,
    headers: {
      'Content-Type': contentType,
    },
    data,
  })

  console.log('Uploaded image to ', url)
}

export const user_can_download_image_from = async (url: string) => {
  const resp = await http(url)

  console.log('Downloaded image from', url)

  return resp.data
}

export const tweet_exists_in_TweetsTable = async (id: string) => {
  const {TWEETS_TABLE, AWS_REGION} = process.env

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  console.log(`Looking for tweet [${id}] in table [${TWEETS_TABLE}]`)

  const resp = await DynamoDB.get({
    TableName: TWEETS_TABLE,
    Key: {
      id,
    },
  }).promise()

  expect(resp.Item).toBeTruthy()

  return resp.Item
}

export const retweet_exists_in_TweetsTable = async ({
  userId,
  tweetId,
}: {
  userId: string
  tweetId: string
}) => {
  const {TWEETS_TABLE, AWS_REGION} = process.env

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  console.log(`Looking for retweet of [${tweetId}] in table [${TWEETS_TABLE}]`)

  const resp = await DynamoDB.query({
    TableName: TWEETS_TABLE,
    IndexName: 'retweetsByCreator',
    KeyConditionExpression: 'creator = :creator AND retweetOf = :tweetId',
    ExpressionAttributeValues: {
      ':creator': userId,
      ':tweetId': tweetId,
    },
    Limit: 1,
  }).promise()

  const retweet = get(resp, 'Items.0')

  expect(retweet).toBeTruthy()

  return retweet
}

export const tweet_exists_in_TimelinesTable = async (
  userId: string,
  tweetId: string,
) => {
  const {AWS_REGION, TIMELINES_TABLE} = process.env

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  console.log(`Looking for tweet [${tweetId}] in table [${TIMELINES_TABLE}]`)

  const resp = await DynamoDB.get({
    TableName: TIMELINES_TABLE,
    Key: {
      tweetId,
      userId,
    },
  }).promise()

  expect(resp.Item).toBeTruthy()

  return resp.Item
}

export const retweet_exists_in_RetweetsTable = async ({
  userId,
  tweetId,
}: {
  userId: string
  tweetId: string
}) => {
  const {AWS_REGION, RETWEETS_TABLE} = process.env

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  console.log(
    `Looking for retweet of [${tweetId}] for user [${userId} in table [${RETWEETS_TABLE}]`,
  )

  const resp = await DynamoDB.get({
    TableName: RETWEETS_TABLE,
    Key: {
      tweetId,
      userId,
    },
  }).promise()

  expect(resp.Item).toBeTruthy()

  return resp.Item
}

export const tweetsCount_is_updated_in_UsersTable = async (
  id: string,
  tweetsCount: number,
) => {
  const {AWS_REGION, USERS_TABLE} = process.env

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  const resp = await DynamoDB.get({
    TableName: USERS_TABLE,
    Key: {
      id,
    },
  }).promise()

  expect(resp.Item).toBeTruthy()
  expect(resp.Item.tweetsCount).toBe(tweetsCount)

  return resp.Item
}

export const there_are_N_tweets_in_TimelinesTable = async (
  userId: string,
  count: number,
) => {
  const {AWS_REGION, TIMELINES_TABLE} = process.env

  const DynamoDB = new AWS.DynamoDB.DocumentClient({region: AWS_REGION})

  console.log(
    `Looking for [${count}] tweets [${userId}] in table [${TIMELINES_TABLE}]`,
  )

  const resp = await DynamoDB.query({
    TableName: TIMELINES_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }).promise()

  expect(resp.Items).toHaveLength(count)

  return resp.Items
}
