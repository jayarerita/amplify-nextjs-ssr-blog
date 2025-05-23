import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { demoData } from './functions/demoData/resource';
import { deleteDemoData } from './functions/deleteDemoData/resource';
import { createUser } from './functions/createUser/resource';

defineBackend({
  auth,
  data,
  storage,
  demoData,
  deleteDemoData,
  createUser,
});
