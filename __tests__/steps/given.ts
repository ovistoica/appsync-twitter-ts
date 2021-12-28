import {Chance} from 'chance'
const chance = new Chance()

export const aRandomUser = () => {
  const firstName = chance.first({nationality: 'en'})
  const lastName = chance.first({nationality: 'en'})
  const suffix = chance.string({length: 4, pool: 'abcdefghijklmnopqrstxyz'})

  const name = `${firstName} ${lastName} ${suffix}`
  const password = chance.string({length: 8})
  const email = `${firstName}-${lastName}-${suffix}@twitterapiclone.com`

  return {email, password, name}
}
