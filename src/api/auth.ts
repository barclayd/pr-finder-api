import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import express from 'express';
import serverless from 'serverless-http';
import { GithubUser } from '../types';

enum Strategy {
  github = 'github',
}

const CALLBACK_URL = '/auth/github/callback';
const VSCODE_SERVER = 'http://localhost:54321/auth';

const app = express();
app.use(passport.initialize());
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `https://r997n84ck8.execute-api.eu-west-2.amazonaws.com/production${CALLBACK_URL}`,
      scope: ['repo', 'read:org'],
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log({ profile, accessToken, refreshToken });
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
    const encodedData = Buffer.from(JSON.stringify(userData)).toString(
      'base64',
    );
    const uriEncode = encodeURIComponent(encodedData);
    res.redirect(`${VSCODE_SERVER}/${uriEncode}`);
  },
);

exports.main = serverless(app);
