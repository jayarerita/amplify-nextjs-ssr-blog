/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBlogPost = /* GraphQL */ `
  subscription OnCreateBlogPost(
    $filter: ModelSubscriptionBlogPostFilterInput
    $owner: String
  ) {
    onCreateBlogPost(filter: $filter, owner: $owner) {
      author {
        avatar
        bio
        createdAt
        displayName
        email
        id
        owner
        profileOwner
        role
        updatedAt
        username
        __typename
      }
      authorId
      coverImage
      createdAt
      excerpt
      owner
      publishedAt
      slug
      status
      tags
      title
      updatedAt
      __typename
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onCreateUserProfile(filter: $filter, owner: $owner) {
      avatar
      bio
      createdAt
      displayName
      email
      id
      owner
      posts {
        nextToken
        __typename
      }
      profileOwner
      role
      updatedAt
      username
      __typename
    }
  }
`;
export const onDeleteBlogPost = /* GraphQL */ `
  subscription OnDeleteBlogPost(
    $filter: ModelSubscriptionBlogPostFilterInput
    $owner: String
  ) {
    onDeleteBlogPost(filter: $filter, owner: $owner) {
      author {
        avatar
        bio
        createdAt
        displayName
        email
        id
        owner
        profileOwner
        role
        updatedAt
        username
        __typename
      }
      authorId
      coverImage
      createdAt
      excerpt
      owner
      publishedAt
      slug
      status
      tags
      title
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onDeleteUserProfile(filter: $filter, owner: $owner) {
      avatar
      bio
      createdAt
      displayName
      email
      id
      owner
      posts {
        nextToken
        __typename
      }
      profileOwner
      role
      updatedAt
      username
      __typename
    }
  }
`;
export const onUpdateBlogPost = /* GraphQL */ `
  subscription OnUpdateBlogPost(
    $filter: ModelSubscriptionBlogPostFilterInput
    $owner: String
  ) {
    onUpdateBlogPost(filter: $filter, owner: $owner) {
      author {
        avatar
        bio
        createdAt
        displayName
        email
        id
        owner
        profileOwner
        role
        updatedAt
        username
        __typename
      }
      authorId
      coverImage
      createdAt
      excerpt
      owner
      publishedAt
      slug
      status
      tags
      title
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onUpdateUserProfile(filter: $filter, owner: $owner) {
      avatar
      bio
      createdAt
      displayName
      email
      id
      owner
      posts {
        nextToken
        __typename
      }
      profileOwner
      role
      updatedAt
      username
      __typename
    }
  }
`;
