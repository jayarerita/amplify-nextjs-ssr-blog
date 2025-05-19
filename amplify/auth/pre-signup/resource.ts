import { defineFunction } from '@aws-amplify/backend';

export const preSignUp = defineFunction({
  name: 'pre-signup',
  runtime: 22,
  timeoutSeconds: 30,
  
});