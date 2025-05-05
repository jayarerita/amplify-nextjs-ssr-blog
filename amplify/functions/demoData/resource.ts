import { defineFunction } from '@aws-amplify/backend';

export const demoData = defineFunction({
  name: 'demo-data',
  entry: './handler.ts',
  runtime: 22,
  timeoutSeconds: 30,
  environment: {
    DEBUG: 'true',
  },
}); 