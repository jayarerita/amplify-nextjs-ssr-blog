'use client'

import { Amplify } from 'aws-amplify';
import outputs from "@/amplify_outputs.json";
import { ReactNode, useEffect } from 'react';
import { CookieStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

Amplify.configure(outputs);
cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

export function AmplifyProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    Amplify.configure(outputs);
  }, []);

  return <>{children}</>;
}