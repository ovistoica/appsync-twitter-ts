import AWS from 'aws-sdk'
import http from 'axios'
import fs from 'fs'

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
