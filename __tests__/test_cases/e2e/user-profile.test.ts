require("dotenv").config();

import * as given from "@test/steps/given";
import * as when from "@test/steps/when";
import * as then from "@test/steps/then";
import * as path from "path";
import { AuthenticatedUser, MyProfile, ProfileInput } from "@types";
import { Chance } from "chance";

describe("Given an authenticated user", () => {
  let user: AuthenticatedUser;
  let chance: Chance.Chance;
  let profile: MyProfile;
  beforeAll(async () => {
    user = await given.an_authenticated_user();
    chance = new Chance();
  });

  test("The user can fetch his profile with getMyProfile", async () => {
    profile = await when.a_user_calls_getMyProfile(user);

    expect(profile).toMatchObject({
      id: user.username,
      name: user.name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      createdAt: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g
      ),
      // tweets: TweetsPage!
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCounts: 0,
      tweets: {
        nextToken: null,
        tweets: null
      }
    });

    const [firstName, lastName] = user.name.split(" ");
    expect(profile.screenName).toContain(firstName);
    expect(profile.screenName).toContain(lastName);
  });

  test("User can get an url to upload a new profile image", async () => {
    const extension = ".png";
    const contentType = "image/png";
    const filePath = path.join(__dirname, "../../data/test-profile-pic.png");
    const uploadUrl = await when.a_user_calls_getImageUploadUrl(
      user,
      extension,
      contentType
    );

    const { BUCKET_NAME: bucketName } = process.env;
    const regex = new RegExp(
      `https://${bucketName}.s3-accelerate.amazonaws.com/${user.username}/.*${extension}\?.*`
    );
    expect(uploadUrl).toMatch(regex);
    await then.user_can_upload_image_to_url(uploadUrl, filePath, contentType);

    const [downloadUrl] = uploadUrl.split("?");
    await then.user_can_download_image_from(downloadUrl);
  });

  test("The user can edit his profile with editMyProfile", async () => {
    const newName = chance.first();
    const input: ProfileInput = {
      name: newName
    };
    const newProfile: MyProfile = await when.a_user_calls_editMyProfile(
      user,
      input
    );

    expect(newProfile).toMatchObject({
      ...profile,
      name: newName
    });
  });
});
