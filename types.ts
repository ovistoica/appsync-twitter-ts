import {
  AwsResourceCondition,
  AwsResourceDependsOn,
} from '@serverless/typescript'

export type TResource = {
  Type: string
  Properties?: {
    [k: string]: unknown
  }
  CreationPolicy?: {
    [k: string]: unknown
  }
  DeletionPolicy?: string
  DependsOn?: AwsResourceDependsOn
  Metadata?: {
    [k: string]: unknown
  }
  UpdatePolicy?: {
    [k: string]: unknown
  }
  UpdateReplacePolicy?: string
  Condition?: AwsResourceCondition
}

export type Maybe<T> = T | null
export type Exact<T extends {[key: string]: unknown}> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  AWSDateTime: string
  AWSDate: string
  AWSTime: string
  AWSTimestamp: string
  AWSEmail: string
  AWSJSON: Record<any, any>
  AWSURL: string
  AWSPhone: string
  AWSIPAddress: string
}

export enum Allow {
  Public = 'public',
  Owner = 'owner',
  Private = 'private',
}

export enum Operation {
  Read = 'read',
  Write = 'write',
  Update = 'update',
  Create = 'create',
}

export type Rule = {
  allow: Allow
  operations?: Maybe<Array<Operation>>
}

export type Query = {
  __typename?: 'Query'
  getImageUploadUrl: Scalars['AWSURL']
  getMyTimeline: TweetsPage
  getMyProfile: MyProfile
  getProfile: OtherProfile
  getTweets: TweetsPage
  getLikes: TweetsPage
  getFollowers: ProfilesPage
  getFollowing: ProfilesPage
}

export type QueryGetMyProfile = {
  getMyProfile: MyProfile
}

export type QueryGetImageUploadUrl = {
  getImageUploadUrl: Scalars['AWSURL']
}

export type MutationEditMyProfile = {
  editMyProfile: MyProfile
}

export type MutationTweet = {
  tweet: Tweet
}

export type QueryGetImageUploadUrlArgs = {
  extension?: Maybe<Scalars['String']>
  contentType?: Maybe<Scalars['String']>
}

export type QueryGetMyTimelineArgs = {
  limit: Scalars['Int']
  nextToken?: Maybe<Scalars['String']>
}

export type QueryGetProfileArgs = {
  screenName: Scalars['String']
}

export type QueryGetTweetsArgs = {
  userId: Scalars['ID']
  limit: Scalars['Int']
  nextToken?: Maybe<Scalars['String']>
}

export type QueryGetLikesArgs = {
  userId: Scalars['ID']
  limit: Scalars['Int']
  nextToken?: Maybe<Scalars['String']>
}

export type QueryGetFollowersArgs = {
  userId: Scalars['ID']
  limit: Scalars['Int']
  nextToken?: Maybe<Scalars['String']>
}

export type QueryGetFollowingArgs = {
  userId: Scalars['ID']
  limit: Scalars['Int']
  nextToken?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  editMyProfile: MyProfile
  tweet: Tweet
  like: Scalars['Boolean']
  unlike: Scalars['Boolean']
  retweet: Scalars['Boolean']
  unretweet: Scalars['Boolean']
  reply: Reply
  follow: Scalars['Boolean']
  unfollow: Scalars['Boolean']
}

export type MutationEditMyProfileArgs = {
  newProfile: ProfileInput
}

export type MutationTweetArgs = {
  text: Scalars['String']
}

export type MutationLikeArgs = {
  tweetId: Scalars['ID']
}

export type MutationUnlikeArgs = {
  tweetId: Scalars['ID']
}

export type MutationRetweetArgs = {
  tweetId: Scalars['ID']
}

export type MutationUnretweetArgs = {
  tweetId: Scalars['ID']
}

export type MutationReplyArgs = {
  tweetId: Scalars['ID']
  text: Scalars['String']
}

export type MutationFollowArgs = {
  userId: Scalars['ID']
}

export type MutationUnfollowArgs = {
  userId: Scalars['ID']
}

