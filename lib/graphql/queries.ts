/**
 * GraphQL Queries for NewsKarnataka
 * Used by both Next.js frontend and React AI Console
 */

import { gql } from '@apollo/client';

// ===== ARTICLES =====

export const GET_ARTICLES = gql`
  query GetArticles(
    $filters: ArticleFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    articles(filters: $filters, pagination: $pagination, sort: $sort) {
      data {
        id
        attributes {
          title
          slug
          description
          content
          is_featured
          status
          views
          likes
          publishedAt
          createdAt
          updatedAt
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          tags {
            data {
              id
              attributes {
                name
              }
            }
          }
          author {
            data {
              id
              attributes {
                name
                email
              }
            }
          }
          featured_image {
            data {
              attributes {
                url
                width
                height
              }
            }
          }
        }
      }
      meta {
        pagination {
          start
          limit
          total
          pageCount
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: String!) {
    articles(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          title
          slug
          description
          content
          views
          likes
          is_featured
          publishedAt
          createdAt
          status
          category {
            data {
              id
              attributes {
                name
              }
            }
          }
          tags {
            data {
              id
              attributes {
                name
              }
            }
          }
          author {
            data {
              id
              attributes {
                name
                email
                role
              }
            }
          }
          featured_image {
            data {
              attributes {
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_FEATURED_ARTICLES = gql`
  query GetFeaturedArticles($limit: Int = 3) {
    articles(
      filters: { is_featured: { eq: true }, status: { eq: "published" } }
      pagination: { limit: $limit }
      sort: ["publishedAt:desc"]
    ) {
      data {
        id
        attributes {
          title
          slug
          description
          publishedAt
          category {
            data {
              attributes {
                name
              }
            }
          }
          featured_image {
            data {
              attributes {
                url
              }
            }
          }
          author {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

// ===== CATEGORIES =====

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      data {
        id
        attributes {
          name
          description
          articles {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

// ===== TAGS =====

export const GET_TAGS = gql`
  query GetTags {
    tags {
      data {
        id
        attributes {
          name
          articles {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

// ===== AUTHORS =====

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      data {
        id
        attributes {
          name
          email
          role
          articles {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

// ===== ARTICLE SOURCES (AI Console) =====

export const GET_ARTICLE_SOURCES = gql`
  query GetArticleSources($pagination: PaginationArg) {
    articleSources(pagination: $pagination) {
      data {
        id
        attributes {
          name
          code
          source_type
          description
          trust_score
          is_active
          daily_submission_limit
          total_articles_submitted
          total_articles_published
          createdAt
        }
      }
      meta {
        pagination {
          total
          pageCount
        }
      }
    }
  }
`;

// ===== ARTICLE SUBMISSIONS (AI Console) =====

export const GET_ARTICLE_SUBMISSIONS = gql`
  query GetArticleSubmissions(
    $filters: ArticleSubmissionFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    articleSubmissions(filters: $filters, pagination: $pagination, sort: $sort) {
      data {
        id
        attributes {
          status
          ai_validation_status
          ai_validation_result
          ai_confidence_score
          article {
            data {
              id
              attributes {
                title
                slug
              }
            }
          }
          source {
            data {
              attributes {
                name
                code
              }
            }
          }
          submitted_by {
            data {
              attributes {
                email
              }
            }
          }
          assigned_to {
            data {
              attributes {
                email
              }
            }
          }
          submitted_at
          ai_validation_at
          createdAt
        }
      }
      meta {
        pagination {
          total
          pageCount
        }
      }
    }
  }
`;

export const GET_SUBMISSION_BY_ID = gql`
  query GetSubmissionById($id: ID!) {
    articleSubmission(id: $id) {
      data {
        id
        attributes {
          status
          ai_validation_result
          ai_confidence_score
          ai_validation_notes
          article {
            data {
              id
              attributes {
                title
                content
                category {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
          source {
            data {
              attributes {
                name
              }
            }
          }
          submitted_by {
            data {
              attributes {
                name
                email
              }
            }
          }
          review_comments
          createdAt
        }
      }
    }
  }
`;

// ===== AI VALIDATION RESULTS (AI Console) =====

export const GET_VALIDATION_RESULTS = gql`
  query GetValidationResults($filters: AiValidationResultFiltersInput) {
    aiValidationResults(filters: $filters) {
      data {
        id
        attributes {
          model
          task_type
          quality_score
          credibility_score
          priority
          confidence
          reasoning
          article {
            data {
              attributes {
                title
              }
            }
          }
          created_at
        }
      }
    }
  }
`;

// ===== CONTENT QUEUE (AI Console) =====

export const GET_CONTENT_QUEUE = gql`
  query GetContentQueue($filters: ContentQueueFiltersInput) {
    contentQueues(filters: $filters, sort: ["priority:asc", "createdAt:desc"]) {
      data {
        id
        attributes {
          priority
          pinned
          action_needed
          action_deadline
          submission {
            data {
              id
              attributes {
                status
                article {
                  data {
                    attributes {
                      title
                      slug
                    }
                  }
                }
              }
            }
          }
          assigned_to {
            data {
              attributes {
                name
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;

// ===== DASHBOARD STATS (AI Console) =====

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    articleSubmissions(pagination: { limit: 1 }) {
      meta {
        pagination {
          total
        }
      }
    }
    pendingSubmissions: articleSubmissions(
      filters: { status: { eq: "pending_approval" } }
      pagination: { limit: 1 }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
    readySubmissions: articleSubmissions(
      filters: { status: { eq: "approved" } }
      pagination: { limit: 1 }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
    flaggedSubmissions: articleSubmissions(
      filters: { status: { eq: "flagged" } }
      pagination: { limit: 1 }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

// ===== SEARCH FUNCTIONALITY =====

export const SEARCH_ARTICLES = gql`
  query SearchArticles(
    $searchTerm: String!
    $filters: ArticleFiltersInput
    $pagination: PaginationArg
  ) {
    articles(
      filters: {
        and: [
          {
            or: [
              { title: { containsi: $searchTerm } }
              { description: { containsi: $searchTerm } }
              { content: { containsi: $searchTerm } }
            ]
          }
          $filters
        ]
      }
      pagination: $pagination
    ) {
      data {
        id
        attributes {
          title
          slug
          description
          publishedAt
          category {
            data {
              attributes {
                name
              }
            }
          }
          featured_image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
`;

// ===== USER PROFILE =====

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          username
          email
          firstname
          lastname
          role {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

