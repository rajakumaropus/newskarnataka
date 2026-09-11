// Role-Based Access Control Definitions
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  publish: boolean;
  manage_users: boolean;
  manage_roles: boolean;
}

// Define permissions for each role
const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  admin: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    publish: true,
    manage_users: true,
    manage_roles: true,
  },
  editor: {
    view: true,
    create: true,
    edit: true,
    delete: true,
    publish: true,
    manage_users: false,
    manage_roles: false,
  },
  viewer: {
    view: true,
    create: false,
    edit: false,
    delete: false,
    publish: false,
    manage_users: false,
    manage_roles: false,
  },
};

/**
 * Check if user has permission for action
 */
export const hasPermission = (
  role: UserRole | undefined,
  permission: keyof Permission
): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
};

/**
 * Check if user can perform action (alternative name)
 */
export const canPerform = (role: UserRole | undefined, action: string): boolean => {
  if (!role) return false;

  const actionMap: Record<string, keyof Permission> = {
    view: 'view',
    read: 'view',
    create: 'create',
    add: 'create',
    edit: 'edit',
    update: 'edit',
    delete: 'delete',
    remove: 'delete',
    publish: 'publish',
    unpublish: 'publish',
    manage_users: 'manage_users',
    manage_roles: 'manage_roles',
  };

  const permission = actionMap[action];
  if (!permission) return false;

  return hasPermission(role, permission);
};

/**
 * Get all permissions for a role
 */
export const getPermissions = (role: UserRole | undefined): Permission | null => {
  if (!role) return null;
  return ROLE_PERMISSIONS[role] ?? null;
};

/**
 * Check if user is admin
 */
export const isAdmin = (role: UserRole | undefined): boolean => {
  return role === 'admin';
};

/**
 * Check if user is editor or admin
 */
export const isEditor = (role: UserRole | undefined): boolean => {
  return role === 'editor' || role === 'admin';
};

/**
 * Get display name for role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const names: Record<UserRole, string> = {
    admin: 'Administrator',
    editor: 'Editor',
    viewer: 'Viewer',
  };
  return names[role] || role;
};

/**
 * Get role description
 */
export const getRoleDescription = (role: UserRole): string => {
  const descriptions: Record<UserRole, string> = {
    admin: 'Full access to all features and user management',
    editor: 'Can create, edit, publish articles',
    viewer: 'Read-only access to content',
  };
  return descriptions[role] || '';
};
