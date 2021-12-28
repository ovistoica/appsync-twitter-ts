require('dotenv').config()

import * as given from '../../steps/given'
import * as when from '../../steps/when'
import * as then from '../../steps/then'

describe('When a user signs up', () => {
  it("The user's profile should be saved in DynamoDB", async () => {
    const {name, email, password} = given.aRandomUser()

    const user = await when.a_user_signs_up(password, name, email)

    const ddbUser = await then.user_exists_in_UsersTable(user.username)

    if (!ddbUser) {
      throw new Error('No user found')
    }

    expect(ddbUser).toMatchObject({
      id: user.username,
      name,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g,
      ),
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCounts: 0,
    })

    const [firstName, lastName] = name.split(' ')
    expect(ddbUser.screenName).toContain(firstName)
    expect(ddbUser.screenName).toContain(lastName)
  })
})
