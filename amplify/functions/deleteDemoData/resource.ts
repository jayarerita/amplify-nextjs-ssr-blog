import { defineFunction } from '@aws-amplify/backend';

export const deleteDemoData = defineFunction({
  name: 'delete-demo-data',
  entry: './handler.ts',
  timeoutSeconds: 30,
  runtime: 22,
  environment: {
    DEBUG: 'true',
  },
}); 