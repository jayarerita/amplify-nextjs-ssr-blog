import { type Schema } from '../../data/resource';
import { initializeAmplify } from "../utils/initializeAmplifyClient";
import { log } from "../utils/logger";
import { 
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  ListUsersCommand,
  ListUsersCommandInput,
} from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });


export const handler: Schema["createUser"]["functionHandler"] = async (event) => {
  // For debugging purposes
  console.log('Event:', event);

  try {
    log('Function started');
    // Initialize Amplify before processing
    const client = await initializeAmplify();

    // Check if the user already exists in Cognito
    const userExistsInput: ListUsersCommandInput = { 
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Filter: `email = "${event.arguments.email}"`,
    };
    const userExists = await cognitoClient.send(new ListUsersCommand(userExistsInput));
    if (userExists.Users?.length && userExists.Users.length > 0) {
      log('User already exists in Cognito:', userExists.Users[0].Username  );
      throw new Error('User already exists in Cognito');
    }

    // Create the user in Cognito
    const { username, email, password, displayName, bio } = event.arguments;
    const input: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
      UserAttributes: [
        { Name: 'email', Value: email },
      ],
      TemporaryPassword: password,
    };  
    const command = new AdminCreateUserCommand(input);
    const response = await cognitoClient.send(command);
    if (response.User) {
      log('User created in cognito successfully:', response.User);
    } else {
      log('User creation failed in cognito:', response);
      throw new Error('User creation failed in cognito');
    }

    // Create the user profile in Amplify
    const userProfileInput: Schema["UserProfile"]["createType"] = {
      id: username,
      username: username,
      email: email,
      role: 'user',
      profileOwner: username,
      displayName: displayName,
      bio: bio,
    };
    const userProfile = await client.models.UserProfile.create(userProfileInput);
    if (userProfile) {
      log('User profile created successfully:', userProfile);
    } else {
      log('User profile creation failed:', userProfile);
      throw new Error('User profile creation failed');
    }

    return {
      success: true,
      message: 'User created successfully',
    };

  } catch (error) {
    log('Error creating user:', error);
    throw new Error(`User creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}