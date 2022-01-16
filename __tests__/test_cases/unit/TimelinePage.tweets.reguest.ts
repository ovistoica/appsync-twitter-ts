import * as given from '../../steps/given'
import * as when from '../../steps/when'
import path from 'path'

import {Chance} from 'chance'

const chance = new Chance()

describe('TimelinePage.tweets.request template', () => {
  it('Should return empty array if source.tweets array is empty', () => {
    const templatePath = path.resolve(
      __dirname,
      '../../../mapping-templates/TimelinePage.tweets.request.vtl',
    )
    const username = chance.guid()
    const context = given.an_appsync_context({
      identity: {username},
      args: {},
      source: {tweets: []},
    })
    const result = when.we_invoke_an_appsync_template(templatePath, context)
    expect(result).toEqual([])
  })

  it('Should convert timeline tweets to BatchGetItem keys', () => {
    const templatePath = path.resolve(
      __dirname,
      '../../../mapping-templates/TimelinePage.tweets.request.vtl',
    )
    const username = chance.guid()
    const tweetId = chance.guid()
    const tweets = [
      {
        userId: username,
        tweetId,
      },
    ]
    const context = given.an_appsync_context({
      identity: {username},
      args: {},
      source: {tweets},
    })
    const result = when.we_invoke_an_appsync_template(templatePath, context)
    expect(result).toEqual({
      operation: 'BatchGetItem',
      tables: {
        '${TweetsTable}': {
          consistentRead: false,
          keys: [
            {
              id: {
                S: tweetId,
              },
            },
          ],
        },
      },
      version: '2018-05-29',
    })
  })
})
