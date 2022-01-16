require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import {ITweet} from '@types'
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

    describe('When he calls getTweets', () => {
      let tweets: ITweet[]
      let nextToken: string
      beforeAll(async () => {
        const result = await when.a_user_calls_getTweets({
          user,
          userId: user.username,
          limit: 25,
        })
        tweets = result.tweets
        nextToken = result.nextToken
      })

      it('Should return list of tweets when user calls getTweets', () => {
        expect(nextToken).toBeNull()
        expect(tweets.length).toEqual(1)
        expect(tweets[0]).toEqual(tweet)
      })

      it('Should fail if user asks for more than 25 tweets in a page', async () => {
        await expect(
          when.a_user_calls_getTweets({
            user,
            userId: user.username,
            limit: 27,
          }),
        ).rejects.toMatchObject({
          message: expect.stringContaining('max limit is 25'),
        })
      })
    })

    describe('When he calls getMyTimeline', () => {
      let tweets: ITweet[]
      let nextToken: string
      beforeAll(async () => {
        const result = await when.a_user_calls_getMyTimeline({
          user,
          limit: 25,
        })
        tweets = result.tweets
        nextToken = result.nextToken
      })

      it('Should return list of tweets when user calls getTweets', () => {
        expect(nextToken).toBeNull()
        expect(tweets.length).toEqual(1)
        expect(tweets[0]).toEqual(tweet)
      })

      it('Should fail if user asks for more than 25 tweets in a page', async () => {
        await expect(
          when.a_user_calls_getMyTimeline({
            user,
            limit: 27,
          }),
        ).rejects.toMatchObject({
          message: expect.stringContaining('max limit is 25'),
        })
      })
    })
  })
})