export type ProfileInput = {
  name: Scalars['String']
  imageUrl?: Maybe<Scalars['AWSURL']>
  backgroundImageUrl?: Maybe<Scalars['AWSURL']>
  bio?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  website?: Maybe<Scalars['AWSURL']>
  birthdate?: Maybe<Scalars['AWSDate']>
}

export type IProfile = {
  id: Scalars['ID']
  name: Scalars['String']
  screenName: Scalars['String']
  imageUrl?: Maybe<Scalars['AWSURL']>
  backgroundImageUrl?: Maybe<Scalars['AWSURL']>
  bio?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  website?: Maybe<Scalars['AWSURL']>
  birthdate?: Maybe<Scalars['AWSDate']>
  createdAt: Scalars['AWSDateTime']
  tweets: TweetsPage
  followersCount: Scalars['Int']
  followingCount: Scalars['Int']
  tweetsCount: Scalars['Int']
  likesCounts: Scalars['Int']
}

export type MyProfile = IProfile & {
  __typename?: 'MyProfile'
  id: Scalars['ID']
  name: Scalars['String']
  screenName: Scalars['String']
  imageUrl?: Maybe<Scalars['AWSURL']>
  backgroundImageUrl?: Maybe<Scalars['AWSURL']>
  bio?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  website?: Maybe<Scalars['AWSURL']>
  birthdate?: Maybe<Scalars['AWSDate']>
  createdAt: Scalars['AWSDateTime']
  tweets: TweetsPage
  followersCount: Scalars['Int']
  followingCount: Scalars['Int']
  tweetsCount: Scalars['Int']
  likesCounts: Scalars['Int']
}

export type OtherProfile = IProfile & {
  __typename?: 'OtherProfile'
  id: Scalars['ID']
  name: Scalars['String']
  screenName: Scalars['String']
  imageUrl?: Maybe<Scalars['AWSURL']>
  backgroundImageUrl?: Maybe<Scalars['AWSURL']>
  bio?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  website?: Maybe<Scalars['AWSURL']>
  birthdate?: Maybe<Scalars['AWSDate']>
  createdAt: Scalars['AWSDateTime']
  tweets: TweetsPage
  followersCount: Scalars['Int']
  followingCount: Scalars['Int']
  tweetsCount: Scalars['Int']
  likesCounts: Scalars['Int']
  following: Scalars['Boolean']
  followedBy: Scalars['Boolean']
}

export type ITweet = {
  id: Scalars['ID']
  profile: IProfile
  createdAt: Scalars['AWSDateTime']
}

export type Tweet = ITweet & {
  __typename?: 'Tweet'
  id: Scalars['ID']
  profile: IProfile
  createdAt: Scalars['AWSDateTime']
  text: Scalars['String']
  replies: Scalars['Int']
  likes: Scalars['Int']
  retweets: Scalars['Int']
  liked: Scalars['Boolean']
  retweeted: Scalars['Boolean']
}

export type Reply = ITweet & {
  __typename?: 'Reply'
  id: Scalars['ID']
  profile: IProfile
  createdAt: Scalars['AWSDateTime']
  inReplyToTweet: ITweet
  inReplyToUsers?: Maybe<Array<IProfile>>
  text: Scalars['String']
  replies: Scalars['Int']
  likes: Scalars['Int']
  retweets: Scalars['Int']
  liked: Scalars['Boolean']
  retweeted: Scalars['Boolean']
}

export type Retweet = ITweet & {
  __typename?: 'Retweet'
  id: Scalars['ID']
  profile: IProfile
  createdAt: Scalars['AWSDateTime']
  retweetOf: ITweet
}

export type TweetsPage = {
  __typename?: 'TweetsPage'
  tweets?: Maybe<Array<ITweet>>
  nextToken?: Maybe<Scalars['String']>
}

export type ProfilesPage = {
  __typename?: 'ProfilesPage'
  profiles?: Maybe<Array<IProfile>>
  nextToken?: Maybe<Scalars['String']>
}

export interface AuthenticatedUser {
  username: string
  name: string
  email: string
  idToken: string
  accessToken: string
}

export enum TweetType {
  TWEET = 'Tweet',
  RETWEET = 'Retweet',
  REPLY = 'Reply',
}
