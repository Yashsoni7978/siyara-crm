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
    password: 'changeme1',
    role: 'admin',
    label: 'Admin / Founder',
    description: 'Overview dashboard, analytics, batch import & master database',
  },
  'User 1': {
    name: 'User 1',
    password: 'changeme2',
    role: 'caller',
    label: 'User 1',
    description: 'Cold call desk, lead queue & call outcomes',
  },
  'User 2': {
    name: 'User 2',
    password: 'changeme3',
    role: 'caller',
    label: 'User 2',
    description: 'Cold call desk, lead queue & call outcomes',
  },
};
