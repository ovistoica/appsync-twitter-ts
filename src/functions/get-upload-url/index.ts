import {handlerPath} from '@libs/handlerResolver'
import {GetAtt} from '@libs/utils'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    BUCKET_NAME: {Ref: 'AssetsBucket'},
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: {
        'Fn::Sub': [
          '${AssetsBucketArn}/*',
          {AssetsBucketArn: GetAtt('AssetsBucket.Arn')},
        ],
      },
    },
  ],
}
