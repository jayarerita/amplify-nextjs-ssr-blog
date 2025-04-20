import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'blogStorage',
  access: (allow) => ({
    'blog-images/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
    ],
    'markdown/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
    ]
  })
}); 