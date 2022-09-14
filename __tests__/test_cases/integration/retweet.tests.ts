require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import * as then from '@test/steps/then'
import {Chance} from 'chance'

const chance = new Chance()

describe('Given an authenticated user', () => {
  let userA: {username: string}
  let tweet: {text: string; id: string}

  const text = chance.string({length: 16})

  beforeAll(async () => {
    userA = await given.an_authenticated_user()
    tweet = await when.we_invoke_tweet(userA.username, text)
  })

  describe('When he retweets his own tweet', () => {
    beforeAll(async () => {
      await when.we_invoke_retweet({
        username: userA.username,
        tweetId: tweet.id,
      })
    })

    it('Saves the retweet in the tweets table', async () => {
      await then.retweet_exists_in_TweetsTable({
        userId: userA.username,
        tweetId: tweet.id,
      })
    })

    it('Saves the retweet in the Retweets table', async () => {
      await then.retweet_exists_in_RetweetsTable({
        userId: userA.username,
        tweetId: tweet.id,
      })
    })

    it('Increments the retweets count in the Tweets table', async () => {
      const {retweets} = await then.tweet_exists_in_TweetsTable(tweet.id)
      expect(retweets).toEqual(1)
    })

    it('Increments tweets count in the Users table', async () => {
      await then.tweetsCount_is_updated_in_UsersTable(userA.username, 2)
    })

    it("Doesn't save the retweet in the Timelines table", async () => {
      await then.there_are_N_tweets_in_TimelinesTable(userA.username, 1)
    })
  })
})
