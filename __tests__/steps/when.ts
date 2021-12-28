import {Context, PostConfirmationConfirmSignUpTriggerEvent} from 'aws-lambda'
import AWS from 'aws-sdk'
import {main as handler} from '../../src/functions/confirm-user-signup/handler'

export const we_invoke_confirmUserSignup = async (
  username: string,
  name: string,
  email: string,
) => {
  const {AWS_REGION, COGNITO_USER_POOL_ID} = process.env

  if (!AWS_REGION || !COGNITO_USER_POOL_ID) {
    throw new Error('Invalid env provided')
  }

  const context = {}
  const event = {
    version: '1',
    region: AWS_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userName: username,
    triggerSource: 'PostConfirmation_ConfirmSignUp',
    request: {
      userAttributes: {
        sub: username,
        'cognito:email_alias': email,
        'cognito:user_status': 'CONFIRMED',
        email_verified: 'false',
        name: name,
        email: email,
      },
    },
    response: {},
  }

  await handler(
    event as unknown as PostConfirmationConfirmSignUpTriggerEvent,
    context as unknown as Context,
    (error, result) => {
      if (error) {
        console.log(`ConfirmUserSignup Error ${error}`)
      }

      if (result) {
        console.log(`ConfirmUserSignup Result ${result}`)
      }
    },
  )
}

export const a_user_signs_up = async (
  password: string,
  name: string,
  email: string,
) => {
  const cognito = new AWS.CognitoIdentityServiceProvider()

  const {COGNITO_USER_POOL_ID, WEB_COGNITO_USER_POOL_CLIENT_ID} = process.env

  if (!COGNITO_USER_POOL_ID || !WEB_COGNITO_USER_POOL_CLIENT_ID) {
    throw new Error('Invalid env variables provided to a_user_signs_up')
  }

  const signUpResp = await cognito
    .signUp({
      ClientId: WEB_COGNITO_USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{Name: 'name', Value: name}],
    })
    .promise()

  const username = signUpResp.UserSub
  console.log(`[${email}] - user has signed up [${username}]`)

  await cognito
    .adminConfirmSignUp({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username,
    })
    .promise()

  console.log(`[${email}] - confirmed sign up`)

  return {username, name, email}
}
