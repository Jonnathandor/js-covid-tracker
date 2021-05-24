const express = require('express');
const axios = require('axios').default;
const app = express();
const cors = require('cors')
const port = 3000;

app.use(cors())

app.get('/countries', (req, res) => {
  axios.get('https://corona.lmao.ninja/v2/countries')
  .then(response => {
    res.send(response.data);
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})