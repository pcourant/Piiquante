import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const MY_PORT = process.env.PORT;
const MY_APP_SECRET = process.env.APP_SECRET;

app.get('/', (req, res) => {
  return res.send(MY_APP_SECRET);
});

app.listen(MY_PORT, () => console.log(`Server running on port ${MY_PORT}`));
