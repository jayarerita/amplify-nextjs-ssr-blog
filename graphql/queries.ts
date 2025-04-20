export const listBlogPosts = /* GraphQL */ `
  query ListBlogPosts($filter: ModelBlogPostFilterInput) {
    listBlogPosts(filter: $filter) {
      items {
        id
        title
        excerpt
        coverImage
        publishedAt
        slug
        author {
          displayName
          avatar
        }
      }
    }
  }
`;

export const getBlogPost = /* GraphQL */ `
  query GetBlogPost($slug: String!) {
    getBlogPost(slug: $slug) {
      id
      title
      content
      excerpt
      coverImage
      publishedAt
      tags
      author {
        displayName
        avatar
        bio
      }
    }
  }
`; 