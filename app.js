const express = require('express');
const connection = require('./db');
const app = express();

app.use(express.json());

// POST /recipes - Create a new recipe
app.post('/recipes', (req, res) => {
  const { title, making_time, serves, ingredients, cost } = req.body;

  if (!title || !making_time || !serves || !ingredients || !cost) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'INSERT INTO recipes (title, making_time, serves, ingredients, cost) VALUES (?, ?, ?, ?, ?)';
  const values = [title, making_time, serves, ingredients, cost];

  connection.query(query, values, (err, result) => {
    if (err) throw err;

    const recipe = { id: result.insertId, title, making_time, serves, ingredients, cost };
    res.status(200).json({ message: 'Recipe successfully created!', recipe });
  });
});

// GET /recipes - Get all recipes
app.get('/recipes', (req, res) => {
  connection.query('SELECT * FROM recipes', (err, results) => {
    if (err) throw err;
    res.status(200).json({ recipes: results });
  });
});

// GET /recipes/:id - Get a specific recipe by ID
app.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM recipes WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe: results[0] });
  });
});

// PATCH /recipes/:id - Update a recipe by ID
app.patch('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const query = 'UPDATE recipes SET ? WHERE id = ?';
  connection.query(query, [updates, id], (err, result) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe successfully updated!' });
  });
});

// DELETE /recipes/:id - Delete a recipe by ID
app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM recipes WHERE id = ?';

  connection.query(query, [id], (err, result) => {
    if (err) throw err;

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe successfully removed!' });
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
