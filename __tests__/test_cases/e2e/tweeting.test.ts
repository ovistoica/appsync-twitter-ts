require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
// import * as then from '@test/steps/then'
import {Chance} from 'chance'

const chance = new Chance()

describe('Given an authenticated user', () => {
  let user

  beforeAll(async () => {
    user = await given.an_authenticated_user()
  })

  describe('When he sends a tweet', () => {
    let tweet
    let text = chance.string({length: 16})

    beforeAll(async () => {
      tweet = await when.a_user_calls_tweet(user, text)
    })

    it('Should return a new tweet', () => {
      expect(tweet).toMatchObject({
        text,
        replies: 0,
        likes: 0,
        retweets: 0,
      })
    })
  })
})
