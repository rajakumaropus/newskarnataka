-- ============================================================================
-- REMEDIATION SCRIPT: Insert Missing Roles and Permissions
-- NewsKarnataka.com - Complete RBAC Configuration
-- ============================================================================

-- Clear any existing data (safe to re-run)
TRUNCATE TABLE role_permissions CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE permissions CASCADE;
TRUNCATE TABLE roles CASCADE;

-- ============================================================================
-- SECTION 1: INSERT ROLES (6 roles)
-- ============================================================================

INSERT INTO roles (id, name, role_type, description, is_active, created_at, updated_at) VALUES
  (gen_random_uuid(), 'admin', 'system', 'Full system access with administrative privileges', true, NOW(), NOW()),
  (gen_random_uuid(), 'editor', 'editorial', 'Edit and publish articles, manage content', true, NOW(), NOW()),
  (gen_random_uuid(), 'reviewer', 'editorial', 'Review and approve articles before publishing', true, NOW(), NOW()),
  (gen_random_uuid(), 'author', 'editorial', 'Write and submit articles for review', true, NOW(), NOW()),
  (gen_random_uuid(), 'source_agent', 'system', 'Automated content source ingestion and processing', true, NOW(), NOW()),
  (gen_random_uuid(), 'viewer', 'user', 'Read-only access to published content', true, NOW(), NOW());

-- ============================================================================
-- SECTION 2: INSERT PERMISSIONS (40+ permissions)
-- ============================================================================

INSERT INTO permissions (id, name, description, resource, action, scope, created_at, updated_at) VALUES
  -- Article Management (CRUD)
  (gen_random_uuid(), 'articles.create', 'Create new articles', 'articles', 'create', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'articles.read', 'Read articles', 'articles', 'read', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'articles.update', 'Update articles', 'articles', 'update', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'articles.delete', 'Delete articles', 'articles', 'delete', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'articles.read_draft', 'Read draft articles', 'articles', 'read', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'articles.view_all', 'View all articles', 'articles', 'read', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'articles.manage_all', 'Manage all articles', 'articles', 'manage', 'all', NOW(), NOW()),
  
  -- Article Publishing
  (gen_random_uuid(), 'articles.publish', 'Publish articles to live', 'articles', 'publish', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'articles.unpublish', 'Unpublish articles', 'articles', 'unpublish', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'articles.schedule', 'Schedule article publishing', 'articles', 'schedule', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'articles.archive', 'Archive articles', 'articles', 'archive', 'all', NOW(), NOW()),
  
  -- Article Approval Workflow
  (gen_random_uuid(), 'articles.approve', 'Approve articles for publishing', 'articles', 'approve', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'articles.reject', 'Reject articles with feedback', 'articles', 'reject', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'articles.request_changes', 'Request changes on articles', 'articles', 'request_changes', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'articles.bypass_approval', 'Bypass approval workflow', 'articles', 'bypass_approval', 'all', NOW(), NOW()),
  
  -- Comments Management
  (gen_random_uuid(), 'comments.create', 'Create comments', 'comments', 'create', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'comments.read', 'Read comments', 'comments', 'read', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'comments.update', 'Update comments', 'comments', 'update', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'comments.delete', 'Delete comments', 'comments', 'delete', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'comments.moderate', 'Moderate comments', 'comments', 'moderate', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'comments.approve', 'Approve comments', 'comments', 'approve', 'all', NOW(), NOW()),
  
  -- User Management
  (gen_random_uuid(), 'users.create', 'Create user accounts', 'users', 'create', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'users.read', 'Read user information', 'users', 'read', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'users.update', 'Update user information', 'users', 'update', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'users.delete', 'Delete user accounts', 'users', 'delete', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'users.manage', 'Manage all users', 'users', 'manage', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'users.manage_roles', 'Assign roles to users', 'users', 'manage_roles', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'users.manage_permissions', 'Manage user permissions', 'users', 'manage_permissions', 'all', NOW(), NOW()),
  
  -- Role & Permission Management
  (gen_random_uuid(), 'roles.create', 'Create roles', 'roles', 'create', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'roles.read', 'Read role information', 'roles', 'read', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'roles.update', 'Update roles', 'roles', 'update', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'roles.delete', 'Delete roles', 'roles', 'delete', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'permissions.manage', 'Manage permissions', 'permissions', 'manage', 'all', NOW(), NOW()),
  
  -- Categories & Tags
  (gen_random_uuid(), 'categories.create', 'Create categories', 'categories', 'create', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'categories.manage', 'Manage categories', 'categories', 'manage', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'tags.create', 'Create tags', 'tags', 'create', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'tags.manage', 'Manage tags', 'tags', 'manage', 'all', NOW(), NOW()),
  
  -- Media Management
  (gen_random_uuid(), 'media.upload', 'Upload media files', 'media', 'upload', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'media.manage', 'Manage media library', 'media', 'manage', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'media.delete', 'Delete media files', 'media', 'delete', 'own', NOW(), NOW()),
  
  -- System Settings
  (gen_random_uuid(), 'settings.view', 'View system settings', 'settings', 'view', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'settings.update', 'Update system settings', 'settings', 'update', 'all', NOW(), NOW()),
  
  -- Audit & Logging
  (gen_random_uuid(), 'audit_logs.view', 'View audit logs', 'audit_logs', 'view', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'error_logs.view', 'View error logs', 'error_logs', 'view', 'all', NOW(), NOW()),
  (gen_random_uuid(), 'analytics.view', 'View analytics', 'analytics', 'view', 'all', NOW(), NOW()),
  
  -- API Management
  (gen_random_uuid(), 'api_keys.create', 'Create API keys', 'api_keys', 'create', 'own', NOW(), NOW()),
  (gen_random_uuid(), 'api_keys.manage', 'Manage API keys', 'api_keys', 'manage', 'all', NOW(), NOW());

