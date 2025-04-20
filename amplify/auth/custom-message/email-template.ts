type CreateConfirmationCodeEmailInput = {
  code: string,
  emailType: "signUp" | "forgotPassword" | "resendCode"
}
export function createConfirmationCodeEmail(
  code: CreateConfirmationCodeEmailInput["code"],
  emailType: CreateConfirmationCodeEmailInput["emailType"]
): string {
  let emailMessage = "Let's get started!"
  switch (emailType){
    case "signUp":
      emailMessage = "Let's get started!"
      break;
    case "forgotPassword":
      emailMessage = "Reset your password"
      break;
    case "resendCode":
      emailMessage = "Resend code"
      break;
    default:
      emailMessage = "Let's get started!"
  }
  
  return `<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-content {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 24px 0;
        }
        .content {
            padding: 0 24px 24px;
        }
        .code-container {
            width: 300px;
            margin: 0 auto;
        }
        .footer {
            text-align: center;
            padding: 24px;
            font-size: 14px;
            color: #666;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <table class="email-container" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td>
                <table class="email-content" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td class="header">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">${emailMessage}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <p style="text-align: center; margin: 0 0 16px;">Your confirmation code is below</p>
                            <table class="code-container" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td>
                                        <h1 style="font-size: 48px; color: #000000; text-align: center; margin: 0; font-weight: 600;">
                                            ${code}
                                        </h1>
                                    </td>
                                </tr>
                            </table>
                            <p style="text-align: center; margin: 16px 0 0;">This code will expire in 10 minutes.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <p style="margin: 0;">
                                If you have any questions, please check out the repo <a href="https://github.com/aws-samples/amplify-blog-demo">here</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
