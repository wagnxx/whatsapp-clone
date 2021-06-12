const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../utils/authenMiddleware');
const sqlite = require('../config/db');
const path = require('path');
const { SuccessModel, ErrorModel } = require('../vo/resMode');

let refreshTokens = [];

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (refreshTokens.includes(refreshToken)) {
    console.log('未过期', refreshTokens);
    return res.sendStatus(403);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log('errr', err);
      return res.sendStatus(403);
    }
    const accessToken = generateAccessToken({ name: user.name });
    res.json(new SuccessModel({ accessToken }));
  });
});
/**
 * test api
 */
router.post('/getUser', async (req, res) => {
  const { username, password, email, uid } = req.body;

  await sqlite.open(path.join(__dirname, '..', 'whatsapp-clone.db'));
  var r = await sqlite.get('select * from users where name=? ', [username]);
  console.log(r);
  res.send(r);
});

router.post('/signUp', async (req, res) => {
  const { username, password, email, uid } = req.body;
  const user = { name: username, password, email, uid };

  await sqlite.open(path.join(__dirname, '..', 'whatsapp-clone.db'));

  var r = sqlite.run(
    'CREATE TABLE  IF NOT EXISTS users(id integer NOT NULL PRIMARY KEY, name text, email text,uid:chart(150))'
  );

  if (r) console.log('created table');

  r = await sqlite.get('select * from users where name=? ', [username]);

  if (r) return res.json(new ErrorModel('已存在用户名'));

  r = await sqlite.run(
    'insert into users (name,password,uid,email) values (?,?,?,?)',
    [username, password, uid, email]
  );

  if (!r) return res.json(new ErrorModel('Sign up失败'));

  res.json(new SuccessModel({ name: username }, '注册成功'));

  await sqlite.close();
});
router.post('/login', async (req, res) => {
  // Authenticate Users
  const { username, password, email, uid } = req.body;

  await sqlite.open(path.join(__dirname, '..', 'whatsapp-clone.db'));

  r = await sqlite.get('select * from users where name=? AND password=? ', [
    username,
    password,
  ]);

  if (!r) return res.json(new ErrorModel('登录失败'));

  const user = {
    name: r.name,
    uid: r.uid,
  };

  sqlite.close();

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json(new SuccessModel({ accessToken, refreshToken, ...user }));
});

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});
const posts = [
  { username: 'Kyle', title: 'Post 1' },
  { username: 'Jim', title: 'Post 2' },
];
router.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1500s',
  });
}

module.exports = router;
