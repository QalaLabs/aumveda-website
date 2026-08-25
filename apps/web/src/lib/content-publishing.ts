// Role-based content publishing gate for practitioner-authored content
// (session notes, daily-dose overrides, and any future CMS-style routes).
// Uses the existing User.role field only — no schema changes.
//
// Roles:
//  - "admin" / "super_admin" — may publish content under any practitioner name.
//  - "archana" / "sejal"     — practitioner accounts; may publish only under their own name.
//  - "practitioner"          — generic/legacy practitioner role; treated as unscoped
//    (kept for backwards compatibility with existing seed data) but SHOULD be
//    migrated to "archana" / "sejal" going forward.
//  - anything else           — no publishing rights.

export const NAMED_PRACTITIONER_ROLES = new Set(['archana', 'sejal'])
const ELEVATED_ROLES = new Set(['admin', 'super_admin'])
const LEGACY_PRACTITIONER_ROLE = 'practitioner'

export type PublishSession = { user: { role?: string | null } }

/**
 * True if this session's role is allowed to publish practitioner-authored
 * content (session notes, daily-dose overrides, etc.) at all.
 */
export function canPublishContent(session: PublishSession | null | undefined): boolean {
  const role = session?.user?.role
  if (!role) return false
  return (
    ELEVATED_ROLES.has(role) ||
    NAMED_PRACTITIONER_ROLES.has(role) ||
    role === LEGACY_PRACTITIONER_ROLE
  )
}

/**
 * True if this session may publish content attributed to `practitionerSlug`
 * (e.g. "archana" | "sejal"). Admins may publish as anyone. A named
 * practitioner (role "archana"/"sejal") may only publish as themselves.
 * The legacy generic "practitioner" role is left unscoped for backwards
 * compatibility.
 */
export function canPublishAs(
  session: PublishSession | null | undefined,
  practitionerSlug: string | null | undefined
): boolean {
  const role = session?.user?.role
  if (!role || !canPublishContent(session)) return false
  if (ELEVATED_ROLES.has(role)) return true
  if (role === LEGACY_PRACTITIONER_ROLE) return true
  if (!practitionerSlug) return false
  return role === practitionerSlug.toLowerCase()
}
