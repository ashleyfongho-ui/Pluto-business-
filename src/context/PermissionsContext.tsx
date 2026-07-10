import React, { createContext, useContext, useState } from 'react'

// ─── Role definitions ──────────────────────────────────────────────────────────
export type UserRole = 'owner' | 'admin' | 'manager' | 'sales_rep' | 'view_only' | 'pluto_support' | 'pluto_admin'

export interface SystemUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  department: string
  active: boolean
}

export const roleConfig: Record<UserRole, {
  label: string
  color: string
  description: string
  canEdit: boolean
  canDelete: boolean
  canViewAll: boolean // false = only own records
  canManageStaff: boolean
  canViewFinancials: boolean
  canManageBilling: boolean
  canImpersonate: boolean // Pluto staff only
  canManageTenants: boolean // Pluto admin only
}> = {
  owner: {
    label: 'Owner', color: 'bg-pluto-100 text-pluto-700',
    description: 'Full access including billing and user management',
    canEdit: true, canDelete: true, canViewAll: true,
    canManageStaff: true, canViewFinancials: true, canManageBilling: true,
    canImpersonate: false, canManageTenants: false,
  },
  admin: {
    label: 'Admin', color: 'bg-blue-100 text-blue-700',
    description: 'Full access except billing',
    canEdit: true, canDelete: true, canViewAll: true,
    canManageStaff: true, canViewFinancials: true, canManageBilling: false,
    canImpersonate: false, canManageTenants: false,
  },
  manager: {
    label: 'Manager', color: 'bg-green-100 text-green-700',
    description: 'View all records, edit deals/contacts/inventory, no payroll access',
    canEdit: true, canDelete: false, canViewAll: true,
    canManageStaff: false, canViewFinancials: true, canManageBilling: false,
    canImpersonate: false, canManageTenants: false,
  },
  sales_rep: {
    label: 'Sales Rep', color: 'bg-amber-100 text-amber-700',
    description: 'Can only view and edit their own assigned records',
    canEdit: true, canDelete: false, canViewAll: false,
    canManageStaff: false, canViewFinancials: false, canManageBilling: false,
    canImpersonate: false, canManageTenants: false,
  },
  view_only: {
    label: 'View Only', color: 'bg-gray-100 text-gray-600',
    description: 'Read-only access to all records',
    canEdit: false, canDelete: false, canViewAll: true,
    canManageStaff: false, canViewFinancials: false, canManageBilling: false,
    canImpersonate: false, canManageTenants: false,
  },
  pluto_support: {
    label: 'Pluto Support', color: 'bg-violet-100 text-violet-700',
    description: 'Pluto staff — can impersonate clients (read-only by default)',
    canEdit: false, canDelete: false, canViewAll: true,
    canManageStaff: false, canViewFinancials: true, canManageBilling: false,
    canImpersonate: true, canManageTenants: false,
  },
  pluto_admin: {
    label: 'Pluto Admin', color: 'bg-red-100 text-red-700',
    description: 'Full Pluto platform control — tenant management, billing, all clients',
    canEdit: true, canDelete: true, canViewAll: true,
    canManageStaff: true, canViewFinancials: true, canManageBilling: true,
    canImpersonate: true, canManageTenants: true,
  },
}

// ─── Mock users ────────────────────────────────────────────────────────────────
export const allUsers: SystemUser[] = [
  { id: 'u1', name: 'Fabrice Mvondo', email: 'fabrice@plutobusiness.cm', role: 'owner', avatar: 'FM', department: 'Sales', active: true },
  { id: 'u2', name: 'Christelle Abena', email: 'christelle@plutobusiness.cm', role: 'admin', avatar: 'CA', department: 'Operations', active: true },
  { id: 'u3', name: 'Bruno Manga', email: 'bruno@plutobusiness.cm', role: 'sales_rep', avatar: 'BM', department: 'Sales', active: true },
  { id: 'u4', name: 'Nathalie Elong', email: 'nathalie@plutobusiness.cm', role: 'manager', avatar: 'NE', department: 'Finance', active: false },
  // Pluto staff
  { id: 'pluto-1', name: 'Ashley Fongho', email: 'ashley@londonccs.com', role: 'pluto_admin', avatar: 'AF', department: 'Pluto', active: true },
  { id: 'pluto-2', name: 'Pluto Support', email: 'support@plutobusiness.cm', role: 'pluto_support', avatar: 'PS', department: 'Pluto', active: true },
]

// ─── Context ──────────────────────────────────────────────────────────────────
interface PermCtx {
  currentUser: SystemUser
  setCurrentUser: (u: SystemUser) => void
  can: (action: keyof typeof roleConfig[UserRole]) => boolean
  isPlutoStaff: boolean
  impersonating: string | null // tenant id
  startImpersonation: (tenantId: string) => void
  stopImpersonation: () => void
}

const PermissionsContext = createContext<PermCtx | null>(null)

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<SystemUser>(allUsers[0]) // default: Fabrice (owner)
  const [impersonating, setImpersonating] = useState<string | null>(null)

  const isPlutoStaff = currentUser.role === 'pluto_admin' || currentUser.role === 'pluto_support'

  const can = (action: keyof typeof roleConfig[UserRole]): boolean => {
    return !!roleConfig[currentUser.role][action]
  }

  const startImpersonation = (tenantId: string) => {
    if (!can('canImpersonate')) return
    setImpersonating(tenantId)
  }

  const stopImpersonation = () => setImpersonating(null)

  return (
    <PermissionsContext.Provider value={{
      currentUser, setCurrentUser, can, isPlutoStaff,
      impersonating, startImpersonation, stopImpersonation,
    }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext)
  if (!ctx) throw new Error('usePermissions must be used within PermissionsProvider')
  return ctx
}
