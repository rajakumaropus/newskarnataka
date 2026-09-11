-- ============================================================================
-- SYSTEM DATA INITIALIZATION - Complete RBAC Setup
-- NewsKarnataka.com - Final 8% Deployment
-- ============================================================================

-- ============================================================================
-- SECTION 1: INSERT ROLES (6 roles)
-- ============================================================================

INSERT INTO roles (id, name, description, created_at) VALUES
  (gen_random_uuid(), 'admin', 'Full system access with administrative privileges', NOW()),
  (gen_random_uuid(), 'editor', 'Edit and publish articles, manage editorial content', NOW()),
  (gen_random_uuid(), 'reviewer', 'Review and approve articles before publishing', NOW()),
  (gen_random_uuid(), 'author', 'Write and submit articles for editorial review', NOW()),
  (gen_random_uuid(), 'source_agent', 'Automated content source ingestion and processing', NOW()),
  (gen_random_uuid(), 'viewer', 'Read-only access to published content', NOW());

-- ============================================================================
-- SECTION 2: INSERT PERMISSIONS (45+ permissions)
-- ============================================================================

INSERT INTO permissions (id, name, description, category, created_at) VALUES
  -- Article Management (CRUD)
  (gen_random_uuid(), 'articles.create', 'Create new articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.read', 'Read articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.update', 'Update articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.delete', 'Delete articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.read_draft', 'Read draft articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.view_all', 'View all articles including drafts', 'articles', NOW()),
  (gen_random_uuid(), 'articles.manage_all', 'Manage all articles across all statuses', 'articles', NOW()),
  
  -- Article Publishing
  (gen_random_uuid(), 'articles.publish', 'Publish articles to live', 'articles', NOW()),
  (gen_random_uuid(), 'articles.unpublish', 'Unpublish articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.schedule', 'Schedule article publishing', 'articles', NOW()),
  (gen_random_uuid(), 'articles.archive', 'Archive articles', 'articles', NOW()),
  
  -- Article Approval Workflow
  (gen_random_uuid(), 'articles.approve', 'Approve articles for publishing', 'articles', NOW()),
  (gen_random_uuid(), 'articles.reject', 'Reject articles with feedback', 'articles', NOW()),
  (gen_random_uuid(), 'articles.request_changes', 'Request changes on articles', 'articles', NOW()),
  (gen_random_uuid(), 'articles.bypass_approval', 'Bypass approval workflow', 'articles', NOW()),
  
  -- Comments Management
  (gen_random_uuid(), 'comments.create', 'Create comments', 'comments', NOW()),
  (gen_random_uuid(), 'comments.read', 'Read comments', 'comments', NOW()),
  (gen_random_uuid(), 'comments.update', 'Update comments', 'comments', NOW()),
  (gen_random_uuid(), 'comments.delete', 'Delete comments', 'comments', NOW()),
  (gen_random_uuid(), 'comments.moderate', 'Moderate comments', 'comments', NOW()),
  (gen_random_uuid(), 'comments.approve', 'Approve comments', 'comments', NOW()),
  
  -- User Management
  (gen_random_uuid(), 'users.create', 'Create user accounts', 'users', NOW()),
  (gen_random_uuid(), 'users.read', 'Read user information', 'users', NOW()),
  (gen_random_uuid(), 'users.update', 'Update user information', 'users', NOW()),
  (gen_random_uuid(), 'users.delete', 'Delete user accounts', 'users', NOW()),
  (gen_random_uuid(), 'users.manage', 'Manage all users', 'users', NOW()),
  (gen_random_uuid(), 'users.manage_roles', 'Assign roles to users', 'users', NOW()),
  (gen_random_uuid(), 'users.manage_permissions', 'Manage user permissions', 'users', NOW()),
  
  -- Role & Permission Management
  (gen_random_uuid(), 'roles.create', 'Create roles', 'roles', NOW()),
  (gen_random_uuid(), 'roles.read', 'Read role information', 'roles', NOW()),
  (gen_random_uuid(), 'roles.update', 'Update roles', 'roles', NOW()),
  (gen_random_uuid(), 'roles.delete', 'Delete roles', 'roles', NOW()),
  (gen_random_uuid(), 'permissions.manage', 'Manage permissions', 'permissions', NOW()),
  
  -- Categories & Tags
  (gen_random_uuid(), 'categories.create', 'Create categories', 'categories', NOW()),
  (gen_random_uuid(), 'categories.read', 'Read categories', 'categories', NOW()),
  (gen_random_uuid(), 'categories.manage', 'Manage categories', 'categories', NOW()),
  (gen_random_uuid(), 'tags.create', 'Create tags', 'tags', NOW()),
  (gen_random_uuid(), 'tags.read', 'Read tags', 'tags', NOW()),
  (gen_random_uuid(), 'tags.manage', 'Manage tags', 'tags', NOW()),
  
  -- Media Management
  (gen_random_uuid(), 'media.upload', 'Upload media files', 'media', NOW()),
  (gen_random_uuid(), 'media.read', 'Read media library', 'media', NOW()),
  (gen_random_uuid(), 'media.manage', 'Manage media library', 'media', NOW()),
  (gen_random_uuid(), 'media.delete', 'Delete media files', 'media', NOW()),
  
  -- System Settings
  (gen_random_uuid(), 'settings.view', 'View system settings', 'settings', NOW()),
  (gen_random_uuid(), 'settings.update', 'Update system settings', 'settings', NOW()),
  
  -- Audit & Logging
  (gen_random_uuid(), 'audit_logs.view', 'View audit logs', 'audit', NOW()),
  (gen_random_uuid(), 'error_logs.view', 'View error logs', 'audit', NOW()),
  (gen_random_uuid(), 'analytics.view', 'View analytics', 'analytics', NOW()),
  
  -- API Management
  (gen_random_uuid(), 'api_keys.create', 'Create API keys', 'api', NOW()),
  (gen_random_uuid(), 'api_keys.manage', 'Manage API keys', 'api', NOW());

