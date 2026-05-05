import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
};

export type IssuesStackParamList = {
  IssueList: undefined;
  IssueDetail: { issueId: string };
  IssueForm: { issueId?: string };
};

export type MainTabParamList = {
  DashboardTab: undefined;
  IssuesTab: NavigatorScreenParams<IssuesStackParamList>;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
