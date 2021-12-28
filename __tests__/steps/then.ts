import AWS from 'aws-sdk'

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
