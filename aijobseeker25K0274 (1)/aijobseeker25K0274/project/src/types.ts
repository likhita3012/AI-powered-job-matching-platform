export type UserRole = 'job-seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  postedAt: string;
  skills: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
