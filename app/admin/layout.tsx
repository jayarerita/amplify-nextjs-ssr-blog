"use client";

import "@aws-amplify/ui-react/styles.css";
import { Authenticator, ThemeProvider, Theme } from "@aws-amplify/ui-react";
import { useGetUserProfilesInfinite } from "@/lib/hooks/use-get-user-profiles";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/ui/alert";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if any users exist in the database
  const {
    data: userProfiles,
    isLoading,
    error,
  } = useGetUserProfilesInfinite("identityPool");
  console.log("userProfiles", userProfiles);

  // Custom theme for Authenticator to match shadcn theme
  const theme: Theme = {
    name: "Shadcn Theme",
    tokens: {
      components: {
        authenticator: {
          router: {
            borderWidth: "0",
            borderStyle: "none",
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
        button: {
          primary: {
            borderStyle: "none",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            _hover: {
              backgroundColor: "var(--primary)",
            },
            _focus: {
              backgroundColor: "var(--primary)",
            },
          },
        },
        fieldcontrol: {
          borderColor: "var(--border)",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "var(--radius)",
          color: "var(--foreground)",
          _focus: {
            borderColor: "var(--ring)",
            boxShadow: "0 0 0 1px var(--ring)",
          },
        },
        field: {
          label: {
            color: "var(--foreground)",
          },
        },
      },
    },
  };

  if (isLoading || userProfiles === undefined) {
    return (
      <Skeleton className="rounded-lg w-full md:w-[29rem] aspect-square m-4 mx-auto" />
    );
  }
  if (error) {
    return <Alert variant="destructive">{error.message}</Alert>;
  }

  return (
    <div className="min-h-screen">
      <style jsx global>{`
        /* CSS variables specific to authenticator in this layout */

        .amplify-button {
          cursor: pointer;
        }

        .amplify-button.amplify-button--link.amplify-button--small:hover {
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

        .amplify-field__show-password:focus {
          background-color: var(--secondary);
          border-color: var(--border);
          color: var(--secondary-foreground);
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

        .amplify-alert {
          border-radius: var(--radius);
          background-color: var(--secondary);
          color: var(--secondary-foreground);
        }

        .amplify-alert--error {
          border-radius: var(--radius);
          color: var(--destructive);
          border: 1px solid var(--destructive);
          background-color: color-mix(in srgb, var(--destructive) 10%, transparent);
        }

        .amplify-alert__icon {
          color: var(--destructive);
        }

        .amplify-alert__dismiss:hover {
          background-color: var(--destructive);
          border-radius: var(--radius);
          border: 1px solid var(--destructive);
        }
      `}</style>
      <ThemeProvider theme={theme}>
        {userProfiles.pages[0].data.length !== 0 ? (
            <Authenticator hideSignUp={true}>{children}</Authenticator>
          ) : (
            <Authenticator initialState="signUp">{children}</Authenticator>
          )}
      </ThemeProvider>
    </div>
  );
}
