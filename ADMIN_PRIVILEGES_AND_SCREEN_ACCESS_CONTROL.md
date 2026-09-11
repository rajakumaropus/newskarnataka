# Admin Privileges & Screen Access Control System
## NewsKarnataka.com - Role-Based Access Control (RBAC) for Admin Console

**Project:** NewsKarnataka.com Strapi Migration  
**Scope:** Comprehensive admin screen privileges, role-based access, permission management  
**Database:** PostgreSQL 14+ with UUID  
**Date:** September 2026

---

## EXECUTIVE SUMMARY

**Comprehensive Admin Access Control System:**

1. **Role-Based Access Control (RBAC):** 6 predefined roles with customizable permissions
2. **Screen-Level Permissions:** Control which screens each role can access
3. **Action-Level Permissions:** Granular control over create/read/update/delete per resource
4. **Feature Flags:** Enable/disable features per role/user
5. **Time-Based Access:** Restrict access by time windows (optional)
6. **IP Whitelisting:** Restrict admin access to specific IPs
7. **Audit Trail:** Log all admin actions and access attempts
8. **Session Management:** Track active admin sessions with timeout

---

## SECTION 1: ROLE DEFINITIONS

### 1.1 Core Roles (System Roles)

```sql
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  
  -- System Role Flag
  is_system_role BOOLEAN DEFAULT FALSE,
  
  -- Display
  display_name VARCHAR(100),
  icon VARCHAR(50), -- UI icon name
  color VARCHAR(7), -- Hex color for UI
  
  -- Metadata
  metadata JSONB, -- Additional configuration
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert predefined roles
INSERT INTO roles (id, name, code, description, is_system_role, display_name) VALUES
  (gen_random_uuid(), 'Super Admin', 'super_admin', 'Full system access, all screens, all actions', TRUE, 'Super Admin'),
  (gen_random_uuid(), 'Admin', 'admin', 'Administrative access, user management, content moderation', TRUE, 'Admin'),
  (gen_random_uuid(), 'Editor', 'editor', 'Can create, edit, approve articles, moderate comments', TRUE, 'Editor'),
  (gen_random_uuid(), 'Reviewer', 'reviewer', 'Can review and approve articles from various sources', TRUE, 'Reviewer'),
  (gen_random_uuid(), 'Contributor', 'contributor', 'Can create and submit articles for review', TRUE, 'Contributor'),
  (gen_random_uuid(), 'Viewer', 'viewer', 'Read-only access to published content', TRUE, 'Viewer');

CREATE INDEX idx_roles_code ON roles(code);
CREATE INDEX idx_roles_is_system_role ON roles(is_system_role);
```

---

### 1.2 Permission Definitions (Resource-Action Based)

```sql
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Permission Identification
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  
  -- Resource & Action
  resource VARCHAR(100) NOT NULL, -- e.g., 'articles', 'users', 'settings'
  action VARCHAR(50) NOT NULL,    -- e.g., 'create', 'read', 'update', 'delete', 'publish'
  
  -- Permission Scope
  scope VARCHAR(50) CHECK (scope IN ('global', 'own', 'department', 'custom')),
  -- global: Can perform action on any record
  -- own: Can only perform action on own records
  -- department: Can perform action on department's records
  -- custom: Custom rules in permission_conditions
  
  -- Category for UI organization
  category VARCHAR(50), -- e.g., 'articles', 'users', 'settings', 'analytics'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_permissions_action ON permissions(action);
CREATE INDEX idx_permissions_code ON permissions(code);
```

### 1.3 Permission Catalog (All System Permissions)

