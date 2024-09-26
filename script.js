document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const markAllCompleteBtn = document.getElementById('mark-all-complete-btn');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const renderTasks = (filter = 'all') => {
        taskList.innerHTML = '';
        let filteredTasks = tasks;
        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        }
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleCompleteTask(task.name));
            const span = document.createElement('span');
            span.textContent = task.name;
            span.classList.toggle('completed', task.completed);
            span.addEventListener('dblclick', () => editTask(task.name));

            li.appendChild(checkbox);
            li.appendChild(span);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteTask(task.name));
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });
    };

    const addTask = () => {
        const taskName = taskInput.value.trim();
        if (taskName === '') return;
        tasks.push({ name: taskName, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    };

    const toggleCompleteTask = (taskName) => {
        tasks = tasks.map(task =>
            task.name === taskName ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    const editTask = (taskName) => {
        const newTaskName = prompt('Edit Task:', taskName);
        if (newTaskName) {
            tasks = tasks.map(task =>
                task.name === taskName ? { ...task, name: newTaskName } : task
            );
            saveTasks();
            renderTasks();
        }
    };

    const deleteTask = (taskName) => {
        tasks = tasks.filter(task => task.name !== taskName);
        saveTasks();
        renderTasks();
    };

    const markAllComplete = () => {
        tasks = tasks.map(task => ({ ...task, completed: true }));
        saveTasks();
        renderTasks();
    };

    const clearCompletedTasks = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    addTaskBtn.addEventListener('click', addTask);
    markAllCompleteBtn.addEventListener('click', markAllComplete);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            renderTasks(filter);
        });
    });

    renderTasks();
});
