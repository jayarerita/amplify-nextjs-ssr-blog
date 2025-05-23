import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";
import { demoData } from "../functions/demoData/resource";
import { deleteDemoData } from "../functions/deleteDemoData/resource";
import { preSignUp } from "../auth/pre-signup/resource";
import { createUser } from "../functions/createUser/resource";
const schema = a.schema({

  PostTag: a.model({
    tagId: a.id().required(),
    postId: a.id().required(),
    tag: a.belongsTo('Tag', 'tagId'),
    post: a.belongsTo('Post', 'postId'),
    isDemo: a.boolean(),
  }).authorization(allow => [
    allow.authenticated("identityPool").to(['create', 'read', 'update', 'delete']),
    allow.guest().to(['read']),
  ]).secondaryIndexes((index) => [
    index("tagId"), index("postId"),
  ]),

  Post: a.model({
    slug: a.string().required(),
    title: a.string().required(),
    excerpt: a.string(),
    coverImageKey: a.string(),
    thumbnailImageKey: a.string(),
    published: a.boolean(),
    publishedAt: a.datetime(),
    tags: a.hasMany("PostTag", "postId"),
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
    isDemo: a.boolean(),
  }).authorization(allow => [
    allow.owner().to(['read', 'update', 'delete']),
    allow.authenticated("identityPool").to(['create', 'read']),
    allow.guest().to(['read']),
  ]).secondaryIndexes((index) => [index("slug")]),

  Tag: a.model({
    name: a.string().required(),
    posts: a.hasMany("PostTag", "tagId"),
    isDemo: a.boolean(),
  }).authorization(allow => [
    allow.authenticated("identityPool").to(['create', 'read', 'update', 'delete']),
    allow.guest().to(['read']),
  ]).secondaryIndexes((index) => [index("name")]),

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
    .authorization(allow => [allow.authenticated("identityPool")])
    .handler(a.handler.function(demoData)),

  deleteDemoData: a
    .query()
    .returns(a.json())
    .authorization(allow => [allow.authenticated("identityPool")])
    .handler(a.handler.function(deleteDemoData)),

  createUser: a
    .mutation()
    .arguments({
      username: a.string().required(),
      email: a.string().required(),
      password: a.string().required(),
      displayName: a.string().required(),
      bio: a.string().required(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated("identityPool")])
    .handler(a.handler.function(createUser)),
    
})
.authorization((allow) => [
  allow.resource(postConfirmation),
  allow.resource(demoData),
  allow.resource(deleteDemoData),
  allow.resource(preSignUp),
  allow.resource(createUser)
]);

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
