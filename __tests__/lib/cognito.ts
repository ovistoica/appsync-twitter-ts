import AWS from 'aws-sdk'

export async function createUser(
  clientId: string,
  newUser: {email: string; password: string; name: string},
) {
  const cognito = new AWS.CognitoIdentityServiceProvider()

  const signUpResp = await cognito
    .signUp({
      ClientId: clientId,
      Username: newUser.email,
      Password: newUser.password,
      UserAttributes: [{Name: 'name', Value: newUser.name}],
    })
    .promise()

  return signUpResp.UserSub
}

export async function adminConfirmUser(userPoolId: string, username: string) {
  const cognito = new AWS.CognitoIdentityServiceProvider()

  return await cognito
    .adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: username,
    })
    .promise()
}
