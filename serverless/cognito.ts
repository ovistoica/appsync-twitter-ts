import {TResource} from "@types"
import {GetAtt} from "@libs/utils"

export const cognitoResources: Record<string, TResource> = {
  CognitoUserPool: {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
      AutoVerifiedAttributes: ['email'],
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireLowercase: false,
          RequireNumbers: false,
          RequireUppercase: false,
          RequireSymbols: false,
        },
      },
      UsernameAttributes: ['email'],
      Schema: [
        {
          AttributeDataType: 'String',
          Name: 'name',
          Required: false,
          Mutable: true,
        },
      ],
      LambdaConfig: {
        PostConfirmation: GetAtt('ConfirmUserSignupLambdaFunction.Arn'),
      },
    },
  },

  UserPoolInvokeConfirmUserSignupLambdaPermission: {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      Action: 'lambda:invokeFunction',
      FunctionName: {Ref: 'ConfirmUserSignupLambdaFunction'},
      Principal: 'cognito-idp.amazonaws.com',
      SourceArn: GetAtt('CognitoUserPool.Arn'),
    },
  },

  WebUserPoolClient: {
    Type: 'AWS::Cognito::UserPoolClient',
    Properties: {
      UserPoolId: {Ref: 'CognitoUserPool'},
      ClientName: 'web',
      ExplicitAuthFlows: [
        'ALLOW_USER_SRP_AUTH',
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
      ],
      PreventUserExistenceErrors: 'ENABLED',
    },
  },
}

export const cognitoOutput = {
  CognitoUserPoolId: {Value: {Ref: 'CognitoUserPool'}},
  WebCognitoUserPoolClientId: {Value: {Ref: 'WebUserPoolClient'}},
}
