import { defineStorage } from '@aws-amplify/backend';
import { demoData } from '../functions/demoData/resource';
import { deleteDemoData } from '../functions/deleteDemoData/resource';

export const storage = defineStorage({
  name: 'blogStorage',
  access: (allow) => ({
    'covers/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
      allow.resource(demoData).to(['write']),
      allow.resource(deleteDemoData).to(['delete'])
    ],
    'thumbnails/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
      allow.resource(demoData).to(['write']),
      allow.resource(deleteDemoData).to(['delete'])
    ],
    'markdown/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
      allow.resource(demoData).to(['write']),
      allow.resource(deleteDemoData).to(['delete'])
    ]
  })
}); 