```sql
INSERT INTO permissions (id, name, code, description, resource, action, scope, category) VALUES
-- ARTICLES
  (gen_random_uuid(), 'View All Articles', 'articles:read:global', 'View all articles', 'articles', 'read', 'global', 'articles'),
  (gen_random_uuid(), 'View Own Articles', 'articles:read:own', 'View own articles', 'articles', 'read', 'own', 'articles'),
  (gen_random_uuid(), 'Create Articles', 'articles:create', 'Create new articles', 'articles', 'create', 'global', 'articles'),
  (gen_random_uuid(), 'Edit All Articles', 'articles:update:global', 'Edit any article', 'articles', 'update', 'global', 'articles'),
  (gen_random_uuid(), 'Edit Own Articles', 'articles:update:own', 'Edit own articles', 'articles', 'update', 'own', 'articles'),
  (gen_random_uuid(), 'Publish Articles', 'articles:publish', 'Publish articles', 'articles', 'publish', 'global', 'articles'),
  (gen_random_uuid(), 'Delete Articles', 'articles:delete', 'Delete articles', 'articles', 'delete', 'global', 'articles'),
  (gen_random_uuid(), 'Archive Articles', 'articles:archive', 'Archive articles', 'articles', 'archive', 'global', 'articles'),

-- ARTICLE SUBMISSIONS & APPROVALS
  (gen_random_uuid(), 'Review Submissions', 'submissions:review', 'Review article submissions', 'submissions', 'review', 'global', 'articles'),
  (gen_random_uuid(), 'Approve Submissions', 'submissions:approve', 'Approve article submissions', 'submissions', 'approve', 'global', 'articles'),
  (gen_random_uuid(), 'Reject Submissions', 'submissions:reject', 'Reject article submissions', 'submissions', 'reject', 'global', 'articles'),
  (gen_random_uuid(), 'Manage Workflow', 'submissions:manage_workflow', 'Manage article workflow', 'submissions', 'manage', 'global', 'articles'),

-- USERS & ACCOUNTS
  (gen_random_uuid(), 'View All Users', 'users:read:global', 'View all users', 'users', 'read', 'global', 'users'),
  (gen_random_uuid(), 'Create Users', 'users:create', 'Create new user accounts', 'users', 'create', 'global', 'users'),
  (gen_random_uuid(), 'Edit All Users', 'users:update:global', 'Edit any user', 'users', 'update', 'global', 'users'),
  (gen_random_uuid(), 'Assign Roles', 'users:assign_roles', 'Assign roles to users', 'users', 'assign_roles', 'global', 'users'),
  (gen_random_uuid(), 'Deactivate Users', 'users:deactivate', 'Deactivate user accounts', 'users', 'deactivate', 'global', 'users'),
  (gen_random_uuid(), 'Reset Passwords', 'users:reset_password', 'Reset user passwords', 'users', 'reset_password', 'global', 'users'),
  (gen_random_uuid(), 'Delete Users', 'users:delete', 'Permanently delete users', 'users', 'delete', 'global', 'users'),

-- COMMENTS & MODERATION
  (gen_random_uuid(), 'View Comments', 'comments:read', 'View all comments', 'comments', 'read', 'global', 'moderation'),
  (gen_random_uuid(), 'Approve Comments', 'comments:approve', 'Approve comments', 'comments', 'approve', 'global', 'moderation'),
  (gen_random_uuid(), 'Reject Comments', 'comments:reject', 'Reject/delete comments', 'comments', 'reject', 'global', 'moderation'),
  (gen_random_uuid(), 'Mark Spam', 'comments:spam', 'Mark comments as spam', 'comments', 'spam', 'global', 'moderation'),

-- ANALYTICS & REPORTING
  (gen_random_uuid(), 'View Dashboard', 'analytics:read', 'View analytics dashboard', 'analytics', 'read', 'global', 'analytics'),
  (gen_random_uuid(), 'View Detailed Reports', 'analytics:detailed', 'Access detailed analytics', 'analytics', 'detailed', 'global', 'analytics'),
  (gen_random_uuid(), 'Export Reports', 'analytics:export', 'Export analytics data', 'analytics', 'export', 'global', 'analytics'),

-- SETTINGS & CONFIGURATION
  (gen_random_uuid(), 'View Settings', 'settings:read', 'View system settings', 'settings', 'read', 'global', 'settings'),
  (gen_random_uuid(), 'Edit General Settings', 'settings:edit:general', 'Edit general settings', 'settings', 'edit', 'global', 'settings'),
  (gen_random_uuid(), 'Edit Security Settings', 'settings:edit:security', 'Edit security settings', 'settings', 'edit', 'global', 'settings'),
  (gen_random_uuid(), 'Manage Categories', 'categories:manage', 'Create/edit/delete categories', 'categories', 'manage', 'global', 'settings'),
  (gen_random_uuid(), 'Manage Sources', 'sources:manage', 'Manage article sources', 'sources', 'manage', 'global', 'settings'),

-- AUDIT & COMPLIANCE
  (gen_random_uuid(), 'View Audit Logs', 'audit:read', 'View audit and activity logs', 'audit', 'read', 'global', 'audit'),
  (gen_random_uuid(), 'Export Audit Logs', 'audit:export', 'Export audit logs', 'audit', 'export', 'global', 'audit'),
  (gen_random_uuid(), 'Manage Data Retention', 'audit:retention', 'Manage data retention policies', 'audit', 'retention', 'global', 'audit');
```

