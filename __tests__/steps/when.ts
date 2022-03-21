import { Context, PostConfirmationConfirmSignUpTriggerEvent } from "aws-lambda";
import { adminConfirmUser, createUser } from "@test/lib/cognito";
import GraphQl, { registerFragment } from "@test/lib/graphql";
import { main as configUserSignupHandler } from "@functions/confirm-user-signup/handler";
import { main as getImageUploadUrlHandler } from "@functions/get-upload-url/handler";
import { main as tweetHandler } from "@functions/tweet/handler";
import fs from "fs";
import velocityTemplate from "amplify-velocity-template";
import {
  AuthenticatedUser,
  MutationEditMyProfile,
  MutationLike,
  MutationTweet,
  MutationUnlike,
  ProfileInput,
  QueryGetImageUploadUrl,
  QueryGetImageUploadUrlArgs,
  QueryGetLikes,
  QueryGetMyProfile,
  QueryGetMyTimeline,
  QueryGetTweets
} from "@types";

const velocityMapper = require("amplify-appsync-simulator/lib/velocity/value-mapper/mapper");

// language=GraphQl
const myProfileFragment = `
    fragment myProfileFields on MyProfile {
        bio
        birthdate
        createdAt
        followersCount
        followingCount
        id
        likesCounts
        location
        name
        screenName
        tweetsCount
        website
        backgroundImageUrl
        imageUrl
    }`;

// language=GraphQl
const otherProfileFragment = `
    fragment otherProfileFields on OtherProfile {
        id
        name
        screenName
        imageUrl
        backgroundImageUrl
        bio
        location
        website
        birthdate
        createdAt
        followersCount
        followingCount
        tweetsCount
        likesCounts
    }`;

// language=GraphQl
const iProfileFragment = `
    fragment iProfileFields on IProfile {
        ... on MyProfile {
            ... myProfileFields
        }
        ... on OtherProfile {
            ... otherProfileFields
        }
    }
`;

// language=GraphQl
const tweetFragment = `
    fragment tweetFields on Tweet {
        id
        profile {
            ... iProfileFields
        }
        createdAt
        text
        replies
        likes
        retweets
        liked
    }
`;

// language=GraphQl
const iTweetFragment = `
    fragment iTweetFields on ITweet {
        ... on Tweet {
            ...tweetFields
        }
    }
`;

registerFragment("myProfileFields", myProfileFragment);
registerFragment("otherProfileFields", otherProfileFragment);
registerFragment("iProfileFields", iProfileFragment);
registerFragment("tweetFields", tweetFragment);
registerFragment("iTweetFields", iTweetFragment);

export const we_invoke_confirmUserSignup = async (
  username: string,
  name: string,
  email: string
) => {
  const { AWS_REGION, COGNITO_USER_POOL_ID } = process.env;

  if (!AWS_REGION || !COGNITO_USER_POOL_ID) {
    throw new Error("Invalid env provided");
  }

  const context = {};
  const event = {
    version: "1",
    region: AWS_REGION,
    userPoolId: COGNITO_USER_POOL_ID,
    userName: username,
    triggerSource: "PostConfirmation_ConfirmSignUp",
    request: {
      userAttributes: {
        sub: username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        email_verified: "false",
        name: name,
        email: email
      }
    },
    response: {}
  };

  await configUserSignupHandler(
    event as unknown as PostConfirmationConfirmSignUpTriggerEvent,
    context as unknown as Context,
    (error, result) => {
      if (error) {
        console.log(`ConfirmUserSignup Error ${error}`);
      }

      if (result) {
        console.log(`ConfirmUserSignup Result ${result}`);
      }
    }
  );
};

