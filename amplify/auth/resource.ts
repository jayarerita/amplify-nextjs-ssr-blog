import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource';
import { customMessage } from './custom-message/resource';
import { createConfirmationCodeEmail } from './custom-message/email-template';

export const auth = defineAuth({
  triggers: {
    postConfirmation,
    customMessage,
  },
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
      verificationEmailSubject: "Welcome to Your Blog!",
      verificationEmailBody: (createCode) => createConfirmationCodeEmail(createCode(),"signUp")
    },
  }
});