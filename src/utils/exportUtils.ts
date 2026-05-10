import { Issue } from '../types';

export const exportToJSON = (issues: Issue[]): string =>
  JSON.stringify(issues, null, 2);

const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportToCSV = (issues: Issue[]): string => {
  const headers = ['ID', 'Title', 'Status', 'Priority', 'Assignee', 'Reporter', 'Created', 'Updated'];
  const rows = issues.map(issue =>
    [
      issue.id,
      issue.title,
      issue.status,
      issue.priority,
      issue.assignee?.name ?? 'Unassigned',
      issue.reporter.name,
      issue.createdAt,
      issue.updatedAt,
    ]
      .map(String)
      .map(escapeCSV)
      .join(','),
  );
  return [headers.join(','), ...rows].join('\n');
};
