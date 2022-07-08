/* eslint import/no-extraneous-dependencies: "error" */
const express = require('express');

const app = express();
const APP_PORT = process.env.PORT;

app.use('/static', express.static('static'));
app.use('/', express.static('build', { index: 'main.html' }));

app.get('/', (req, res) => {
  res.send('Request has been made');
});

app.get('*', (req, res) => {
  res.sendFile('main.html', {root: './build'});
});

app.listen(APP_PORT, () => {
  //  eslint-disable-next-line no-console
  console.log(`Listening on port ${APP_PORT}`);
});