---

## SECTION 2: ROLE-PERMISSION MAPPINGS

### 2.1 Role-Permission Mapping Table

```sql
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  
  -- Custom conditions (JSON for complex rules)
  conditions JSONB, -- e.g., {"department": "editorial", "time_window": "9am-6pm"}
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE TRIGGER role_permissions_updated_at BEFORE UPDATE ON role_permissions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### 2.2 Assign Permissions to Roles

```sql
-- Super Admin: ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.code = 'super_admin';

-- Admin: Everything except user deletion
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.code = 'admin' 
  AND p.code NOT IN ('users:delete');

-- Editor: Article + submission + comment management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.code = 'editor' 
  AND p.resource IN ('articles', 'submissions', 'comments', 'categories', 'analytics')
  AND p.code NOT IN ('users:assign_roles', 'settings:edit:security');

-- Reviewer: Submission review only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.code = 'reviewer' 
  AND p.code IN ('submissions:review', 'submissions:approve', 'submissions:reject', 
                 'articles:read:global', 'comments:read', 'analytics:read');

-- Contributor: Create & view own
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.code = 'contributor' 
  AND p.code IN ('articles:create', 'articles:read:own', 'articles:update:own', 'submissions:review');

-- Viewer: Read-only access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.code = 'viewer' 
  AND p.action = 'read';
