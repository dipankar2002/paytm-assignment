const express = require("express");
const mainRoute = require('./routes/mainRoute');

const app = express();
const port = 3000;

app.use('api/v1', mainRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});