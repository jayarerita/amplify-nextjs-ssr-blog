import type { CustomMessageTriggerHandler } from "aws-lambda";
import { createConfirmationCodeEmail } from "./email-template";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const locale = event.request.userAttributes["locale"];
    if (locale === "en") {
      event.response.emailMessage = createConfirmationCodeEmail(event.request.codeParameter, "forgotPassword");
      event.response.emailSubject = "gutsy | Reset my password";
    } else if (locale === "es") {
      event.response.emailMessage = `Tu nuevo código de un solo uso es ${event.request.codeParameter}`;
      event.response.emailSubject = "gutsy | Restablecer mi contraseña";
    }
  }
  if (event.triggerSource === "CustomMessage_ResendCode") {
    const locale = event.request.userAttributes["locale"];
    if (locale === "en") {
      event.response.emailMessage = createConfirmationCodeEmail(event.request.codeParameter, "resendCode");
      event.response.emailSubject = "gutsy | Resend code";
    } else if (locale === "es") {
      event.response.emailMessage = `Tu nuevo código de un solo uso es ${event.request.codeParameter}`;
      event.response.emailSubject = "gutsy | Reenviar código";
    }
  }
  if (event.triggerSource === "CustomMessage_SignUp") {
    const locale = event.request.userAttributes["locale"];
    if (locale === "en") {
      event.response.emailMessage = createConfirmationCodeEmail(event.request.codeParameter, "signUp");
      event.response.emailSubject = "gutsy | Verify your email";
    } else if (locale === "es") {
      event.response.emailMessage = `Tu código de un solo uso es ${event.request.codeParameter}`;
      event.response.emailSubject = "gutsy | Verificar correo electrónico";
    }
  }

  return event;
};