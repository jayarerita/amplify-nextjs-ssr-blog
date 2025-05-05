'use client';

import '@aws-amplify/ui-react/styles.css';
import { Authenticator, ThemeProvider, Theme } from '@aws-amplify/ui-react';
import { useGetUserProfilesInfinite } from '@/lib/hooks/use-get-user-profiles';
import { Card } from '@/components/ui/card';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if any users exist in the database
  const { data: userProfiles, isLoading, error } = useGetUserProfilesInfinite("userPool");
  
  // Custom theme for Authenticator to match shadcn theme
  const theme: Theme = {
    name: 'Shadcn Theme',
    tokens: {
      components: {
        authenticator: {
          router: {
            borderWidth: '0',
            borderStyle: 'none',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
        button: {
          primary: {
            borderStyle: 'none',
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            _hover: {
              backgroundColor: 'var(--primary)',
            },
            _focus: {
              backgroundColor: 'var(--primary)',
            },
          },
        },
        fieldcontrol: {
          borderColor: 'var(--border)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: 'var(--radius)',
          color: 'var(--foreground)',
          _focus: {
            borderColor: 'var(--ring)',
            boxShadow: '0 0 0 1px var(--ring)',
          },
        },
        field: {
          label: {
            color: 'var(--foreground)',
          },
        },
      },
    },
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="min-h-screen">
      <style jsx global>{`
        /* CSS variables specific to authenticator in this layout */

        .amplify-button {
          cursor: pointer;
        }

        .amplify-button.amplify-button--link.amplify-button--small:hover{
          background-color: var(--primary);
          color: var(--primary-foreground);
          opacity: 0.5;
        }

        .amplify-button.amplify-button--primary:focus {
          background-color: var(--primary);
          opacity: 0.8;
          color: var(--primary-foreground);
          focus-ring: 0 0 0 2px var(--ring);
        }

        .amplify-button.amplify-button--primary:hover {
          background-color: var(--primary);
          opacity: 0.8;
          color: var(--primary-foreground);
        }

      .amplify-button--link {
        color: var(--primary);
      }
                .amplify-field__show-password {
          border-color: var(--border);
          color: var(--primary);
        }

        .amplify-field__show-password:hover {
          background-color: var(--primary);
          border-color: var(--border);
          color: var(--primary-foreground);
        }

      .amplify-tabs {
        box-shadow: none;
      }
        .amplify-tabs__list {
          gap: 1rem;
          border: none;
        }
        .amplify-tabs__item {
          border-radius: var(--radius);
          border: 1px solid var(--border);
          color: var(--primary);
        }

        .amplify-tabs__item:hover {
          background-color: var(--secondary);
          color: var(--secondary-foreground);
        }
        .amplify-tabs__item--active {
          border: none;
          background-color: var(--primary);
          color: var(--primary-foreground);
        }
                .amplify-tabs__item:focus {
          border: 1px solid var(--primary);
        }
          .amplify-heading {
            color: var(--foreground);
          }

        [data-amplify-container] {
          padding: 1rem;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
          margin: 1rem;
          border-radius: var(--radius);
        }

      `}</style>
        <ThemeProvider theme={theme}>
          <Authenticator hideSignUp={userProfiles?.pages[0].data.length !== 0}>
            {children}
          </Authenticator>
        </ThemeProvider>
    </div>
  );
} 