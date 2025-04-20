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
  const userId = event.request.userAttributes.sub;
  const profileOwner = `${userId}::${event.userName}`;
  // Create a default user profile for the user 
  console.log("Creating user profile for user:", userId);
  const userProfile = await client.models.UserProfile.create({
    id: userId,
    email: event.request.userAttributes.email,
    profileOwner: profileOwner,
    username: event.request.userAttributes.username,
    displayName: event.request.userAttributes.name,
    role: "admin"
  });
  console.log("User profile created:", userProfile);

  return event;
};