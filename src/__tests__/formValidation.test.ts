import { generateIssueId } from '../utils/idUtils';
import { formatRelativeTime } from '../utils/dateUtils';

// Mirrors authStore.login() — email must contain '@'
const isValidEmail = (email: string): boolean => email.includes('@');

// Mirrors authStore.login() — password must be >= 6 chars
const isValidPassword = (password: string): boolean => password.length >= 6;

// Mirrors IssueFormScreen handleSave() — title.trim() must be >= 3 chars
const isValidTitle = (title: string): boolean => title.trim().length >= 3;

// Helper: ISO string for a timestamp N milliseconds ago
const msAgo = (ms: number): string => new Date(Date.now() - ms).toISOString();

// ─── Email validation ─────────────────────────────────────────────────────────

describe('Email validation', () => {
  it('passes for a valid work email', () => {
    expect(isValidEmail('alex@northwind.co')).toBe(true);
  });

  it('passes for any string containing @', () => {
    expect(isValidEmail('a@b')).toBe(true);
  });

  it('fails when @ is missing', () => {
    expect(isValidEmail('alexnorthwind.co')).toBe(false);
  });

  it('fails for an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

// ─── Password validation ──────────────────────────────────────────────────────

describe('Password validation', () => {
  it('passes for exactly 6 characters', () => {
    expect(isValidPassword('abc123')).toBe(true);
  });

  it('passes for more than 6 characters', () => {
    expect(isValidPassword('supersecret')).toBe(true);
  });

  it('fails for 5 characters', () => {
    expect(isValidPassword('abc12')).toBe(false);
  });

  it('fails for an empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });
});

// ─── Issue title validation ───────────────────────────────────────────────────

describe('Issue title validation', () => {
  it('passes for exactly 3 characters', () => {
    expect(isValidTitle('Bug')).toBe(true);
  });

  it('passes for a normal title', () => {
    expect(isValidTitle('Crash on logout')).toBe(true);
  });

  it('fails for 2 characters', () => {
    expect(isValidTitle('AB')).toBe(false);
  });

  it('fails for an empty string', () => {
    expect(isValidTitle('')).toBe(false);
  });

  it('fails for whitespace-only strings', () => {
    expect(isValidTitle('   ')).toBe(false);
  });

  it('trims whitespace before checking length', () => {
    expect(isValidTitle('  AB  ')).toBe(false);
    expect(isValidTitle('  ABC  ')).toBe(true);
  });
});

// ─── generateIssueId ─────────────────────────────────────────────────────────

describe('generateIssueId', () => {
  it('returns a string matching ISS-XXX format', () => {
    const id = generateIssueId();
    expect(id).toMatch(/^ISS-\d{3,}$/);
  });

  it('returns a different ID on each call', () => {
    const id1 = generateIssueId();
    const id2 = generateIssueId();
    expect(id1).not.toBe(id2);
  });

  it('increments the numeric part on each call', () => {
    const id1 = generateIssueId();
    const id2 = generateIssueId();
    const num1 = parseInt(id1.replace('ISS-', ''), 10);
    const num2 = parseInt(id2.replace('ISS-', ''), 10);
    expect(num2).toBe(num1 + 1);
  });
});

// ─── formatRelativeTime ───────────────────────────────────────────────────────

describe('formatRelativeTime', () => {
  it('returns "just now" for timestamps less than 1 minute ago', () => {
    expect(formatRelativeTime(msAgo(30_000))).toBe('just now');
  });

  it('returns "Xm ago" for timestamps in the last hour', () => {
    expect(formatRelativeTime(msAgo(5 * 60_000))).toBe('5m ago');
    expect(formatRelativeTime(msAgo(59 * 60_000))).toBe('59m ago');
  });

  it('returns "Xh ago" for timestamps in the last 24 hours', () => {
    expect(formatRelativeTime(msAgo(2 * 3_600_000))).toBe('2h ago');
    expect(formatRelativeTime(msAgo(23 * 3_600_000))).toBe('23h ago');
  });

  it('returns "Xd ago" for timestamps in the last 7 days', () => {
    expect(formatRelativeTime(msAgo(2 * 86_400_000))).toBe('2d ago');
    expect(formatRelativeTime(msAgo(6 * 86_400_000))).toBe('6d ago');
  });

  it('returns a formatted date for timestamps older than 7 days', () => {
    const result = formatRelativeTime(msAgo(8 * 86_400_000));
    // Falls back to formatDate — should not contain "ago"
    expect(result).not.toContain('ago');
    expect(result.length).toBeGreaterThan(0);
  });
});
