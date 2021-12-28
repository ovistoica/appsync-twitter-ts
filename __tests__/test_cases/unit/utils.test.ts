import {GetAtt} from '@libs/utils'

describe('GetAtt', () => {
  it('Should output correct CloudFormation JSON format', () => {
    expect(GetAtt('UsersTable.Arn')).toEqual({
      'Fn::GetAtt': ['UsersTable', 'Arn'],
    })
  })
})