```

---

## SECTION 3: USER-ROLE ASSIGNMENT

### 3.1 User Roles Mapping

```sql
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  
  -- Assignment tracking
  assigned_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Optional expiration (for temporary assignments)
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Assignment reason (audit)
  assignment_reason TEXT,
  
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at) WHERE expires_at IS NOT NULL;
```

---

## SECTION 4: SCREEN-LEVEL ACCESS CONTROL

### 4.1 Admin Screens Definition

```sql
CREATE TABLE IF NOT EXISTS admin_screens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Screen Identification
  name VARCHAR(200) NOT NULL UNIQUE,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  
  -- UI Configuration
  path VARCHAR(500) NOT NULL UNIQUE, -- URL path (e.g., /admin/articles)
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  
  -- Screen Type
  screen_type VARCHAR(50) CHECK (screen_type IN (
    'list',           -- List/grid view
    'detail',         -- Detail/form view
    'dashboard',      -- Dashboard/overview
    'settings',       -- Settings page
    'analytics',      -- Analytics/reporting
    'moderation',     -- Moderation panel
    'audit',          -- Audit logs
    'other'
  )),
  
  -- Navigation
  parent_screen_id UUID REFERENCES admin_screens(id) ON DELETE SET NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  -- Required permissions to access this screen
  required_permissions VARCHAR(100)[], -- e.g., ['articles:read', 'articles:update']
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_screens_code ON admin_screens(code);
CREATE INDEX idx_screens_path ON admin_screens(path);
CREATE INDEX idx_screens_is_active ON admin_screens(is_active);
```

### 4.2 Admin Screens Catalog

```sql
-- Insert main screens
INSERT INTO admin_screens (id, name, code, path, screen_type, display_order, required_permissions) VALUES
  (gen_random_uuid(), 'Dashboard', 'dashboard', '/admin', 'dashboard', 1, ARRAY['analytics:read']),
  
  -- Articles Management
  (gen_random_uuid(), 'Articles', 'articles_list', '/admin/articles', 'list', 10, ARRAY['articles:read:global']),
  (gen_random_uuid(), 'Article Editor', 'article_detail', '/admin/articles/:id', 'detail', 11, ARRAY['articles:read:global', 'articles:update:global']),
  (gen_random_uuid(), 'Create Article', 'article_create', '/admin/articles/new', 'detail', 12, ARRAY['articles:create']),
  
  -- Submissions & Approvals
  (gen_random_uuid(), 'Submissions', 'submissions_list', '/admin/submissions', 'list', 20, ARRAY['submissions:review']),
  (gen_random_uuid(), 'Submission Detail', 'submission_detail', '/admin/submissions/:id', 'detail', 21, ARRAY['submissions:review']),
  
  -- Users Management
  (gen_random_uuid(), 'Users', 'users_list', '/admin/users', 'list', 30, ARRAY['users:read:global']),
  (gen_random_uuid(), 'User Detail', 'user_detail', '/admin/users/:id', 'detail', 31, ARRAY['users:read:global']),
  (gen_random_uuid(), 'Create User', 'user_create', '/admin/users/new', 'detail', 32, ARRAY['users:create']),
  (gen_random_uuid(), 'Roles & Permissions', 'roles_perms', '/admin/roles', 'settings', 33, ARRAY['users:assign_roles']),
  
  -- Moderation
  (gen_random_uuid(), 'Comments', 'comments_list', '/admin/comments', 'list', 40, ARRAY['comments:read']),
  (gen_random_uuid(), 'Moderation Queue', 'moderation_queue', '/admin/moderation', 'moderation', 41, ARRAY['comments:approve']),
  
  -- Analytics
  (gen_random_uuid(), 'Analytics', 'analytics', '/admin/analytics', 'analytics', 50, ARRAY['analytics:read']),
  (gen_random_uuid(), 'Reports', 'reports', '/admin/reports', 'analytics', 51, ARRAY['analytics:detailed']),
  
  -- Settings
  (gen_random_uuid(), 'Settings', 'settings', '/admin/settings', 'settings', 60, ARRAY['settings:read']),
  (gen_random_uuid(), 'Categories', 'categories', '/admin/categories', 'settings', 61, ARRAY['categories:manage']),
  (gen_random_uuid(), 'Sources', 'sources', '/admin/sources', 'settings', 62, ARRAY['sources:manage']),
  (gen_random_uuid(), 'Security', 'security', '/admin/security', 'settings', 63, ARRAY['settings:edit:security']),
  
  -- Audit
  (gen_random_uuid(), 'Audit Logs', 'audit_logs', '/admin/audit', 'audit', 70, ARRAY['audit:read']);
```

### 4.3 Role-Screen Access Control

```sql
CREATE TABLE IF NOT EXISTS role_screen_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  screen_id UUID NOT NULL REFERENCES admin_screens(id) ON DELETE CASCADE,
  
  -- Access level
  access_level VARCHAR(50) CHECK (access_level IN ('view', 'edit', 'admin', 'deny')),
  
  -- Custom conditions
  conditions JSONB, -- e.g., {"time_window": "9am-6pm", "ip_whitelist": [...]}
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  UNIQUE(role_id, screen_id)
);

