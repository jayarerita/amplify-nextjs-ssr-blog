/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBlogPost = /* GraphQL */ `
  mutation CreateBlogPost(
    $condition: ModelBlogPostConditionInput
    $input: CreateBlogPostInput!
  ) {
    createBlogPost(condition: $condition, input: $input) {
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
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: CreateUserProfileInput!
  ) {
    createUserProfile(condition: $condition, input: $input) {
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
export const deleteBlogPost = /* GraphQL */ `
  mutation DeleteBlogPost(
    $condition: ModelBlogPostConditionInput
    $input: DeleteBlogPostInput!
  ) {
    deleteBlogPost(condition: $condition, input: $input) {
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
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: DeleteUserProfileInput!
  ) {
    deleteUserProfile(condition: $condition, input: $input) {
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
export const updateBlogPost = /* GraphQL */ `
  mutation UpdateBlogPost(
    $condition: ModelBlogPostConditionInput
    $input: UpdateBlogPostInput!
  ) {
    updateBlogPost(condition: $condition, input: $input) {
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
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: UpdateUserProfileInput!
  ) {
    updateUserProfile(condition: $condition, input: $input) {
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
