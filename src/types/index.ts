export interface GithubUser {
  profile: GithubUserProfile;
  accessToken: string;
}

interface GithubUserProfile {
  displayName: string;
  username: string;
  profileUrl: string;
  _json: {
    avatar_url: string;
    organizations_url: string;
  };
}

export interface PRWebhook {
  pull_request: {
    state: string;
    url: string;
    title: string;
    user: {
      login: string;
      avatar_url: string;
      html_url: string;
    };
  };
  repository: {
    html_url: string;
  };
}
