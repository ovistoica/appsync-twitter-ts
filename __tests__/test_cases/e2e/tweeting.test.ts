require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import {ITweet, Tweet} from '@types'
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
        liked: false,
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
    describe('When he likes a tweet', () => {
      beforeAll(async () => {
        await when.a_user_calls_like(user, tweet.id)
      })

      it('Should see Tweet.liked as true', async () => {
        const {tweets} = await when.a_user_calls_getMyTimeline({
          user,
          limit: 25,
        })
        expect(tweets).toHaveLength(1)
        expect(tweets[0].id).toEqual(tweet.id)
        expect((tweets[0] as Tweet).liked).toEqual(true)
      })

      it('Should not be able to like the same tweet a second time', async () => {
        await expect(() =>
          when.a_user_calls_like(user, tweet.id),
        ).rejects.toMatchObject({
          message: expect.stringMatching('DynamoDB transaction error'),
        })
      })

      describe('When he unlikes the tweet', () => {
        beforeAll(() => {
          when.a_user_calls_unlike(user, tweet.id)
        })

        it('Should see Tweet.liked as false', async () => {
          const {tweets} = await when.a_user_calls_getMyTimeline({
            user,
            limit: 25,
          })
          expect(tweets).toHaveLength(1)
          expect(tweets[0].id).toEqual(tweet.id)
          expect((tweets[0] as Tweet).liked).toEqual(false)
        })

        it('Should not be able to unlike the same tweet a second time', async () => {
          await expect(() =>
            when.a_user_calls_unlike(user, tweet.id),
          ).rejects.toMatchObject({
            message: expect.stringMatching('DynamoDB transaction error'),
          })
        })
      })
    })
  })
})