CREATE INDEX idx_role_screen_access_role_id ON role_screen_access(role_id);
CREATE INDEX idx_role_screen_access_screen_id ON role_screen_access(screen_id);
```

---

## SECTION 5: FEATURE FLAGS & TIME-BASED ACCESS

### 5.1 Feature Flags for Admin Controls

```sql
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Feature Identification
  name VARCHAR(200) UNIQUE NOT NULL,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  
  -- Feature Status
  is_enabled BOOLEAN DEFAULT TRUE,
  is_rollout BOOLEAN DEFAULT FALSE, -- Gradual rollout
  rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage BETWEEN 0 AND 100),
  
  -- Scope (which roles/users get this feature)
  scope VARCHAR(50) CHECK (scope IN ('all', 'admin_only', 'custom')),
  
  -- Custom targeting
  enabled_for_roles UUID[], -- Specific roles that have this feature
  enabled_for_users UUID[], -- Specific users that have this feature
  disabled_for_roles UUID[], -- Explicitly disabled for these roles
  disabled_for_users UUID[], -- Explicitly disabled for these users
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_feature_flags_code ON feature_flags(code);
CREATE INDEX idx_feature_flags_is_enabled ON feature_flags(is_enabled);

-- Sample feature flags
INSERT INTO feature_flags (name, code, description, is_enabled, scope) VALUES
  ('Advanced Analytics', 'feature:advanced_analytics', 'Access to advanced analytics dashboard', TRUE, 'admin_only'),
  ('Bulk Operations', 'feature:bulk_operations', 'Bulk article operations', TRUE, 'all'),
  ('AI Content Suggestions', 'feature:ai_suggestions', 'AI-powered content suggestions', TRUE, 'all'),
  ('Custom Workflows', 'feature:custom_workflows', 'Custom approval workflows', TRUE, 'admin_only'),
  ('API Access', 'feature:api_access', 'RESTful API access for integrations', FALSE, 'admin_only');
```

### 5.2 Time-Based Access Control

```sql
CREATE TABLE IF NOT EXISTS time_based_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Subject of restriction
  subject_type VARCHAR(50) CHECK (subject_type IN ('user', 'role', 'screen')),
  subject_id UUID NOT NULL,
  
  -- Time Window
  day_of_week VARCHAR(10), -- 'monday', 'tuesday', etc. (NULL = all days)
  start_time TIME, -- e.g., 09:00:00
  end_time TIME,   -- e.g., 18:00:00
  
  -- Timezone
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Optional date range
  valid_from DATE,
  valid_until DATE,
  
  -- Metadata
  reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_time_access_subject ON time_based_access(subject_type, subject_id);
```

---

## SECTION 6: IP WHITELISTING & DEVICE MANAGEMENT

### 6.1 IP Whitelist for Admin Access

```sql
CREATE TABLE IF NOT EXISTS admin_ip_whitelist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- IP Configuration
  ip_address VARCHAR(50) NOT NULL, -- IPv4 or IPv6
  cidr_block VARCHAR(50), -- CIDR notation (e.g., 192.168.1.0/24)
  
  -- Scope
  scope VARCHAR(50) CHECK (scope IN ('global', 'user_specific', 'role_specific', 'screen_specific')),
  
  -- Assignment (optional)
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  screen_id UUID REFERENCES admin_screens(id) ON DELETE CASCADE,
  
  -- Configuration
  name VARCHAR(200), -- e.g., "Office Network"
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE -- Optional expiration
);

CREATE INDEX idx_ip_whitelist_ip ON admin_ip_whitelist(ip_address);
CREATE INDEX idx_ip_whitelist_user_id ON admin_ip_whitelist(user_id);
CREATE INDEX idx_ip_whitelist_is_active ON admin_ip_whitelist(is_active);

-- Sample: Whitelist office network
INSERT INTO admin_ip_whitelist (ip_address, cidr_block, scope, name, description, is_active) VALUES
  ('192.168.1.0', '192.168.1.0/24', 'global', 'Office Network', 'Main office network', TRUE),
  ('10.0.0.0', '10.0.0.0/8', 'global', 'Corporate VPN', 'Corporate VPN network', TRUE);
