import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import path from 'path'

import {Chance} from 'chance'

const chance = new Chance()

describe('Mutation.editMyProfile.request template', () => {
  it('Should use newProfile fields in expressionValues ', () => {
    const templatePath = path.resolve(
      __dirname,
      '../../../mapping-templates/Mutation.editMyProfile.request.vtl',
    )
    const newProfile = {
      name: 'Test',
      bio: 'This is me',
      location: 'At home chilling',
      website: 'https://designvote.io',
      birthdate: Date.now(),
    }
    const username = chance.guid()
    const context = given.an_appsync_context({username}, {newProfile})
    const result = when.we_invoke_an_appsync_template(templatePath, context)

    expect(result).toMatchInlineSnapshot(`
      "{
        \\"version\\" : \\"2018-05-29\\",
        \\"operation\\" : \\"UpdateItem\\",
        \\"key\\": {
          \\"id\\" : {\\"S\\":\\"${username}\\"}
        },
        \\"update\\" : {
          \\"expression\\" : \\"set #name = :name, imageUrl = :imageUrl, backgroundImageUrl = :backgroundImageUrl, bio = :bio, #location = :location, website = :website, birthdate = :birthdate\\",
          \\"expressionNames\\" : {
            \\"#name\\" : \\"name\\",
            \\"#location\\" : \\"location\\"
          },
          \\"expressionValues\\" : {
            \\":name\\" : {\\"S\\":\\"${newProfile.name}\\"},
            \\":imageUrl\\" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.imageUrl),
            \\":backgroundImageUrl\\" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.backgroundImageUrl),
            \\":bio\\" : {\\"S\\":\\"${newProfile.bio}\\"},
            \\":location\\" : {\\"S\\":\\"${newProfile.location}\\"},
            \\":website\\" : {\\"S\\":\\"${newProfile.website}\\"},
            \\":birthdate\\" : {\\"N\\":\\"${newProfile.birthdate}\\"}
          }
        },
        \\"condition\\" : {
          \\"expression\\" : \\"attribute_exists(id)\\"
        }
      }"
    `)
  })
})
