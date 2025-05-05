import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import { demoData } from "../functions/demoData/resource";
import { deleteDemoData } from "../functions/deleteDemoData/resource";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  BlogPost: a.model({
    slug: a.string().required(),
    title: a.string().required(),
    excerpt: a.string(),
    coverImageKey: a.string(),
    thumbnailImageKey: a.string(),
    published: a.boolean(),
    publishedAt: a.datetime(),
    tags: a.string().array(),
    owner: a.string().required(),
    markdownKey: a.string(),
    coverImageAlt: a.string(),
    metaTitle: a.string(),
    metaDescription: a.string(),
    canonicalUrl: a.string(),
    ogImage: a.string(),
    ogImageAlt: a.string(),
    noIndex: a.boolean(),
    structuredData: a.json(),
    readingTime: a.integer(),
    language: a.string(),
  }).authorization(allow => [
    allow.owner().to(['read', 'update', 'delete']),
    allow.authenticated("identityPool").to(['create', 'read']),
    allow.guest().to(['read']),
  ]).identifier(['slug']),

  UserProfile: a.model({
    id: a.id().required(),
    username: a.string().required(),
    displayName: a.string().required(),
    bio: a.string(),
    avatar: a.string(),
    email: a.string().required(),
    role: a.enum(["user", "admin"]),
    profileOwner: a.string().required()
  }).authorization(allow => [
    allow.owner().to(['read', 'update']),
    allow.authenticated("identityPool").to(['read']),
    allow.guest().to(['read']),
  ]),

  demoData: a
    .query()
    .arguments({
      count: a.integer(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(demoData)),

  deleteDemoData: a
    .query()
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function(deleteDemoData))
})
.authorization((allow) => [allow.resource(postConfirmation), allow.resource(demoData), allow.resource(deleteDemoData)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "identityPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
