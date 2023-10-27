'use strict';
 
const express = require('express');
 
// Constants
const PORT = 9090;
const HOST = '0.0.0.0';

const MCREDS_HOST = process.env.MCREDS_HOST || 'http://127.0.0.1:8080'
 
// App
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World from Leaderboard Mobile BFF');
});

app.get('/leaderboard-mobile-bff/games/:gameId/ranking', async (req, res) => {
  console.log(`/leaderboard-mobile-bff/games/:gameId/ranking`);
  try {
    const url = `${MCREDS_HOST}/voting/games/${req.params.gameId}/top-votes`;
    console.log('Fetch: ' + url);
    const topVotesRes = await fetch(url);
    const usersArray = [];
    if (topVotesRes.ok) {
      let i = 0;
      const data = await topVotesRes.json();
      for (const user of data.topVoters) {
        const userUrl = `${MCREDS_HOST}/users/${user.userId}`
        console.log('Fetch: ' + userUrl);
        const userRes = await fetch(userUrl);
        const userResJson = await userRes.json();
        user.name = userResJson?.firstName;
        user.state = userResJson?.state;
        i++;
        usersArray.push(user);
        if (i === 2) {
          data.topVoters = usersArray;
          break;
        }
      }
      console.log(data);
      res.send(data);
    }
  } catch (error) {
    console.log('Error in leaderboard-mobile-bff', error);
    res.send('Error');
  }
});

app.get('/leaderboard-web-bff/games/:gameId/ranking', async (req, res) => {
  console.log(`/leaderboard-web-bff/games/:gameId/ranking`);
  try {
    const url = `${MCREDS_HOST}/voting/games/${req.params.gameId}/top-votes`;
    console.log('Fetch: ' + url);
    const topVotesRes = await fetch(url);
    if (topVotesRes.ok) {
      const data = await topVotesRes.json();
      console.log(data);
      for (const user of data?.topVoters) {
        const userUrl = `${MCREDS_HOST}/users/${user.userId}`
        console.log('Fetch: ' + userUrl);
        const userRes = await fetch(userUrl);
        const userResJson = await userRes.json();
        user.name = userResJson.firstName + ' ' + userResJson.lastName;
        user.age = userResJson.age;
        user.city =  userResJson.city;
        user.state = userResJson.state;
      }
      console.log(data);
      res.send(data);
    }
  } catch (error) {
    console.log('Error in leaderboard-web-bff', error);
    res.send('Error');
  }
});


app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});