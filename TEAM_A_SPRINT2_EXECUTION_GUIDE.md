# 🎯 TEAM A SPRINT 2 - FRONTEND EXECUTION GUIDE
## Redux Integration & API Connection

**Sprint:** 2 (Sept 8-12, 2026)  
**Team Size:** 3 developers  
**Focus:** State management, API integration, authentication  
**Status:** Ready for Launch 🚀

---

## 🎯 SPRINT 2 GOALS

✅ Implement Redux state management  
✅ Create API service layer  
✅ Build authentication pages  
✅ Create article management UI  
✅ Maintain 80%+ test coverage  
✅ Deploy to staging environment  

---

## 📋 DAILY BREAKDOWN

### MONDAY - REDUX SETUP

#### 9:00 AM - 10:00 AM: Planning & Kickoff
- Review Sprint 1 completion
- Confirm Sprint 2 objectives
- Discuss Redux architecture
- Assign developer roles

#### 10:00 AM - 12:30 PM: Redux Installation & Setup
**Task:** Install Redux packages and configure store

```bash
cd newskarnataka-frontend
npm install redux react-redux redux-thunk redux-devtools-extension
npm install --save-dev @types/react-redux @types/redux-mock-store
```

**Create Redux Structure:**

**File: `src/store/types.ts`**
```typescript
// Root state type
export interface RootState {
  auth: AuthState;
  articles: ArticlesState;
  ui: UIState;
}

// Auth state
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

// Articles state
export interface ArticlesState {
  articles: Article[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  filters: ArticleFilters;
  pagination: Pagination;
}

// UI state
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

// Supporting types
export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  status: ArticleStatus;
  author: User;
  createdAt: Date;
}

export interface ArticleFilters {
  search: string;
  category: string | null;
  status: ArticleStatus | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  REVIEWER = 'reviewer',
  AUTHOR = 'author',
  VIEWER = 'viewer',
}

export enum ArticleStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  AI_VALIDATING = 'ai_validating',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
}
```

**File: `src/store/actions/authActions.ts`**
```typescript
import { createAction } from '@reduxjs/toolkit';

// Login actions
export const loginRequest = createAction('auth/loginRequest');
export const loginSuccess = createAction<{ user: User; token: string }>('auth/loginSuccess');
export const loginFailure = createAction<string>('auth/loginFailure');

// Register actions
export const registerRequest = createAction('auth/registerRequest');
export const registerSuccess = createAction<{ user: User; token: string }>('auth/registerSuccess');
export const registerFailure = createAction<string>('auth/registerFailure');

// Logout
export const logout = createAction('auth/logout');

// Refresh token
export const refreshTokenRequest = createAction('auth/refreshTokenRequest');
export const refreshTokenSuccess = createAction<string>('auth/refreshTokenSuccess');
export const refreshTokenFailure = createAction<string>('auth/refreshTokenFailure');
```

**File: `src/store/actions/articleActions.ts`**
```typescript
import { createAction } from '@reduxjs/toolkit';

// Fetch articles
export const fetchArticlesRequest = createAction('articles/fetchRequest');
export const fetchArticlesSuccess = createAction<{ articles: Article[]; total: number }>('articles/fetchSuccess');
export const fetchArticlesFailure = createAction<string>('articles/fetchFailure');

// Fetch single article
export const fetchArticleRequest = createAction('articles/fetchSingleRequest');
export const fetchArticleSuccess = createAction<Article>('articles/fetchSingleSuccess');
export const fetchArticleFailure = createAction<string>('articles/fetchSingleFailure');

// Create article
export const createArticleRequest = createAction('articles/createRequest');
export const createArticleSuccess = createAction<Article>('articles/createSuccess');
export const createArticleFailure = createAction<string>('articles/createFailure');

// Update article
export const updateArticleRequest = createAction('articles/updateRequest');
export const updateArticleSuccess = createAction<Article>('articles/updateSuccess');
export const updateArticleFailure = createAction<string>('articles/updateFailure');

// Delete article
export const deleteArticleRequest = createAction('articles/deleteRequest');
export const deleteArticleSuccess = createAction<string>('articles/deleteSuccess');
export const deleteArticleFailure = createAction<string>('articles/deleteFailure');

// Set filters
export const setFilters = createAction<ArticleFilters>('articles/setFilters');

// Set pagination
export const setPagination = createAction<Pagination>('articles/setPagination');
```

