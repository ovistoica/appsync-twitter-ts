import * as given from '../../steps/given'
import * as when from '../../steps/when'
import {Chance} from 'chance'
import * as path from 'path'

const chance = new Chance()

describe('Tweet.profile.request template', () => {
  it('Should not short-circuit if selectionSetList has more than just id', () => {
    const templatePath = path.resolve(
      __dirname,
      '../../../mapping-templates/Tweet.profile.request.vtl',
    )

    const username = chance.guid()
    const info = {selectionSetList: ['id', 'bio']}
    const context = given.an_appsync_context({
      identity: {username},
      args: {},
      source: {creator: username},
      info,
    })
    const result = when.we_invoke_an_appsync_template(templatePath, context)

    expect(result).toEqual({
      key: {
        id: {
          S: username,
        },
      },
      operation: 'GetItem',
      version: '2018-05-29',
    })
  })

  it('Should short-circuit if selectionSetList has  just id', () => {
    const templatePath = path.resolve(
      __dirname,
      '../../../mapping-templates/Tweet.profile.request.vtl',
    )

    const username = chance.guid()
    const info = {selectionSetList: ['id']}
    const context = given.an_appsync_context({
      identity: {username},
      args: {},
      source: {creator: username},
      info,
    })
    const result = when.we_invoke_an_appsync_template(templatePath, context)

    expect(result).toEqual({
      __typename: 'MyProfile',
      id: username,
    })
  })
})
