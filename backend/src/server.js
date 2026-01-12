require('dotenv').config();

const app = require('./app'); // 👈 THIS WAS MISSING

const PORT = process.env.PORT || 5000;
const pool = require('./config/db');

pool.query('SELECT 1')
  .then(() => console.log('DB test query successful'))
  .catch(err => console.error(err));


app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
