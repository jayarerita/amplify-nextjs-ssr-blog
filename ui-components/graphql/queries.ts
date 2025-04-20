/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBlogPost = /* GraphQL */ `
  query GetBlogPost($slug: String!) {
    getBlogPost(slug: $slug) {
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
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
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
export const listBlogPosts = /* GraphQL */ `
  query ListBlogPosts(
    $filter: ModelBlogPostFilterInput
    $limit: Int
    $nextToken: String
    $slug: String
    $sortDirection: ModelSortDirection
  ) {
    listBlogPosts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      slug: $slug
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $id: ID
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserProfiles(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
