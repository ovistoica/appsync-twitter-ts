import S3 from 'aws-sdk/clients/s3'
import {Handler} from 'aws-lambda'
import {middyfy} from '@libs/lambda'

const ulid = require('ulid')

const S3Client = new S3({useAccelerateEndpoint: true})

interface TS3HandlerEvent {
  identity: {
    username: string
  }
  arguments: {
    extension?: string
    contentType?: string
  }
}

const handler: Handler<TS3HandlerEvent> = async event => {
  const {BUCKET_NAME} = process.env
  if (!BUCKET_NAME) {
    throw new Error('Invalid BUCKET_NAME provided to getUploadImageUrl lambda')
  }
  const id = ulid.ulid()
  let key = `${event.identity.username}/${id}`
  const {extension} = event.arguments

  if (extension) {
    if (extension.startsWith('.')) {
      key += extension
    } else {
      key += `.${extension}`
    }
  }
  const contentType = event.arguments.contentType || 'image/jpeg'

  if (!contentType.startsWith('image/')) {
    throw new Error('content type should be an image')
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ACL: 'public-read',
  }

  return S3Client.getSignedUrl('putObject', params)
}

export const main = middyfy(handler)
