import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import express from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http';
import { GithubUser, PRWebhook } from '../types';
import { EncoderService } from '../services/Encoder';

enum Strategy {
  github = 'github',
}

const CALLBACK_URL = '/auth/github/callback';
const VSCODE_SERVER = 'http://localhost:54321/auth';

const app = express();
app.use(passport.initialize());
app.use(bodyParser.json());
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `https://r997n84ck8.execute-api.eu-west-2.amazonaws.com/production${CALLBACK_URL}`,
      scope: ['repo', 'read:org'],
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, {
        profile,
        accessToken,
        refreshToken,
      });
    },
  ),
);

app.get('/auth', (_req, res) => {
  res.send('Hello, world');
});

app.get(
  '/auth/github',
  passport.authenticate(Strategy.github, {
    session: false,
  }),
);

app.post('/auth/github/webhook', (req, res) => {
  const { pull_request, repository } = req.body as PRWebhook;
  const prData = {
    repo: repository.html_url,
    pull_request: {
      url: pull_request.url,
      title: pull_request.title,
      author: {
        login: pull_request.user.login,
        avatar: pull_request.user.avatar_url,
        url: pull_request.user.html_url,
      },
      state: pull_request.state,
    },
  };
  const encodedData = EncoderService.encode(prData);
  res.redirect(`${VSCODE_SERVER}/${encodedData}`);
});

app.get(
  CALLBACK_URL,
  passport.authenticate(Strategy.github, {
    session: false,
  }),
  (req, res) => {
    const { profile, accessToken } = req.user as GithubUser;
    const { displayName, username, profileUrl, _json } = profile;
    const userData = {
      displayName,
      username,
      profileUrl,
      imageUrl: _json.avatar_url,
      organisationUrl: _json.organizations_url,
      accessToken,
    };
    const encodedData = EncoderService.encode(userData);
    res.redirect(`${VSCODE_SERVER}/${encodedData}`);
  },
);

exports.main = serverless(app);
