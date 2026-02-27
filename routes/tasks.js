const express = require('express');
const router = express.Router();

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let tasks = [
  { id: 1, title: 'Update quarterly report', dueDate: daysFromNow(-3), status: 'in-progress', priority: 'high' },
  { id: 2, title: 'Review pull requests', dueDate: daysFromNow(0), status: 'pending', priority: 'medium' },
  { id: 3, title: 'Fix login page CSS', dueDate: daysFromNow(7), status: 'pending', priority: 'low' },
  { id: 4, title: 'Database migration plan', dueDate: daysFromNow(-14), status: 'in-progress', priority: 'high' },
  { id: 5, title: 'Write API documentation', dueDate: daysFromNow(5), status: 'pending', priority: 'medium' },
];

let nextId = 6;

// GET /tasks — list all tasks, with optional status filter
router.get('/', (req, res) => {
  let result = tasks;

  if (req.query.status === 'overdue') {
    // BUG: string comparison instead of Date objects, and < instead of <=
    const today = new Date().toISOString().split('T')[0];
    result = tasks.filter(task =>
      task.status !== 'completed' && task.dueDate < today
    );
  } else if (req.query.status) {
    result = tasks.filter(task => task.status === req.query.status);
  }

  res.json(result);
});

// GET /tasks/:id — get a single task
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /tasks — create a new task
router.post('/', (req, res) => {
  const { title, dueDate, status = 'pending', priority = 'medium' } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'title and dueDate are required' });
  }
  const task = { id: nextId++, title, dueDate, status, priority };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /tasks/:id — update a task
router.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  Object.assign(task, req.body, { id: task.id });
  res.json(task);
});

// DELETE /tasks/:id — delete a task
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
