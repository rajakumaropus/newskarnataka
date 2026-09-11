/**
 * Custom React Hooks for API Integration
 * Handles GraphQL queries and common API operations
 */

import { useQuery, useMutation, ApolloError } from '@apollo/client';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

// ===== ARTICLES HOOKS =====

interface ArticleFilters {
  category?: string;
  tag?: string;
  featured?: boolean;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export function useArticles(filters?: ArticleFilters) {
  const [articlesData, setArticlesData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { data, loading, error, refetch } = useQuery(
    require('@/lib/graphql/queries').GET_ARTICLES,
    {
      variables: {
        filters: {
          ...(filters?.category && { category: { name: filters.category } }),
          ...(filters?.tag && { tags: { name: filters.tag } }),
          ...(filters?.featured !== undefined && { is_featured: filters.featured }),
          status: { eq: 'published' }
        },
        pagination: {
          pageSize: filters?.limit || 10,
          start: filters?.offset || 0
        },
        sort: ['publishedAt:desc']
      },
      onCompleted: (data) => {
        setArticlesData(data.articles.data);
        setTotalCount(data.articles.meta.pagination.total);
      }
    }
  );

  return {
    articles: articlesData,
    total: totalCount,
    loading,
    error,
    refetch
  };
}

export function useArticleBySlug(slug: string | string[] | undefined) {
  const [article, setArticle] = useState(null);

  const { data, loading, error } = useQuery(
    require('@/lib/graphql/queries').GET_ARTICLE_BY_SLUG,
    {
      variables: { slug: typeof slug === 'string' ? slug : '' },
      skip: !slug,
      onCompleted: (data) => {
        setArticle(data.articles.data[0] || null);
      }
    }
  );

  return { article, loading, error };
}

export function useFeaturedArticles(limit: number = 3) {
  const { data, loading, error } = useQuery(
    require('@/lib/graphql/queries').GET_FEATURED_ARTICLES,
    {
      variables: { limit }
    }
  );

  return {
    articles: data?.articles?.data || [],
    loading,
    error
  };
}

export function useSearchArticles(searchTerm: string, filters?: ArticleFilters) {
  const [results, setResults] = useState([]);

  const { data, loading, error, refetch } = useQuery(
    require('@/lib/graphql/queries').SEARCH_ARTICLES,
    {
      variables: {
        searchTerm,
        filters: {
          ...(filters?.category && { category: { name: filters.category } })
        },
        pagination: {
          pageSize: filters?.limit || 10,
          start: filters?.offset || 0
        }
      },
      skip: !searchTerm || searchTerm.length < 2,
      onCompleted: (data) => {
        setResults(data.articles.data);
      }
    }
  );

  return {
    results,
    total: data?.articles?.meta?.pagination?.total || 0,
    loading,
    error,
    refetch
  };
}

// ===== ARTICLE SUBMISSION HOOKS (AI Console) =====

export function useArticleSubmissions(filters?: any) {
  const [submissions, setSubmissions] = useState([]);

  const { data, loading, error, refetch } = useQuery(
    require('@/lib/graphql/queries').GET_ARTICLE_SUBMISSIONS,
    {
      variables: {
        filters: filters || {},
        sort: ['createdAt:desc'],
        pagination: { pageSize: 20 }
      },
      onCompleted: (data) => {
        setSubmissions(data.articleSubmissions.data);
      }
    }
  );

  return {
    submissions,
    loading,
    error,
    refetch
  };
}

export function useSubmitArticle() {
  const [submitArticle, { loading }] = useMutation(
    require('@/lib/graphql/mutations').SUBMIT_ARTICLE
  );

  const submit = useCallback(async (articleData: any) => {
    try {
      const { data } = await submitArticle({
        variables: {
          data: {
            article: articleData.articleId,
            source: articleData.sourceId,
            submitted_by: articleData.userId,
            status: 'submitted',
            submitted_at: new Date().toISOString()
          }
        }
      });

      toast.success('✅ Article submitted for validation');
      return data.createArticleSubmission.data;
    } catch (error) {
      const errorMsg = error instanceof ApolloError ? error.message : 'Submission failed';
      toast.error(`❌ ${errorMsg}`);
      throw error;
    }
  }, [submitArticle]);

  return { submit, loading };
}

export function useUpdateSubmissionStatus() {
  const [updateStatus, { loading }] = useMutation(
    require('@/lib/graphql/mutations').UPDATE_SUBMISSION_STATUS
  );

  const update = useCallback(async (submissionId: string, status: string, notes?: string) => {
    try {
      const { data } = await updateStatus({
        variables: { id: submissionId, status, notes }
      });

      toast.success(`✅ Status updated to ${status}`);
      return data.updateArticleSubmission.data;
    } catch (error) {
      toast.error('❌ Failed to update status');
      throw error;
    }
  }, [updateStatus]);

  return { update, loading };
}

export function useApproveSubmission() {
  const [approve, { loading }] = useMutation(
    require('@/lib/graphql/mutations').APPROVE_SUBMISSION
  );

  const approveSubmission = useCallback(async (submissionId: string, approverId: string) => {
    try {
      const { data } = await approve({
        variables: { id: submissionId, approver_id: approverId }
      });

      toast.success('✅ Article approved');
      return data.updateArticleSubmission.data;
    } catch (error) {
      toast.error('❌ Failed to approve');
      throw error;
    }
  }, [approve]);

  return { approveSubmission, loading };
}

export function useRejectSubmission() {
  const [reject, { loading }] = useMutation(
    require('@/lib/graphql/mutations').REJECT_SUBMISSION
  );

  const rejectSubmission = useCallback(
    async (submissionId: string, reason: string, notes?: string) => {
      try {
        const { data } = await reject({
          variables: { id: submissionId, reason, notes }
        });

        toast.success('✅ Submission rejected');
        return data.updateArticleSubmission.data;
      } catch (error) {
        toast.error('❌ Failed to reject');
        throw error;
      }
    },
    [reject]
  );

  return { rejectSubmission, loading };
}

// ===== DASHBOARD HOOKS =====

export function useDashboardStats() {
  const { data, loading, error } = useQuery(
    require('@/lib/graphql/queries').GET_DASHBOARD_STATS
  );

  return {
    stats: {
      total_submissions: data?.articleSubmissions?.meta?.pagination?.total || 0,
      pending_count: data?.pendingSubmissions?.meta?.pagination?.total || 0,
      ready_count: data?.readySubmissions?.meta?.pagination?.total || 0,
      flagged_count: data?.flaggedSubmissions?.meta?.pagination?.total || 0
    },
    loading,
    error
  };
}

// ===== CONTENT QUEUE HOOKS =====

export function useContentQueue() {
  const [queue, setQueue] = useState([]);

  const { data, loading, error, refetch } = useQuery(
    require('@/lib/graphql/queries').GET_CONTENT_QUEUE,
    {
      variables: {
        filters: { removed_at: { isNull: true } }
      },
      onCompleted: (data) => {
        setQueue(data.contentQueues.data);
      }
    }
  );

  return { queue, loading, error, refetch };
}

// ===== AI VALIDATION HOOKS =====

export function useValidationResults() {
  const { data, loading, error } = useQuery(
    require('@/lib/graphql/queries').GET_VALIDATION_RESULTS
  );

  return {
    results: data?.aiValidationResults?.data || [],
    loading,
    error
  };
}

// ===== UTILITY HOOKS =====

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function usePagination(total: number, pageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(total / pageSize);

  const offset = (currentPage - 1) * pageSize;

  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(page, pageCount));
    setCurrentPage(newPage);
  }, [pageCount]);

  return {
    currentPage,
    pageCount,
    offset,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1)
  };
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// ===== ERROR HANDLING =====

export function useApolloError(error: ApolloError | undefined) {
  const [errorMessage, setErrorMessage] = useState<string>('');

  React.useEffect(() => {
    if (error) {
      const message =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.message ||
        error.message ||
        'An error occurred';
      setErrorMessage(message);
    }
  }, [error]);

  return errorMessage;
}