export const a_user_signs_up = async (
  password: string,
  name: string,
  email: string
) => {
  const { COGNITO_USER_POOL_ID, WEB_COGNITO_USER_POOL_CLIENT_ID } = process.env;

  if (!COGNITO_USER_POOL_ID || !WEB_COGNITO_USER_POOL_CLIENT_ID) {
    throw new Error("Invalid env variables provided to a_user_signs_up");
  }

  const username = await createUser(WEB_COGNITO_USER_POOL_CLIENT_ID, {
    name,
    email,
    password
  });
  console.log(`[${email}] - user has signed up [${username}]`);

  await adminConfirmUser(COGNITO_USER_POOL_ID, username);

  console.log(`[${email}] - confirmed sign up`);

  return { username, name, email };
};

export const we_invoke_an_appsync_template = (
  templatePath: string,
  context: any
) => {
  const template = fs.readFileSync(templatePath, { encoding: "utf-8" });
  const ast = velocityTemplate.parse(template);
  const compiler = new velocityTemplate.Compile(ast, {
    valueMapper: velocityMapper.map,
    escape: false
  });

  return JSON.parse(compiler.render(context));
};

export const a_user_calls_getMyProfile = async (user: AuthenticatedUser) => {
  // language=GraphQL
  const getMyProfile = `query MyQuery {
      getMyProfile {
          ... myProfileFields
          tweets {
              nextToken
              tweets {
                  ... iTweetFields
              }
          }
      }
  }`;
  const { API_URL: url } = process.env;
  if (!url) {
    throw new Error("Invalid API_URL provided to a_user_calls_getMyProfile");
  }

  const data = await GraphQl<QueryGetMyProfile>({
    url,
    auth: user.accessToken,
    variables: {},
    query: getMyProfile
  });

  const profile = data.getMyProfile;

  console.log(`[${user.username}] - fetched profile`);

  return profile;
};

export const a_user_calls_editMyProfile = async (
  user: AuthenticatedUser,
  input: ProfileInput
) => {
  // language=GraphQL
  const editMyProfile = `mutation editMyProfile($input: ProfileInput!) {
      editMyProfile(newProfile: $input) {
          ... myProfileFields

          tweets {
              nextToken
              tweets {
                  ... iTweetFields
              }
          }
      }
  }`;
  const { API_URL: url } = process.env;
  if (!url) {
    throw new Error("Invalid API_URL provided to a_user_calls_getMyProfile");
  }

  const variables = { input };

  const data = await GraphQl<MutationEditMyProfile>({
    url,
    auth: user.accessToken,
    variables,
    query: editMyProfile
  });

  const profile = data.editMyProfile;

  console.log(`[${user.username}] - edited profile`);

  return profile;
};

export const we_invoke_getImageUploadUrl = async (
  username: string,
  extension: string,
  contentType: string
) => {
  const context = {};
  const event = {
    identity: { username },
    arguments: {
      extension,
      contentType
    }
  };

  return getImageUploadUrlHandler(
    event,
    context as unknown as Context,
    error => {
      if (error) {
        console.log(JSON.stringify(error));
      }
    }
  );
};

export const a_user_calls_getImageUploadUrl = async (
  user: AuthenticatedUser,
  extension: string,
  contentType: string
) => {
  // language=GraphQl
  const getImageUploadUrl = `query getImageUploadUrl($extension: String!, $contentType: String!) {
      getImageUploadUrl(extension: $extension, contentType: $contentType)
  }`;

  const variables: QueryGetImageUploadUrlArgs = { extension, contentType };

  const { API_URL: url } = process.env;

  const data = await GraphQl<QueryGetImageUploadUrl>({
    url,
    auth: user.accessToken,
    variables,
    query: getImageUploadUrl
  });

  console.log(`[${user.username}] - got image upload url`);

  return data.getImageUploadUrl;
};

export const we_invoke_tweet = async (username: string, text: string) => {
  const context = {};
  const event = {
    identity: { username },
    arguments: {
      text
    }
  };
  return tweetHandler(event, context as unknown as Context, error => {
    if (error) {
      console.log(JSON.stringify(error));
    }
  });
};

