require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import {AuthenticatedUser, MyProfile} from '@types'

describe('Given an authenticated user', () => {
  let user: AuthenticatedUser
  beforeAll(async () => {
    user = await given.an_authenticated_user()
  })

  test('The user can fetch his profile with getMyProfile', async () => {
    const profile: MyProfile = await when.a_user_calls_getMyProfile(user)

    expect(profile).toMatchObject({
      id: user.username,
      name: user.name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g,
      ),
      // tweets: TweetsPage!
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCounts: 0,
    })

    const [firstName, lastName] = user.name.split(' ')
    expect(profile.screenName).toContain(firstName)
    expect(profile.screenName).toContain(lastName)
  })
})