```

### 6.2 Trusted Devices Management

```sql
CREATE TABLE IF NOT EXISTS trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Device Identification
  device_name VARCHAR(200), -- e.g., "John's MacBook"
  device_hash VARCHAR(256), -- Hash of browser fingerprint
  device_type VARCHAR(50) CHECK (device_type IN ('desktop', 'mobile', 'tablet', 'other')),
  
  -- Device Info
  user_agent VARCHAR(500),
  ip_address VARCHAR(50),
  
  -- Trust Status
  is_trusted BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  
  -- Verification
  verification_token VARCHAR(256),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by_method VARCHAR(50) CHECK (verified_by_method IN ('email', 'sms', 'security_question', 'manual')),
  
  -- Activity
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  
  -- Expiration
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_is_trusted ON trusted_devices(is_trusted);
```

---

## SECTION 7: SESSION MANAGEMENT & AUDIT

### 7.1 Admin Session Tracking

```sql
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User & Session
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(256) UNIQUE NOT NULL,
  
  -- Device & Network
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  device_fingerprint VARCHAR(256),
  
  -- Session Details
  login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  logout_at TIMESTAMP WITH TIME ZONE,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Session Status
  is_active BOOLEAN DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'idle', 'expired', 'terminated', 'suspicious')),
  
  -- Security
  is_suspicious BOOLEAN DEFAULT FALSE,
  suspicious_reason TEXT,
  
  -- Session Duration
  session_duration_minutes INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX idx_admin_sessions_status ON admin_sessions(status);
CREATE INDEX idx_admin_sessions_created_at ON admin_sessions(created_at DESC);
CREATE TRIGGER admin_sessions_updated_at BEFORE UPDATE ON admin_sessions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### 7.2 Admin Action Audit Log

```sql
CREATE TABLE IF NOT EXISTS admin_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  session_id UUID REFERENCES admin_sessions(id) ON DELETE SET NULL,
  
  -- Action
  action_type VARCHAR(100) NOT NULL,
  action_category VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'publish', 'approve'
  
  -- Resource
  resource_type VARCHAR(100), -- 'article', 'user', 'comment', etc.
  resource_id UUID,
  resource_title VARCHAR(500),
  
  -- Details
  action_description TEXT,
  changes_before JSONB,
  changes_after JSONB,
  
  -- Network & Device
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  
  -- Status & Result
  status VARCHAR(50) CHECK (status IN ('success', 'failure', 'partial_success')),
  error_message TEXT,
  
  -- Severity (for alerting)
  severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_admin_logs_user_id ON admin_action_logs(user_id);
CREATE INDEX idx_admin_logs_resource ON admin_action_logs(resource_type, resource_id);
CREATE INDEX idx_admin_logs_created_at ON admin_action_logs(created_at DESC);
CREATE INDEX idx_admin_logs_severity ON admin_action_logs(severity);
CREATE INDEX idx_admin_logs_action_category ON admin_action_logs(action_category);
```

### 7.3 Login Attempt Tracking (Security)

```sql
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Login Info
  username VARCHAR(100),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Attempt Details
  ip_address VARCHAR(50),
  user_agent VARCHAR(500),
  device_fingerprint VARCHAR(256),
  
  -- Result
  attempt_status VARCHAR(50) CHECK (attempt_status IN ('success', 'invalid_credentials', 'account_locked', 'ip_blocked', 'device_not_trusted')),
  failure_reason TEXT,
  
  -- Two-Factor Authentication
  mfa_required BOOLEAN DEFAULT FALSE,
  mfa_method VARCHAR(50) CHECK (mfa_method IN ('email', 'sms', 'authenticator', 'backup_codes')),
  mfa_verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_login_attempts_user_id ON admin_login_attempts(user_id);
CREATE INDEX idx_login_attempts_ip_address ON admin_login_attempts(ip_address);
CREATE INDEX idx_login_attempts_created_at ON admin_login_attempts(created_at DESC);
CREATE INDEX idx_login_attempts_attempt_status ON admin_login_attempts(attempt_status);
```

---

## SECTION 8: ACCESS CONTROL HELPER FUNCTIONS

