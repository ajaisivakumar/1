import api from './api';

export interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingVerification: number;
  publishedEvents: number;
  activePolls: number;
  openComplaints: number;
  lostFoundOpen: number;
  lostFoundClaimed: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLog {
  id: string;
  eventType: string;
  actorId?: string;
  actorRole?: string;
  targetType?: string;
  targetId?: string;
  outcome: string;
  description?: string;
  createdAt: string;
}

export const adminService = {
  async getDashboardMetrics(): Promise<AdminMetrics> {
    const res = await api.get<{ metrics: AdminMetrics }>('/admin/dashboard');
    return res.data.metrics;
  },

  async getUsers(params?: { role?: string; status?: string; search?: string }): Promise<AdminUser[]> {
    try {
      const query = new URLSearchParams();
      if (params?.role) query.set('role', params.role);
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const res = await api.get<{ users: AdminUser[] }>(`/admin/users?${query}`);
      return res.data.users ?? [];
    } catch {
      return [];
    }
  },

  async updateUserStatus(userId: string, status: string): Promise<AdminUser> {
    const res = await api.patch<{ user: AdminUser }>(`/admin/users/${userId}/status`, { status });
    return res.data.user;
  },

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    const res = await api.patch<{ user: AdminUser }>(`/admin/users/${userId}/role`, { role });
    return res.data.user;
  },

  async getAuditLogs(params?: { page?: number; limit?: number; type?: string }): Promise<AuditLog[]> {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      if (params?.type) query.set('type', params.type);
      const res = await api.get<{ logs: AuditLog[] }>(`/admin/audit-logs?${query}`);
      return res.data.logs ?? [];
    } catch {
      return [];
    }
  },
};
