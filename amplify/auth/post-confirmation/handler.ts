import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  console.log("Post confirmation event:", event);
  // Check how many user profiles exist in the database
  const { data: userProfiles, errors } = await client.models.UserProfile.list();
  let role = "user";
  // If there are no user profiles, create the user as an admin
  if (userProfiles.length === 0) {
    console.log("No user profiles found, creating user as admin");
    role = "admin";
  }
  const userId = event.request.userAttributes.sub;
  const profileOwner = `${userId}::${event.userName}`;
  console.log("Creating user profile for user:", userId);
  const {data: newUserProfile, errors: newUserProfileErrors} = await client.models.UserProfile.create({
    id: userId,
    email: event.request.userAttributes.email,
    profileOwner: profileOwner,
    username: event.request.userAttributes.username || event.request.userAttributes.email,
    displayName: event.request.userAttributes.nickname || event.request.userAttributes.email,
    role: role as "user" | "admin"
  });
  if (newUserProfileErrors) {
    console.error("Error creating user profile:", newUserProfileErrors);
  }
  console.log("User profile created:", newUserProfile);

  return event;
};