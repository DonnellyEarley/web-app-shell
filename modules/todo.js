const STORAGE_KEY = 'webappshell:tasks:v1';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskNode(task) {
  const wrap = document.createElement('article');
  wrap.className = 'task-item' + (task.completed ? ' completed' : '');
  wrap.dataset.id = task.id;

  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.checked = !!task.completed;
  chk.addEventListener('change', () => toggleComplete(task.id));

  const label = document.createElement('div');
  label.className = 'task-label';

  const title = document.createElement('div');
  title.textContent = task.title;

  label.appendChild(title);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.title = 'Edit Task';
  editBtn.innerHTML = '<i data-feather="edit-3" style="color:black"></i>';
  editBtn.addEventListener('click', () => startEdit(task.id));

  const delBtn = document.createElement('button');
  delBtn.title = 'Delete Task';
  delBtn.innerHTML = '<i data-feather="trash-2" style="color:red"></i>';
  delBtn.addEventListener('click', () => removeTask(task.id));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  wrap.appendChild(chk);
  wrap.appendChild(label);
  wrap.appendChild(actions);

  return wrap;
}

let tasks = loadTasks();
let filter = 'all';

function render() {
  const container = document.getElementById('tasks-list');
  if (!container) return;
  container.innerHTML = '';

  const list = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return !!t.completed;
    return true;
  });

  list.forEach(t => container.appendChild(createTaskNode(t)));
  updateCount();

  // Replace any newly-added feather placeholders with SVGs
  try {
    if (window.feather && typeof window.feather.replace === 'function') {
      window.feather.replace({ 'aria-hidden': 'true' });
    }
  } catch (e) {
    // ignore if feather is not available yet
  }
}

function updateCount() {
  const el = document.getElementById('task-count');
  if (!el) return;
  el.textContent = tasks.length;
}

function addTask(title) {
  const newTask = { id: uid(), title: title.trim(), completed: false, createdAt: Date.now() };
  tasks.unshift(newTask);
  saveTasks(tasks);
  render();
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  render();
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks(tasks);
  render();
}

function startEdit(id) {
  const item = tasks.find(t => t.id === id);
  if (!item) return;
  const node = document.querySelector(`.task-item[data-id="${id}"]`);
  if (!node) return;

  const label = node.querySelector('.task-label');
  label.innerHTML = '';
  const input = document.createElement('input');
  input.className = 'task-edit-input';
  input.value = item.title;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => finishEdit(id, input.value));

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => render());

  label.appendChild(input);
  label.appendChild(saveBtn);
  label.appendChild(cancelBtn);
  input.focus();
}

function finishEdit(id, newTitle) {
  tasks = tasks.map(t => t.id === id ? { ...t, title: newTitle.trim() || t.title } : t);
  saveTasks(tasks);
  render();
}

function setFilter(value) {
  filter = value;
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  render();

  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const select = document.getElementById('filter-select');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
      addTask(input.value);
      input.value = '';
    });
  }

  if (select) {
    select.addEventListener('change', (e) => setFilter(e.target.value));
  }
});

export { addTask, removeTask };
