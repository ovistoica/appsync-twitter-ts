export const s3Resources = {
  AssetsBucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      AccelerateConfiguration: {AccelerationStatus: 'Enabled'},
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedMethods: ['GET', 'PUT'],
            AllowedOrigins: ['*'],
            AllowedHeaders: ['*'],
          },
        ],
      },
    },
  },
}

export const s3Outputs = {
  BucketName: {Value: {Ref: 'AssetsBucket'}},
}
