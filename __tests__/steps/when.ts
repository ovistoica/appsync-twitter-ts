import {Context, PostConfirmationConfirmSignUpTriggerEvent} from 'aws-lambda'
import {adminConfirmUser, createUser} from '@test/lib/cognito'
import GraphQl from '@test/lib/graphql'
import {main as handler} from '@functions/confirm-user-signup/handler'
import fs from 'fs'
import velocityTemplate from 'amplify-velocity-template'
import {AuthenticatedUser, MutationEditMyProfile, ProfileInput, QueryGetMyProfile} from '@types'

const velocityMapper = require('amplify-appsync-simulator/lib/velocity/value-mapper/mapper')

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

  return {username, name, email}
}

export const we_invoke_an_appsync_template = (
  templatePath: string,
  context: any,
) => {
  const template = fs.readFileSync(templatePath, {encoding: 'utf-8'})
  const ast = velocityTemplate.parse(template)
  const compiler = new velocityTemplate.Compile(ast, {
    valueMapper: velocityMapper.map,
    escape: false,
  })

  return compiler.render(context)
}

export const a_user_calls_getMyProfile = async (user: AuthenticatedUser) => {
  const getMyProfile = `query MyQuery {
  getMyProfile {
    bio
    birthdate
    createdAt
    followersCount
    followingCount
    id
    likesCounts
    location
    name
    screenName
    tweetsCount
    website
    backgroundImageUrl
    imageUrl
  }
}`
  const {API_URL: url} = process.env
  if (!url) {
    throw new Error('Invalid API_URL provided to a_user_calls_getMyProfile')
  }

  const data = await GraphQl<QueryGetMyProfile>({
    url,
    auth: user.accessToken,
    variables: {},
    query: getMyProfile,
  })

  const profile = data.getMyProfile

  console.log(`[${user.username}] - fetched profile`)

  return profile
}

export const a_user_calls_editMyProfile = async (
  user: AuthenticatedUser,
  input: ProfileInput,
) => {
  const getMyProfile = `mutation editMyProfile($input: ProfileInput!) {
  editMyProfile(newProfile: $input) {
    bio
    birthdate
    createdAt
    followersCount
    followingCount
    id
    likesCounts
    location
    name
    screenName
    tweetsCount
    website
    backgroundImageUrl
    imageUrl
  }
}`
  const {API_URL: url} = process.env
  if (!url) {
    throw new Error('Invalid API_URL provided to a_user_calls_getMyProfile')
  }

  const variables = {input}

  const data = await GraphQl<MutationEditMyProfile>({
    url,
    auth: user.accessToken,
    variables,
    query: getMyProfile,
  })

  const profile = data.editMyProfile

  console.log(`[${user.username}] - edited profile`)

  return profile
}
