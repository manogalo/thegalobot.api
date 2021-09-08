const express = require('express');
const routes = require('./src/routes')
const app = express();
const port = 3000;

app.use(routes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`));