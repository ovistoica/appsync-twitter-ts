import * as given from '../../steps/given'
import * as when from '../../steps/when'
import path from 'path'

import {Chance} from 'chance'

const chance = new Chance()

describe('Query.getTweets.request template', () => {
  it('Should error if limit is over 25', () => {
    const templatePath = path.resolve(
      __dirname,
      '../../../mapping-templates/Query.getTweets.request.vtl',
    )
    const username = chance.guid()
    const context = given.an_appsync_context({
      identity: {username},
      args: {userId: username, limit: 26, nextToken: null},
    })
    expect(() =>
      when.we_invoke_an_appsync_template(templatePath, context),
    ).toThrowError('max limit is 25')
  })
})
