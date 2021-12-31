require('dotenv').config()

import * as given from '@test/steps/given'
import * as when from '@test/steps/when'
import {AuthenticatedUser, MyProfile, ProfileInput} from '@types'
import {Chance} from 'chance'

describe('Given an authenticated user', () => {
  let user: AuthenticatedUser
  let chance: Chance.Chance
  let profile: MyProfile
  beforeAll(async () => {
    user = await given.an_authenticated_user()
    chance = new Chance()
  })

  test('The user can fetch his profile with getMyProfile', async () => {
    profile = await when.a_user_calls_getMyProfile(user)

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

  test('The user can edit his profile with editMyProfile', async () => {
    const newName = chance.first()
    const input: ProfileInput = {
      name: newName,
    }
    const newProfile: MyProfile = await when.a_user_calls_editMyProfile(
      user,
      input,
    )

    expect(newProfile).toMatchObject({
      ...profile,
      name: newName,
    })
  })
})
