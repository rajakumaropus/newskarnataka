/**
 * GraphQL Mutations for NewsKarnataka
 * Used by both Next.js frontend and React AI Console
 */

import { gql } from '@apollo/client';

// ===== ARTICLE MUTATIONS =====

export const CREATE_ARTICLE = gql`
  mutation CreateArticle($data: ArticleInput!) {
    createArticle(data: $data) {
      data {
        id
        attributes {
          title
          slug
          description
          content
          status
          createdAt
        }
      }
    }
  }
`;

export const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: ID!, $data: ArticleInput!) {
    updateArticle(id: $id, data: $data) {
      data {
        id
        attributes {
          title
          slug
          status
          updatedAt
        }
      }
    }
  }
`;

export const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: ID!) {
    deleteArticle(id: $id) {
      data {
        id
      }
    }
  }
`;

export const PUBLISH_ARTICLE = gql`
  mutation PublishArticle($id: ID!) {
    updateArticle(id: $id, data: { status: "published" }) {
      data {
        id
        attributes {
          status
          publishedAt
        }
      }
    }
  }
`;

export const INCREMENT_ARTICLE_VIEWS = gql`
  mutation IncrementViews($id: ID!) {
    updateArticle(id: $id, data: { views: 1 }) {
      data {
        id
        attributes {
          views
        }
      }
    }
  }
`;

// ===== ARTICLE SUBMISSION MUTATIONS (AI Console) =====

export const SUBMIT_ARTICLE = gql`
  mutation SubmitArticle($data: ArticleSubmissionInput!) {
    createArticleSubmission(data: $data) {
      data {
        id
        attributes {
          status
          submitted_at
          article {
            data {
              id
              attributes {
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_SUBMISSION_STATUS = gql`
  mutation UpdateSubmissionStatus(
    $id: ID!
    $status: String!
    $notes: String
  ) {
    updateArticleSubmission(
      id: $id
      data: {
        status: $status
        review_comments: $notes
        reviewed_at: "now()"
      }
    ) {
      data {
        id
        attributes {
          status
          reviewed_at
        }
      }
    }
  }
`;

export const APPROVE_SUBMISSION = gql`
  mutation ApproveSubmission($id: ID!, $approver_id: ID!) {
    updateArticleSubmission(
      id: $id
      data: {
        status: "approved"
        approved_by: $approver_id
        approved_at: "now()"
        approved_decision: "manually_approved"
      }
    ) {
      data {
        id
        attributes {
          status
          approved_at
        }
      }
    }
  }
`;

export const REJECT_SUBMISSION = gql`
  mutation RejectSubmission(
    $id: ID!
    $reason: String!
    $notes: String
  ) {
    updateArticleSubmission(
      id: $id
      data: {
        status: "rejected"
        rejection_reason: $reason
        rejection_notes: $notes
      }
    ) {
      data {
        id
        attributes {
          status
          rejection_reason
        }
      }
    }
  }
`;

export const ASSIGN_SUBMISSION = gql`
  mutation AssignSubmission($id: ID!, $assigned_to: ID!) {
    updateArticleSubmission(
      id: $id
      data: {
        assigned_to: $assigned_to
        assigned_at: "now()"
      }
    ) {
      data {
        id
        attributes {
          assigned_to {
            data {
              attributes {
                name
              }
            }
          }
          assigned_at
        }
      }
    }
  }
`;

// ===== AI VALIDATION MUTATIONS =====

export const CREATE_VALIDATION_RESULT = gql`
  mutation CreateValidationResult($data: AiValidationResultInput!) {
    createAiValidationResult(data: $data) {
      data {
        id
        attributes {
          model
          quality_score
          credibility_score
          priority
          confidence
          created_at
        }
      }
    }
  }
`;

export const UPDATE_VALIDATION_RESULT = gql`
  mutation UpdateValidationResult($id: ID!, $data: AiValidationResultInput!) {
    updateAiValidationResult(id: $id, data: $data) {
      data {
        id
        attributes {
          human_override
          override_reason
          updated_at
        }
      }
    }
  }
`;

// ===== WORKFLOW HISTORY MUTATIONS =====

export const LOG_WORKFLOW_EVENT = gql`
  mutation LogWorkflowEvent($data: SubmissionWorkflowHistoryInput!) {
    createSubmissionWorkflowHistory(data: $data) {
      data {
        id
        attributes {
          event_type
          previous_status
          new_status
          notes
          created_at
        }
      }
    }
  }
`;

// ===== CONTENT QUEUE MUTATIONS =====

export const UPDATE_QUEUE_PRIORITY = gql`
  mutation UpdateQueuePriority($id: ID!, $priority: String!) {
    updateContentQueue(id: $id, data: { priority: $priority }) {
      data {
        id
        attributes {
          priority
        }
      }
    }
  }
`;

export const PIN_QUEUE_ITEM = gql`
  mutation PinQueueItem($id: ID!, $pinned: Boolean!) {
    updateContentQueue(id: $id, data: { pinned: $pinned }) {
      data {
        id
        attributes {
          pinned
        }
      }
    }
  }
`;

export const REMOVE_FROM_QUEUE = gql`
  mutation RemoveFromQueue($id: ID!, $reason: String!) {
    updateContentQueue(
      id: $id
      data: {
        removed_at: "now()"
        removal_reason: $reason
      }
    ) {
      data {
        id
        attributes {
          removed_at
        }
      }
    }
  }
`;

// ===== EDITOR ACTIONS MUTATIONS =====

export const LOG_EDITOR_ACTION = gql`
  mutation LogEditorAction($data: EditorActionInput!) {
    createEditorAction(data: $data) {
      data {
        id
        attributes {
          action_type
          created_at
        }
      }
    }
  }
`;

// ===== LIKE/COMMENT MUTATIONS =====

export const LIKE_ARTICLE = gql`
  mutation LikeArticle($id: ID!) {
    updateArticle(id: $id, data: { likes: 1 }) {
      data {
        id
        attributes {
          likes
        }
      }
    }
  }
`;

// ===== AUTHENTICATION MUTATIONS =====

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(input: { identifier: $email, password: $password }) {
      jwt
      user {
        id
        username
        email
        role {
          name
        }
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
        attributes {
          username
          email
          firstname
          lastname
        }
      }
    }
  }
`;

// ===== BATCH OPERATIONS =====

export const BULK_UPDATE_SUBMISSIONS = gql`
  mutation BulkUpdateSubmissions($ids: [ID!]!, $status: String!) {
    updateArticleSubmissions(data: { status: $status }, where: { id: { in: $ids } }) {
      data {
        id
        attributes {
          status
        }
      }
    }
  }
`;

