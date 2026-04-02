export const GITLAB_ACCOUNTS = {
  accounts: [
    { username: "raflibima1106", token: process.env.GITLAB_READ_USER_TOKEN_PERSONAL_RAFLIBIMA1106 },
    { username: "raflibima.sangkuriang", token: process.env.GITLAB_READ_USER_TOKEN_PERSONAL_SANGKURIANG }
  ],
  usernames: ["raflibima1106", "raflibima.sangkuriang"], // Kept for backward compat with UI subtitle
  endpoint: "/api/gitlab",
  gitlab_url: "https://gitlab.com",
  is_active: true,
};
