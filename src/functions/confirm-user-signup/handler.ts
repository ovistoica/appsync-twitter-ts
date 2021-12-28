import {Handler, PostConfirmationConfirmSignUpTriggerEvent} from 'aws-lambda'
import DynamoDB from 'aws-sdk/clients/dynamodb'
import Chance from 'chance'
import {middyfy} from '@libs/lambda'

const DocumentClient = new DynamoDB.DocumentClient({region: 'eu-central-1'})
const chance = new Chance()
const {USERS_TABLE} = process.env

const handler: Handler<
  PostConfirmationConfirmSignUpTriggerEvent
> = async event => {
  if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
    const name = event.request.userAttributes['name']
    const suffix = chance.string({
      length: 8,
      casing: 'upper',
      alpha: true,
      numeric: true,
    })
    const screenName = `${name.replace(/^a-zA-Z0-9/g, '')}${suffix}`
    const user = {
      id: event.userName,
      name,
      screenName,
      createdAt: new Date().toJSON(),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCounts: 0,
    }
    if (!USERS_TABLE) {
      throw new Error('No USERS_TABLE provided')
    }
    await DocumentClient.put({
      TableName: USERS_TABLE,
      Item: user,
      ConditionExpression: 'attribute_not_exists(id)',
    }).promise()
    return event
  } else {
    return event
  }
}

export const main = middyfy(handler)