export const a_user_calls_tweet = async (
  user: AuthenticatedUser,
  text: string
) => {
  // language=GraphQL
  const tweet = `mutation tweet($text: String!) {
      tweet(text: $text) {
          ... iTweetFields
      }
  }`;

  const { API_URL: url } = process.env;
  const variables = { text };

  const data = await GraphQl<MutationTweet>({
    url,
    auth: user.accessToken,
    variables,
    query: tweet
  });

  const newTweet = data.tweet;

  console.log(`[${user.username}] - posted new tweet`);

  return newTweet;
};

export const a_user_calls_getTweets = async ({
                                               user,
                                               userId,
                                               limit,
                                               nextToken
                                             }: {
  user: AuthenticatedUser
  userId: string
  limit: number
  nextToken?: string | null
}) => {
  // language=GraphQL
  const getTweets = `query GetTweetsQuery($userId: ID!, $limit: Int!, $nextToken: String) {
      getTweets(userId: $userId, limit: $limit, nextToken: $nextToken) {
          nextToken
          tweets {
              ...iTweetFields
          }
      }}`;

  const { API_URL: url } = process.env;
  const variables = { userId, limit, nextToken };

  const data = await GraphQl<QueryGetTweets>({
    url,
    auth: user.accessToken,
    variables,
    query: getTweets
  });

  console.log(`[${user.username}] - requested tweets`);

  return data.getTweets;
};

export const a_user_calls_getMyTimeline = async ({
                                                   user,
                                                   limit,
                                                   nextToken
                                                 }: {
  user: AuthenticatedUser
  limit: number
  nextToken?: string | null
}) => {
  // language=GraphQL
  const getMyTimline = `query GetMyTimeline($limit: Int!, $nextToken: String) {
      getMyTimeline( limit: $limit, nextToken: $nextToken) {
          nextToken
          tweets {
              ... iTweetFields
          }
      }}`;

  const { API_URL: url } = process.env;
  const variables = { limit, nextToken };

  const data = await GraphQl<QueryGetMyTimeline>({
    url,
    auth: user.accessToken,
    variables,
    query: getMyTimline
  });

  console.log(`[${user.username}] - fetched timeline`);

  return data.getMyTimeline;
};

export const a_user_calls_like = async (
  user: AuthenticatedUser,
  tweetId: string
) => {
  // language=GraphQL
  const like = `mutation like($tweetId: ID!) {
      like(tweetId: $tweetId)
  }`;

  const { API_URL: url } = process.env;
  const variables = { tweetId };

  const data = await GraphQl<MutationLike>({
    url,
    auth: user.accessToken,
    variables,
    query: like
  });

  console.log(`[${user.username}] - liked tweet`);

  return data.like;
};

export const a_user_calls_unlike = async (
  user: AuthenticatedUser,
  tweetId: string
) => {
  // language=GraphQL
  const unlike = `mutation unlike($tweetId: ID!) {
      unlike(tweetId: $tweetId)
  }`;

  const { API_URL: url } = process.env;
  const variables = { tweetId };

  const data = await GraphQl<MutationUnlike>({
    url,
    auth: user.accessToken,
    variables,
    query: unlike
  });

  console.log(`[${user.username}] - unliked tweet`);

  return data.unlike;
};

export const a_user_calls_getLikes = async (
  user: AuthenticatedUser,
  userId: string,
  limit: number
) => {
  // language=GraphQL
  const unlike = `query getLikes($userId: ID!, $limit: Int!, $nextToken: String) {
      getLikes(userId: $userId, limit: $limit, nextToken: $nextToken){
          nextToken,
          tweets {
              ...iTweetFields
          }
      }
  }`;

  const { API_URL: url } = process.env;
  const variables = { userId, limit };

  const data = await GraphQl<QueryGetLikes>({
    url,
    auth: user.accessToken,
    variables,
    query: unlike
  });

  console.log(`[${user.username}] - fetched likes`);

  return data.getLikes;
};
