require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import * as then from '@test/steps/then'
import {AuthenticatedUser} from '../../../types'
import {Chance} from 'chance'

const chance = new Chance()

describe('Given an authenticated user', () => {
  let user: AuthenticatedUser

  beforeAll(async () => {
    user = await given.an_authenticated_user()
  })

  describe('When he sends a tweet', () => {
    const text = chance.string({length: 16})
    let tweet

    beforeAll(async () => {
      tweet = await when.we_invoke_tweet(user.username, text)
    })

    it('Saves the tweet in the TweetsTable', async () => {
      await then.tweet_exists_in_TweetsTable(tweet.id)
    })

    it('Saves the tweet in the TimelinesTable', async () => {
      await then.tweet_exists_in_TimelinesTable(user.username, tweet.id)
    })

    it('Increments the tweetCount in the UsersTable to 1', async () => {
      await then.tweetsCount_is_updated_in_UsersTable(user.username, 1)
    })
  })
})
