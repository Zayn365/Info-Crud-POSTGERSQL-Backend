const route = require('express').Router();
const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.POSTSQL_USER,
  host: process.env.POSTSQL_HOST,
  database: process.env.POSTSQL_DB,
  password: process.env.POSTSQL_PASSWORD,
  port: process.env.POSTSQL_PORT,
});


route.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// POST a new record
route.post('/', async (req, res) => {
  try {
    const { name, position, office, experience, startDate, salary } = req.body;
    const result = await pool.query(
      'INSERT INTO employees (name, position, office, experience, start_date, salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, position, office, experience, startDate, salary]
    );

    const newRecord = result.rows[0];
    res.status(201).json({ message: 'Record created successfully', record: newRecord });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});


route.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, position, office, experience, startDate, salary } = req.body;

    const result = await pool.query(
      'UPDATE employees SET name=$1, position=$2, office=$3, experience=$4, start_date=$5, salary=$6 WHERE id=$7 RETURNING *',
      [name, position, office, experience, startDate, salary, id]
    );

    const updatedRecord = result.rows[0];
    res.status(200).json({ message: 'Record updated successfully', record: updatedRecord });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
});


route.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

module.exports = route;