**File: `src/store/reducers/authReducer.ts`**
```typescript
import { createReducer } from '@reduxjs/toolkit';
import * as actions from '../actions/authActions';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  token: null,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    // Login
    .addCase(actions.loginRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.loginSuccess, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(actions.loginFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    // Register
    .addCase(actions.registerRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(actions.registerSuccess, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    })
    .addCase(actions.registerFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    // Logout
    .addCase(actions.logout, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    })
    // Refresh token
    .addCase(actions.refreshTokenSuccess, (state, action) => {
      state.token = action.payload;
    })
    .addCase(actions.refreshTokenFailure, (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
    });
});
```

**File: `src/store/reducers/index.ts`**
```typescript
import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { articlesReducer } from './articlesReducer';
import { uiReducer } from './uiReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  articles: articlesReducer,
  ui: uiReducer,
});
```

**File: `src/store/index.ts`**
```typescript
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducers';

const middleware = [thunk];

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(...middleware))
    : applyMiddleware(...middleware)
);

export default store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
```

**File: `src/App.tsx` - Update to include Provider**
```typescript
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* App routes and components */}
      </BrowserRouter>
    </Provider>
  );
}
```

#### 12:30 PM - 1:00 PM: Lunch

#### 1:00 PM - 3:00 PM: Connect Components to Redux
**Task:** Add Redux integration to 4 existing components

**Components to connect:**
1. Button (add Redux dispatch)
2. Input (add Redux state binding)
3. Card (add Redux data)
4. Modal (add Redux visibility)

**Example: Button.tsx with Redux**
```typescript
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  reduxAction?: (dispatch: AppDispatch) => void;
}

export default function Button({ label, variant = 'primary', reduxAction, ...props }: ButtonProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    if (reduxAction) {
      reduxAction(dispatch);
    } else if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <button
      className={`button button-${variant}`}
      onClick={handleClick}
      {...props}
    >
      {label}
    </button>
  );
}
```

#### 3:00 PM - 3:15 PM: Daily Standup

#### 3:15 PM - 5:00 PM: Testing & Documentation
- Write Redux tests
- Document Redux flow
- Create Redux usage guide
- Verify all components working

**Tests:**
```typescript
// src/store/__tests__/authReducer.test.ts
import { authReducer } from '../reducers/authReducer';
import * as actions from '../actions/authActions';

describe('Auth Reducer', () => {
  it('should handle loginRequest', () => {
    const newState = authReducer(initialState, actions.loginRequest());
    expect(newState.loading).toBe(true);
  });

  it('should handle loginSuccess', () => {
    const payload = { user: mockUser, token: 'token' };
    const newState = authReducer(initialState, actions.loginSuccess(payload));
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toEqual(mockUser);
  });
});
```

---

### TUESDAY - API SERVICE LAYER

#### Morning: Create API Client & Services

**File: `src/services/api/client.ts`**
```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:1337/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          return this.refreshTokenAndRetry(error.config!);
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshTokenAndRetry(config: any) {
    // Implement token refresh logic
    return this.client(config);
  }

  get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

export default new ApiClient();
```

**File: `src/services/api/articles.ts`**
```typescript
import apiClient from './client';

export const articleService = {
  // Fetch articles with filtering and pagination
  fetchArticles: (filters?: any, pagination?: any) =>
    apiClient.get('/articles', { params: { ...filters, ...pagination } }),

  // Fetch single article
  fetchArticle: (id: string) =>
    apiClient.get(`/articles/${id}`),

  // Create article
  createArticle: (data: any) =>
    apiClient.post('/articles', data),

  // Update article
  updateArticle: (id: string, data: any) =>
    apiClient.put(`/articles/${id}`, data),

  // Delete article
  deleteArticle: (id: string) =>
    apiClient.delete(`/articles/${id}`),

  // Approve article
  approveArticle: (id: string) =>
    apiClient.post(`/articles/${id}/approve`, {}),

  // Reject article
  rejectArticle: (id: string, reason: string) =>
    apiClient.post(`/articles/${id}/reject`, { reason }),

  // Get comments
  getComments: (articleId: string) =>
    apiClient.get(`/articles/${articleId}/comments`),
};
```

