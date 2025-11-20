import { query } from '../../db/index.js';

const signup = (firstName, lastName, email, createdAt, updatedAt, hashedPassword) =>
  query(
    'INSERT INTO users (first_name, last_name, email, created_at, updated_at, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [firstName, lastName, email, createdAt, updatedAt, hashedPassword],
  );

const signin = (email) => query('SELECT * FROM users WHERE email = $1', [email]);

const delAccount = (userId) => query('DELETE FROM users WHERE user_id = $1', [userId]);

const updatePassword = (userId, hashedPassword) =>
  query('UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *', [hashedPassword, userId]);

const emailExists = (email) => query('SELECT email FROM users WHERE email = $1', [email]);

const updateName = (userId, firstName, lastName) =>
  query(
    'UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 RETURNING *',
    [firstName, lastName, userId],
  );

const getUserById = (userId) => query('SELECT * FROM users WHERE user_id = $1', [userId]);

export { signup, signin, updatePassword, updateName, emailExists, getUserById, delAccount };
