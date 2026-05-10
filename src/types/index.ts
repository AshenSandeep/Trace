export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'High' | 'Medium' | 'Low';

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
}

export interface Attachment {
  id: string;
  name: string;
  uri: string;
  type: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  actorInitials: string;
  action: string;         // e.g. "changed status from Open → In Progress"
  issueId: string;
  issueTitle: string;
  timestamp: string;      // ISO string
}

export interface Issue {
  id: string;             // e.g. "ISS-214"
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: User | null;
  reporter: User;
  createdAt: string;      // ISO string
  updatedAt: string;      // ISO string
  attachments: Attachment[];
  activity: ActivityItem[];
}

export interface IssueFilters {
  search: string;
  status: IssueStatus[];
  priority: IssuePriority[];
  assignee: string[];     // user IDs
}

export interface SyncQueueItem {
  id: string;
  type: 'create' | 'update';
  payload: Partial<Issue>;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}