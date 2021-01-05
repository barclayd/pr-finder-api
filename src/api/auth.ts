import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import bodyParser from 'body-parser';

enum Strategy {
  github = 'github',
}

const CALLBACK_URL = '/auth/github/callback';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `https://r997n84ck8.execute-api.eu-west-2.amazonaws.com/production${CALLBACK_URL}`,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log({ profile, accessToken, refreshToken });
      cb(null, {
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
  (_req, res) => {
    res.send('User successfully authenticated');
  },
);

const main = serverless(app);
exports.main = async (event, context) => {
  return await main(event, context);
};
