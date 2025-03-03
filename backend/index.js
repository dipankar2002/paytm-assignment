require('dotenv').config();
const express = require("express");
const mainRoute = require('./routes/mainRoute');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', mainRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});