**File: `src/services/api/auth.ts`**
```typescript
import apiClient from './client';

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData: any) =>
    apiClient.post('/auth/register', userData),

  logout: () =>
    apiClient.post('/auth/logout', {}),

  refreshToken: () =>
    apiClient.post('/auth/refresh', {}),

  getCurrentUser: () =>
    apiClient.get('/auth/me'),
};
```

#### Afternoon: Create Custom Hooks

**File: `src/hooks/useApi.ts`**
```typescript
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

export function useApi<T>(
  apiCall: () => Promise<any>
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await apiCall();
      setState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as AxiosError });
    }
  }, [apiCall]);

  return { ...state, refetch };
}

export function useArticles() {
  return useApi(() => articleService.fetchArticles());
}

export function useArticle(id: string) {
  return useApi(() => articleService.fetchArticle(id));
}
```

#### Evening: Testing

- Test API client
- Test service methods
- Test hooks
- Create mock API responses

**Acceptance Criteria:**
- [ ] API client created
- [ ] All services functional
- [ ] Hooks working with components
- [ ] 80%+ test coverage
- [ ] Mock API endpoints ready

---

### WEDNESDAY - AUTHENTICATION PAGES

**Files to create:**

1. `src/pages/auth/LoginPage.tsx`
2. `src/pages/auth/RegisterPage.tsx`
3. `src/pages/auth/ForgotPasswordPage.tsx`
4. `src/pages/auth/ResetPasswordPage.tsx`
5. `src/hooks/useAuth.ts`
6. `src/components/Auth/LoginForm.tsx`
7. `src/components/Auth/RegisterForm.tsx`

**Key Features:**
- Form validation
- Error handling
- Loading states
- JWT token management
- Session persistence
- Protected routes

---

### THURSDAY - ARTICLE MANAGEMENT UI

**Pages to create:**

1. **ArticleListPage.tsx**
   - List articles with filtering
   - Pagination
   - Search functionality
   - Status badges

2. **ArticleDetailPage.tsx**
   - Display article content
   - Show author info
   - Display comments
   - Approval workflow info

3. **ArticleEditorPage.tsx**
   - Rich text editor
   - Article form
   - Save/publish options
   - Preview mode

4. **ApprovalWorkflowPage.tsx**
   - Show pending articles
   - Reviewer interface
   - Approval/rejection workflow

---

### FRIDAY - INTEGRATION & TESTING

**Tasks:**
- End-to-end testing
- Performance optimization
- Staging deployment
- Final verification
- Documentation review

**Acceptance Criteria:**
- [ ] All 20+ components integrated
- [ ] API integration verified
- [ ] 80%+ test coverage
- [ ] Performance <3s load time
- [ ] No console errors
- [ ] Deployed to staging

---

## 📊 DEVELOPER ROLES (Sprint 2)

| Developer | Role | Tasks |
|-----------|------|-------|
| Dev A | Redux Specialist | Redux setup, state management |
| Dev B | API Specialist | API client, service layer, hooks |
| Dev C | UI Specialist | Auth pages, article pages, forms |

---

## 🎨 Component Integration Order

1. **Week 1:** Button, Input, Card, Modal
2. **Week 1:** Form, FormField, Select, Checkbox
3. **Week 2:** Table, Dropdown, Alert, Badge
4. **Week 2:** Nav, Breadcrumb, Pagination, Tooltip

---

## ✅ SUCCESS METRICS

- [ ] Test coverage: 80%+
- [ ] All Redux actions working
- [ ] All API services functional
- [ ] Auth pages fully functional
- [ ] Article pages functional
- [ ] Staging deployment successful

---

## 🚀 SPRINT 2 TEAM A - READY TO LAUNCH!

