const ADMIN_ROLES = new Set(['admin', 'super_admin'])

export function isAdminRole(role: string | null | undefined): boolean {
  return Boolean(role && ADMIN_ROLES.has(role))
}
