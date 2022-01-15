import {Chance} from 'chance'
import {AmplifyAppSyncSimulatorAuthenticationType} from 'amplify-appsync-simulator'
import AWS from 'aws-sdk'
import {adminConfirmUser, createUser} from '../lib/cognito'

const velocityUtil = require('amplify-appsync-simulator/lib/velocity/util')

const chance = new Chance()

export const aRandomUser = () => {
  const firstName = chance.first({nationality: 'en'})
  const lastName = chance.first({nationality: 'en'})
  const suffix = chance.string({length: 4, pool: 'abcdefghijklmnopqrstxyz'})

  const name = `${firstName} ${lastName} ${suffix}`
  const password = chance.string({length: 8})
  const email = `${firstName}-${lastName}-${suffix}@twitterapiclone.com`

  return {email, password, name}
}

export const an_appsync_context = (identity: {username: string}, args: any, result?: any) => {
  const util = velocityUtil.create([], new Date(), Object(), {
    headers: {},
    requestAuthorizationMode:
      AmplifyAppSyncSimulatorAuthenticationType.AMAZON_COGNITO_USER_POOLS,
  })
  const context = {identity, args, arguments: args, result}
  return {context, ctx: context, util, utils: util}
}

export const an_authenticated_user = async () => {
  const {name, email, password} = aRandomUser()

  const cognito = new AWS.CognitoIdentityServiceProvider()

  const {COGNITO_USER_POOL_ID, WEB_COGNITO_USER_POOL_CLIENT_ID} = process.env

  if (!COGNITO_USER_POOL_ID || !WEB_COGNITO_USER_POOL_CLIENT_ID) {
    throw new Error('Invalid env variables provided to a_user_signs_up')
  }

  const username = await createUser(WEB_COGNITO_USER_POOL_CLIENT_ID, {
    name,
    email,
    password,
  })
  console.log(`[${email}] - user has signed up [${username}]`)

  await adminConfirmUser(COGNITO_USER_POOL_ID, username)
  console.log(`[${email}] - confirmed sign up`)

  const auth = await cognito
    .initiateAuth({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: WEB_COGNITO_USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    })
    .promise()

  console.log(`[${email}] - signed in`)

  return {
    username,
    name,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken,
  }
}