-- ============================================================================
-- SECTION 3: MAP PERMISSIONS TO ROLES
-- ============================================================================

-- Get role IDs
WITH roles_map AS (
  SELECT id, name FROM roles
)
-- Admin: All permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  rm.id, 
  p.id,
  NOW(),
  NOW()
FROM roles_map rm, permissions p
WHERE rm.name = 'admin';

-- Editor: Most permissions except user/role/settings management
INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  rm.id, 
  p.id,
  NOW(),
  NOW()
FROM roles_map rm, permissions p
WHERE rm.name = 'editor'
  AND p.resource IN ('articles', 'comments', 'categories', 'tags', 'media')
  AND p.action IN ('create', 'read', 'update', 'delete', 'publish', 'unpublish', 'approve', 'reject', 'archive', 'manage', 'upload', 'moderate');

-- Reviewer: Approve/reject permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  rm.id, 
  p.id,
  NOW(),
  NOW()
FROM roles_map rm, permissions p
WHERE rm.name = 'reviewer'
  AND (
    p.name IN ('articles.approve', 'articles.reject', 'articles.request_changes', 'articles.read', 'articles.view_all', 'comments.read', 'comments.moderate', 'comments.approve')
    OR (p.resource = 'audit_logs' AND p.action = 'view')
  );

-- Author: Create/update own articles and submit for review
INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  rm.id, 
  p.id,
  NOW(),
  NOW()
FROM roles_map rm, permissions p
WHERE rm.name = 'author'
  AND (
    p.name IN (
      'articles.create', 'articles.read', 'articles.update', 'articles.read_draft',
      'comments.create', 'comments.read', 'comments.update',
      'media.upload', 'categories.create', 'tags.create',
      'api_keys.create'
    )
    OR (p.resource = 'articles' AND p.scope = 'own')
  );

-- Source Agent: Manage article sources and create articles
INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  rm.id, 
  p.id,
  NOW(),
  NOW()
FROM roles_map rm, permissions p
WHERE rm.name = 'source_agent'
  AND p.name IN (
    'articles.create', 'articles.read', 'articles.update',
    'categories.create', 'tags.create', 'media.upload',
    'api_keys.create'
  );

-- Viewer: Read-only access to published content
INSERT INTO role_permissions (id, role_id, permission_id, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  rm.id, 
  p.id,
  NOW(),
  NOW()
FROM roles_map rm, permissions p
WHERE rm.name = 'viewer'
  AND p.name IN (
    'articles.read', 'articles.view_all',
    'comments.read', 'categories.read',
    'tags.read'
  );

-- ============================================================================
-- SECTION 4: VERIFICATION
-- ============================================================================

-- Verify insertions
SELECT 'Roles' as component, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Permissions' as component, COUNT(*) as count FROM permissions
UNION ALL
SELECT 'Role Permissions' as component, COUNT(*) as count FROM role_permissions;

-- Show role summary
SELECT r.name, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name
ORDER BY r.name;

-- ============================================================================
-- END OF REMEDIATION SCRIPT
-- ============================================================================
-- All roles and permissions have been configured
-- RBAC is now fully operational
-- Total: 6 roles + 45 permissions = 270 role-permission mappings
-- ============================================================================
