import { UserRole } from '../types/crm';

export interface UserAccount {
  name: UserRole;
  password: string;
  role: 'admin' | 'caller';
  label: string;
  description: string;
}

export const ACCOUNTS: Record<UserRole, UserAccount> = {
  Admin: {
    name: 'Admin',
    password: 'Siyara123',
    role: 'admin',
    label: 'Manager',
    description: 'Overview dashboard, analytics, batch import & master database',
  },
  'Sneha': {
    name: 'Sneha',
    password: 'Siyara123',
    role: 'caller',
    label: 'Sneha',
    description: 'Cold call desk, lead queue & call outcomes',
  },
  'Aditya': {
    name: 'Aditya',
    password: 'Siyara123',
    role: 'caller',
    label: 'Aditya',
    description: 'Cold call desk, lead queue & call outcomes',
  },
};
