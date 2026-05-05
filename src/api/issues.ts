import { Issue, User } from '../types';
import { generateIssueId } from '../utils/idUtils';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Maya Chen',  initials: 'MC', email: 'maya@northwind.co' },
  { id: 'u2', name: 'Jin Park',   initials: 'JP', email: 'jin@northwind.co' },
  { id: 'u3', name: 'Tomas Alba', initials: 'TA', email: 'tomas@northwind.co' },
  { id: 'u4', name: 'Alex',       initials: 'AM', email: 'alex@northwind.co' },
];

const maya = MOCK_USERS[0];
const jin = MOCK_USERS[1];
const tomas = MOCK_USERS[2];
const alex = MOCK_USERS[3];

const MOCK_ISSUES: Issue[] = [
  {
    id: 'ISS-214',
    title: 'Onboarding tooltip overlaps avatar on iOS 17',
    description: 'When a user first opens the app on iOS 17, the onboarding tooltip appears behind the avatar component, causing a visual overlap that makes the tooltip unreadable.',
    status: 'Open',
    priority: 'High',
    assignee: maya,
    reporter: alex,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a1', actor: 'Alex', actorInitials: 'AM', action: 'created this issue', issueId: 'ISS-214', issueTitle: 'Onboarding tooltip overlaps avatar on iOS 17', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a2', actor: 'Alex', actorInitials: 'AM', action: 'assigned to Maya Chen', issueId: 'ISS-214', issueTitle: 'Onboarding tooltip overlaps avatar on iOS 17', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-213',
    title: 'Push notifications not delivered on Android 14',
    description: 'Users on Android 14 report that push notifications are not being delivered. The issue appears to be related to the new notification permission model introduced in Android 13+.',
    status: 'In Progress',
    priority: 'High',
    assignee: tomas,
    reporter: jin,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a3', actor: 'Jin Park', actorInitials: 'JP', action: 'created this issue', issueId: 'ISS-213', issueTitle: 'Push notifications not delivered on Android 14', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a4', actor: 'Tomas Alba', actorInitials: 'TA', action: 'changed status from Open → In Progress', issueId: 'ISS-213', issueTitle: 'Push notifications not delivered on Android 14', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-212',
    title: 'Search results flicker on fast typing',
    description: 'When a user types quickly in the search field, the results list flickers due to rapid state updates. Needs debounce or deferred rendering.',
    status: 'Open',
    priority: 'Medium',
    assignee: null,
    reporter: maya,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a5', actor: 'Maya Chen', actorInitials: 'MC', action: 'created this issue', issueId: 'ISS-212', issueTitle: 'Search results flicker on fast typing', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-211',
    title: 'CSV export drops rows when filter is active',
    description: 'When exporting issues to CSV with an active filter, the exported file only contains filtered rows instead of all issues. The export should always export all issues regardless of current filter state.',
    status: 'In Progress',
    priority: 'High',
    assignee: jin,
    reporter: alex,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a6', actor: 'Alex', actorInitials: 'AM', action: 'created this issue', issueId: 'ISS-211', issueTitle: 'CSV export drops rows when filter is active', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a7', actor: 'Jin Park', actorInitials: 'JP', action: 'changed status from Open → In Progress', issueId: 'ISS-211', issueTitle: 'CSV export drops rows when filter is active', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-210',
    title: 'Profile avatar not updating after image change',
    description: 'After a user changes their profile picture, the avatar in the header still shows the old image until the app is restarted.',
    status: 'Resolved',
    priority: 'Low',
    assignee: maya,
    reporter: tomas,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a8', actor: 'Tomas Alba', actorInitials: 'TA', action: 'created this issue', issueId: 'ISS-210', issueTitle: 'Profile avatar not updating after image change', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a9', actor: 'Maya Chen', actorInitials: 'MC', action: 'changed status from In Progress → Resolved', issueId: 'ISS-210', issueTitle: 'Profile avatar not updating after image change', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-209',
    title: 'Add empty state for filtered list',
    description: 'When filters are applied and there are no matching issues, the list area is blank with no feedback to the user. Needs an empty state component with a message and option to clear filters.',
    status: 'Open',
    priority: 'Medium',
    assignee: null,
    reporter: jin,
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a10', actor: 'Jin Park', actorInitials: 'JP', action: 'created this issue', issueId: 'ISS-209', issueTitle: 'Add empty state for filtered list', timestamp: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-208',
    title: 'Crash on logout with pending sync queue',
    description: 'If the user logs out while there are pending items in the offline sync queue, the app crashes with a null reference error. The logout flow should flush or discard the sync queue gracefully before clearing auth state.',
    status: 'Resolved',
    priority: 'High',
    assignee: alex,
    reporter: maya,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a11', actor: 'Maya Chen', actorInitials: 'MC', action: 'created this issue', issueId: 'ISS-208', issueTitle: 'Crash on logout with pending sync queue', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a12', actor: 'Alex', actorInitials: 'AM', action: 'changed status from Open → In Progress', issueId: 'ISS-208', issueTitle: 'Crash on logout with pending sync queue', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a13', actor: 'Alex', actorInitials: 'AM', action: 'changed status from In Progress → Resolved', issueId: 'ISS-208', issueTitle: 'Crash on logout with pending sync queue', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-207',
    title: 'Offline banner covers first list item',
    description: 'The offline warning banner slides down and overlaps the first issue card in the list, making it partially unreadable. The list should account for the banner height.',
    status: 'Open',
    priority: 'Medium',
    assignee: tomas,
    reporter: alex,
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a14', actor: 'Alex', actorInitials: 'AM', action: 'created this issue', issueId: 'ISS-207', issueTitle: 'Offline banner covers first list item', timestamp: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-206',
    title: 'Date picker crashes on Android API 21',
    description: 'The native date picker crashes on devices running Android API level 21 (Lollipop). Need to use a fallback date picker for older API levels.',
    status: 'Closed',
    priority: 'Medium',
    assignee: jin,
    reporter: tomas,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a15', actor: 'Tomas Alba', actorInitials: 'TA', action: 'created this issue', issueId: 'ISS-206', issueTitle: 'Date picker crashes on Android API 21', timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a16', actor: 'Jin Park', actorInitials: 'JP', action: 'changed status from Resolved → Closed', issueId: 'ISS-206', issueTitle: 'Date picker crashes on Android API 21', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-205',
    title: 'Dark mode contrast on priority chips',
    description: 'In dark mode, the priority chip labels are hard to read due to insufficient contrast between the text colour and chip background. The colour values need adjustment for WCAG AA compliance.',
    status: 'Open',
    priority: 'Low',
    assignee: null,
    reporter: alex,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a17', actor: 'Alex', actorInitials: 'AM', action: 'created this issue', issueId: 'ISS-205', issueTitle: 'Dark mode contrast on priority chips', timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-203',
    title: 'Keyboard dismissal breaks scroll position',
    description: 'When dismissing the keyboard on the issue form screen, the scroll view jumps to the top instead of maintaining its current position.',
    status: 'In Progress',
    priority: 'Medium',
    assignee: maya,
    reporter: jin,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a18', actor: 'Jin Park', actorInitials: 'JP', action: 'created this issue', issueId: 'ISS-203', issueTitle: 'Keyboard dismissal breaks scroll position', timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a19', actor: 'Maya Chen', actorInitials: 'MC', action: 'changed status from Open → In Progress', issueId: 'ISS-203', issueTitle: 'Keyboard dismissal breaks scroll position', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 'ISS-200',
    title: 'Token expiry does not redirect to sign in',
    description: 'When the auth token expires mid-session, API calls silently fail instead of clearing the session and redirecting the user to the sign-in screen.',
    status: 'Closed',
    priority: 'High',
    assignee: tomas,
    reporter: alex,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    activity: [
      { id: 'a20', actor: 'Alex', actorInitials: 'AM', action: 'created this issue', issueId: 'ISS-200', issueTitle: 'Token expiry does not redirect to sign in', timestamp: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a21', actor: 'Tomas Alba', actorInitials: 'TA', action: 'changed status from Resolved → Closed', issueId: 'ISS-200', issueTitle: 'Token expiry does not redirect to sign in', timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const fetchIssues = async (): Promise<Issue[]> => {
  await delay(800);
  return [...MOCK_ISSUES];
};

export const fetchIssueById = async (id: string): Promise<Issue> => {
  await delay(800);
  const issue = MOCK_ISSUES.find(i => i.id === id);
  if (!issue) throw new Error(`Issue ${id} not found`);
  return { ...issue };
};

export const createIssue = async (data: Partial<Issue>): Promise<Issue> => {
  await delay(800);
  const now = new Date().toISOString();
  const newIssue: Issue = {
    id: generateIssueId(),
    title: data.title ?? '',
    description: data.description ?? '',
    status: data.status ?? 'Open',
    priority: data.priority ?? 'Medium',
    assignee: data.assignee ?? null,
    reporter: data.reporter ?? MOCK_USERS[3],
    createdAt: now,
    updatedAt: now,
    attachments: data.attachments ?? [],
    activity: data.activity ?? [],
  };
  MOCK_ISSUES.unshift(newIssue);
  return { ...newIssue };
};

export const updateIssue = async (id: string, data: Partial<Issue>): Promise<Issue> => {
  await delay(800);
  const index = MOCK_ISSUES.findIndex(i => i.id === id);
  if (index === -1) throw new Error(`Issue ${id} not found`);
  const updated: Issue = { ...MOCK_ISSUES[index], ...data, updatedAt: new Date().toISOString() };
  MOCK_ISSUES[index] = updated;
  return { ...updated };
};
