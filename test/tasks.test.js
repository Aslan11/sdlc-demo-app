const { describe, it } = require('node:test');
const assert = require('node:assert');

// Inline helper matching routes/tasks.js
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('Overdue filter logic', () => {
  const tasks = [
    { id: 1, title: 'Past due task', dueDate: daysFromNow(-3), status: 'in-progress' },
    { id: 2, title: 'Due today task', dueDate: daysFromNow(0), status: 'pending' },
    { id: 3, title: 'Future task', dueDate: daysFromNow(7), status: 'pending' },
    { id: 4, title: 'Old overdue task', dueDate: daysFromNow(-14), status: 'in-progress' },
    { id: 5, title: 'Completed past task', dueDate: daysFromNow(-5), status: 'completed' },
  ];

  it('should include tasks due today as overdue', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const due = new Date(task.dueDate + 'T00:00:00');
      return due <= today;
    });

    const titles = overdue.map(t => t.title);
    assert.ok(titles.includes('Due today task'),
      'Tasks due today should be considered overdue');
  });

  it('should include past-due tasks as overdue', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const due = new Date(task.dueDate + 'T00:00:00');
      return due <= today;
    });

    assert.ok(overdue.length >= 2,
      'Should have at least 2 overdue tasks (past due ones)');
    const titles = overdue.map(t => t.title);
    assert.ok(titles.includes('Past due task'));
    assert.ok(titles.includes('Old overdue task'));
  });

  it('should NOT include future tasks as overdue', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const due = new Date(task.dueDate + 'T00:00:00');
      return due <= today;
    });

    const titles = overdue.map(t => t.title);
    assert.ok(!titles.includes('Future task'),
      'Future tasks should not be overdue');
  });

  it('should NOT include completed tasks as overdue', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const due = new Date(task.dueDate + 'T00:00:00');
      return due <= today;
    });

    const titles = overdue.map(t => t.title);
    assert.ok(!titles.includes('Completed past task'),
      'Completed tasks should never be overdue');
  });

  it('should find exactly 3 overdue tasks (past + today)', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(task => {
      if (task.status === 'completed') return false;
      const due = new Date(task.dueDate + 'T00:00:00');
      return due <= today;
    });

    assert.strictEqual(overdue.length, 3,
      'Expected 3 overdue tasks: past due (id 1), today (id 2), old overdue (id 4)');
  });
});
