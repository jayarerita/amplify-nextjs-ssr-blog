import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/demo-data";
import { Amplify } from 'aws-amplify';
import { type Schema } from '../../data/resource';
import { log } from './logger';

export async function initializeAmplify() {
  try {
    log('Initializing Amplify configuration');
    const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
    
    if (!resourceConfig) {
      throw new Error('Failed to get resource configuration');
    }

    Amplify.configure(resourceConfig, libraryOptions);
    const client = generateClient<Schema>();

    if (!client) {
      throw new Error('Amplify client not initialized');
    }
    
    log('Amplify configuration successful');
    return client;

  } catch (error) {
    console.error('Failed to initialize Amplify:', error);
    throw new Error(`Amplify initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}