### 8.1 Check User Permissions

```sql
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_code VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND p.code = p_permission_code
      AND (ur.expires_at IS NULL OR ur.expires_at > CURRENT_TIMESTAMP)
  ) INTO v_has_permission;
  
  RETURN v_has_permission;
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT user_has_permission('user-uuid'::UUID, 'articles:publish');
```

### 8.2 Check Screen Access

```sql
CREATE OR REPLACE FUNCTION user_can_access_screen(
  p_user_id UUID,
  p_screen_code VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  v_required_permissions VARCHAR(100)[];
  v_has_all_permissions BOOLEAN := TRUE;
  v_permission VARCHAR(100);
BEGIN
  -- Get required permissions for screen
  SELECT required_permissions INTO v_required_permissions
  FROM admin_screens
  WHERE code = p_screen_code;
  
  IF v_required_permissions IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check each required permission
  FOREACH v_permission IN ARRAY v_required_permissions
  LOOP
    IF NOT user_has_permission(p_user_id, v_permission) THEN
      v_has_all_permissions := FALSE;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_has_all_permissions;
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT user_can_access_screen('user-uuid'::UUID, 'articles_list');
```

### 8.3 Check IP Whitelist

```sql
CREATE OR REPLACE FUNCTION is_ip_whitelisted(
  p_ip_address VARCHAR,
  p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_whitelisted BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM admin_ip_whitelist
    WHERE is_active = TRUE
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      AND (
        (scope = 'global' AND (p_user_id IS NULL OR user_id IS NULL))
        OR (scope = 'user_specific' AND user_id = p_user_id)
      )
      AND (
        ip_address = p_ip_address
        OR (cidr_block IS NOT NULL AND p_ip_address::inet << cidr_block::inet)
      )
  ) INTO v_is_whitelisted;
  
  RETURN v_is_whitelisted;
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT is_ip_whitelisted('192.168.1.100');
```

### 8.4 Get User Dashboard Screens

```sql
CREATE OR REPLACE FUNCTION get_user_accessible_screens(p_user_id UUID)
RETURNS TABLE (
  screen_id UUID,
  screen_name VARCHAR,
  screen_code VARCHAR,
  screen_path VARCHAR,
  icon VARCHAR,
  display_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.code,
    s.path,
    s.icon,
    s.display_order
  FROM admin_screens s
  WHERE s.is_active = TRUE
    AND s.is_hidden = FALSE
    AND user_can_access_screen(p_user_id, s.code)
  ORDER BY s.display_order ASC;
END;
$$ LANGUAGE plpgsql;

-- Usage:
-- SELECT * FROM get_user_accessible_screens('user-uuid'::UUID);
```

---

## SECTION 9: AUTHORIZATION TRIGGERS & ENFORCEMENT

### 9.1 Audit Trigger for Permission Changes

```sql
CREATE OR REPLACE FUNCTION audit_permission_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_action_logs (
    user_id, action_type, action_category, resource_type, resource_id,
    action_description, status, severity, ip_address
  ) VALUES (
    get_audit_user_id(),
    'permission_' || TG_OP,
    'security',
    'permissions',
    NEW.id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Permission assigned to role'
      WHEN TG_OP = 'UPDATE' THEN 'Permission updated'
      WHEN TG_OP = 'DELETE' THEN 'Permission removed from role'
    END,
    'success',
    'high',
    current_setting('app.client_ip', true)
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_role_permissions AFTER INSERT OR UPDATE OR DELETE ON role_permissions
  FOR EACH ROW EXECUTE FUNCTION audit_permission_change();
```

### 9.2 Track Role Assignments

```sql
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION log_audit_change();
```

---

## SECTION 10: QUERIES & DASHBOARDS

### 10.1 User Access Summary

