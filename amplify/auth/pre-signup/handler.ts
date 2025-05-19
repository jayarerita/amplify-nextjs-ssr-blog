import type { PreSignUpTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/pre-signup";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PreSignUpTriggerHandler = async (event) => {
  console.log("Pre-signup event:", event);
  // Check how many user profiles exist in the database
  try {
    const { data: userProfiles, errors } = await client.models.UserProfile.list();
    if (errors) {
      throw new Error("Error listing user profiles: " + errors);
    }
    if (userProfiles.length === 0) {
      return event;
    }
    throw new Error("A user profile already exists, please use admin panel to create a new user.");
  } catch (error) {
    throw new Error(error as string);
  }
};