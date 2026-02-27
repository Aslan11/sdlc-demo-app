const express = require('express');
const taskRoutes = require('./routes/tasks');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Task Tracker API', version: '1.0.0' });
});

app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Tracker API running on port ${PORT}`);
  });
}

module.exports = app;