-- ============================================================================
-- SECTION 3: MAP PERMISSIONS TO ROLES
-- ============================================================================

-- Admin Role: All permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id,
  NOW()
FROM roles r, permissions p
WHERE r.name = 'admin';

-- Editor Role: Article management and publishing permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id,
  NOW()
FROM roles r, permissions p
WHERE r.name = 'editor'
  AND p.category IN ('articles', 'comments', 'categories', 'tags', 'media')
  AND p.name IN (
    'articles.create', 'articles.read', 'articles.update', 'articles.delete',
    'articles.publish', 'articles.unpublish', 'articles.view_all', 'articles.archive',
    'articles.schedule',
    'comments.read', 'comments.moderate', 'comments.approve',
    'categories.read', 'categories.create',
    'tags.read', 'tags.create',
    'media.upload', 'media.read', 'media.delete'
  );

-- Reviewer Role: Article review and approval permissions
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id,
  NOW()
FROM roles r, permissions p
WHERE r.name = 'reviewer'
  AND p.name IN (
    'articles.read', 'articles.view_all', 'articles.approve', 'articles.reject',
    'articles.request_changes', 'comments.read', 'comments.approve',
    'audit_logs.view'
  );

-- Author Role: Create and submit articles
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id,
  NOW()
FROM roles r, permissions p
WHERE r.name = 'author'
  AND p.name IN (
    'articles.create', 'articles.read', 'articles.update', 'articles.read_draft',
    'comments.create', 'comments.read', 'comments.update',
    'media.upload', 'media.read',
    'categories.create', 'categories.read',
    'tags.create', 'tags.read',
    'api_keys.create'
  );

-- Source Agent Role: Automated content ingestion
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id,
  NOW()
FROM roles r, permissions p
WHERE r.name = 'source_agent'
  AND p.name IN (
    'articles.create', 'articles.read', 'articles.update',
    'categories.create', 'categories.read',
    'tags.create', 'tags.read',
    'media.upload', 'media.read',
    'api_keys.create'
  );

-- Viewer Role: Read-only access
INSERT INTO role_permissions (id, role_id, permission_id, created_at)
SELECT 
  gen_random_uuid(),
  r.id,
  p.id,
  NOW()
FROM roles r, permissions p
WHERE r.name = 'viewer'
  AND p.name IN (
    'articles.read', 'articles.view_all',
    'comments.read',
    'categories.read',
    'tags.read'
  );

-- ============================================================================
-- SECTION 4: VERIFICATION QUERIES
-- ============================================================================

SELECT 'Roles Inserted' as component, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Permissions Inserted', COUNT(*) FROM permissions
UNION ALL
SELECT 'Role-Permission Mappings', COUNT(*) FROM role_permissions;

SELECT r.name, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.name
ORDER BY r.name;

-- ============================================================================
-- END OF SYSTEM DATA INITIALIZATION
-- ============================================================================
-- RBAC is now fully operational
-- 6 roles + 45 permissions = Complete access control system
-- ============================================================================
