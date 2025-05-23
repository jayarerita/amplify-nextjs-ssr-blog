import { defineFunction } from '@aws-amplify/backend';

export const createUser = defineFunction({
  name: 'create-user',
  entry: './handler.ts',
  timeoutSeconds: 30,
  runtime: 22,
  environment: {
    DEBUG: 'true',
  },
}); 