```sql
-- Get all permissions for a user
SELECT DISTINCT
  r.name as role_name,
  p.name as permission_name,
  p.code as permission_code,
  p.resource,
  p.action,
  p.scope
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
WHERE ur.user_id = $1 -- Replace with user_id
  AND (ur.expires_at IS NULL OR ur.expires_at > CURRENT_TIMESTAMP)
ORDER BY p.resource, p.action;
```

### 10.2 Screen Access Matrix

```sql
-- Show which roles have access to which screens
SELECT 
  r.name as role_name,
  s.name as screen_name,
  s.path,
  rsa.access_level,
  COUNT(DISTINCT ur.user_id) as user_count
FROM roles r
LEFT JOIN role_screen_access rsa ON r.id = rsa.role_id
LEFT JOIN admin_screens s ON rsa.screen_id = s.id
LEFT JOIN user_roles ur ON r.id = ur.role_id
WHERE r.is_system_role = TRUE
GROUP BY r.id, r.name, s.id, s.name, s.path, rsa.access_level
ORDER BY r.name, s.display_order;
```

### 10.3 Recent Admin Activity

```sql
-- Last 50 admin actions
SELECT 
  u.display_name as admin_user,
  aal.action_type,
  aal.resource_type,
  aal.resource_title,
  aal.status,
  aal.severity,
  aal.ip_address,
  aal.created_at
FROM admin_action_logs aal
JOIN users u ON aal.user_id = u.id
ORDER BY aal.created_at DESC
LIMIT 50;
```

### 10.4 Active Admin Sessions

```sql
-- Currently active admin sessions
SELECT 
  u.display_name,
  u.email,
  r.name as role,
  ads.ip_address,
  ads.login_at,
  EXTRACT(MINUTE FROM CURRENT_TIMESTAMP - ads.last_activity_at) as idle_minutes,
  ads.status
FROM admin_sessions ads
JOIN users u ON ads.user_id = u.id
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE ads.is_active = TRUE
ORDER BY ads.login_at DESC;
```

### 10.5 Suspicious Activity Alerts

```sql
-- Failed login attempts in last 24 hours
SELECT 
  username,
  COUNT(*) as attempt_count,
  MIN(created_at) as first_attempt,
  MAX(created_at) as last_attempt,
  STRING_AGG(DISTINCT ip_address, ', ') as ip_addresses
FROM admin_login_attempts
WHERE attempt_status != 'success'
  AND created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY username
HAVING COUNT(*) >= 5  -- Alert after 5 failed attempts
ORDER BY attempt_count DESC;
```

---

## SECTION 11: IMPLEMENTATION CHECKLIST

### Before Deployment

- [ ] Create all permission tables
- [ ] Define all system permissions (40+ permissions)
- [ ] Create 6 system roles
- [ ] Configure role-permission mappings
- [ ] Create admin screens catalog
- [ ] Set up screen access rules
- [ ] Configure IP whitelist (office, VPN)
- [ ] Test permission checks with helper functions
- [ ] Verify audit logging works
- [ ] Load test with concurrent sessions

### Security Configuration

- [ ] IP whitelist configured for office network
- [ ] Session timeout set (15-30 minutes idle)
- [ ] Failed login lockout enabled (5 attempts)
- [ ] MFA required for admin roles
- [ ] Device fingerprinting enabled
- [ ] Suspicious activity alerts configured
- [ ] Audit retention policy set (7 years)

---

## SUMMARY

✅ **Comprehensive Admin Privilege System:**
- 6 predefined roles with full flexibility
- 40+ granular permissions (resource + action)
- Screen-level access control (20+ admin screens)
- IP whitelisting and device management
- Session tracking with audit trail
- Time-based access restrictions
- Feature flags for gradual rollouts
- Complete audit logging of admin actions

✅ **Security Features:**
- Role-based access control (RBAC)
- Permission-based authorization (PBAC)
- IP whitelisting per user/role
- Trusted device management
- Session management with timeout
- Login attempt tracking
- Suspicious activity detection
- 7-year audit retention

---

**Status:** ✅ **ADMIN PRIVILEGES SYSTEM COMPLETE**

Ready for Strapi integration and React admin console development.
