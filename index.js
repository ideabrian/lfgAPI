const express = require('express');
const { Pool } = require('pg');

// Initialize Express
const app = express();
app.use(express.json());

// Initialize PostgreSQL pool
const pool = new Pool({
  user: 'brianball',
  host: 'localhost',
  database: 'api',
  port: 5432
});

// Create a new user
app.post('/user', async (req, res) => {
  const { username, email, password } = req.body;
  const result = await pool.query("INSERT INTO user_profiles (username, email, password) VALUES ($1, $2, $3) RETURNING id", [username, email, password]);
  res.json({ id: result.rows[0].id });
});

// Read user by username
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  const result = await pool.query("SELECT * FROM user_profiles WHERE username = $1", [username]);
  res.json(result.rows[0]);
});

// Update user password
app.put('/user/:username', async (req, res) => {
  const { username } = req.params;
  const { newPassword } = req.body;
  await pool.query("UPDATE user_profiles SET password = $1 WHERE username = $2", [newPassword, username]);
  res.json({ message: "Password updated" });
});

// Delete user by username
app.delete('/user/:username', async (req, res) => {
  const { username } = req.params;
  await pool.query("DELETE FROM user_profiles WHERE username = $1", [username]);
  res.json({ message: "User deleted" });
});

app.get('/*', async (req, res) => {
  res.json( { message: "the Express server is up and running."})
})

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});
