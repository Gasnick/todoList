document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.querySelector('.agregar-tareas form');
  const taskListTable = document.querySelector('.listado-tareas table');
  const searchInput = document.querySelector('.filtro-busqueda-nombre-prioridad input');
  const statusCheckboxes = document.querySelectorAll('.filtro-estado input[type="checkbox"]');

  let tasks = [];
  let editIndex = -1;

  // Load tasks from localStorage
  function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
    }
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Map checkbox values to task.estado values if needed
  const statusValueMap = {
    'Sin iniciar': 'Sin iniciar',
    'En proceso': 'En proceso',
    'Finalizada': 'Finalizada'
  };

  // Render tasks in the table
  function renderTasks(filterText = '', filterStatuses = []) {
    // Normalize filter statuses to match task.estado values
    const normalizedFilterStatuses = filterStatuses.map(s => statusValueMap[s] || s);

    // Clear existing rows except header
    const rows = taskListTable.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => row.remove());

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
      const matchesText = task.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
                          task.prioridad.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus = normalizedFilterStatuses.length === 0 || normalizedFilterStatuses.includes(task.estado);
      return matchesText && matchesStatus;
    });

    // Add rows
    filteredTasks.forEach((task, index) => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${task.nombre}</td>
        <td>${task.prioridad}</td>
        <td>${task.estado}</td>
        <td>${task.objetivo}</td>
        <td>${task.fechaInicio}</td>
        <td>${task.fechaFin}</td>
        <td class="acciones">
          <img src="assets/icons/edit.png" alt="Editar" class="icono accion-editar" data-index="${index}" style="cursor:pointer;">
          <img src="assets/icons/delete.png" alt="Eliminar" class="icono accion-eliminar" data-index="${index}" style="cursor:pointer;">
        </td>
      `;

      taskListTable.appendChild(row);
    });

    // Attach event listeners for delete
    const deleteButtons = taskListTable.querySelectorAll('.accion-eliminar');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks(searchInput.value, getSelectedStatuses());
      });
    });
    // Attach event listeners for edit
    const editButtons = taskListTable.querySelectorAll('.accion-editar');
    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        editIndex = idx;
        const task = tasks[idx];
        taskForm.querySelector('#nom_tarea').value = task.nombre;
        taskForm.querySelector('#select_estado').value = task.estado;
        taskForm.querySelector('#objetivo_tarea').value = task.objetivo;
        taskForm.querySelector('#select_prioridad').value = task.prioridad;
        taskForm.querySelector('#detalle_tarea').value = task.detalle;
        taskForm.querySelector('#fecha_i').value = task.fechaInicio;
        taskForm.querySelector('#fecha_f').value = task.fechaFin;
        taskForm.querySelector('#confirmar_tarea').textContent = 'Actualizar';
      });
    });

  }

  // Get selected statuses from checkboxes
  function getSelectedStatuses() {
    const selected = [];
    statusCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selected.push(checkbox.value);
      }
    });
    return selected;
  }

  // Handle form submission to add or update task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = taskForm.querySelector('#nom_tarea').value.trim();
    const estado = taskForm.querySelector('#select_estado').value;
    const objetivo = taskForm.querySelector('#objetivo_tarea').value.trim();
    const prioridad = taskForm.querySelector('#select_prioridad').value;
    const detalle = taskForm.querySelector('#detalle_tarea').value.trim();
    const fechaInicio = taskForm.querySelector('#fecha_i').value;
    const fechaFin = taskForm.querySelector('#fecha_f').value;

    if (!nombre) {
      alert('Por favor, ingresa el nombre de la tarea.');
      return;
    }

    const newTask = {
      nombre,
      estado,
      objetivo,
      prioridad,
      detalle,
      fechaInicio,
      fechaFin
    };

    if (editIndex === -1) {
      // Add new task
      tasks.push(newTask);
    } else {
      // Update existing task
      tasks[editIndex] = newTask;
      editIndex = -1;
      taskForm.querySelector('#confirmar_tarea').textContent = 'Confirmar';
    }

    saveTasks();
    renderTasks(searchInput.value, getSelectedStatuses());
    taskForm.reset();
  });

  // Handle search input
  searchInput.addEventListener('input', () => {
    renderTasks(searchInput.value, getSelectedStatuses());
  });

  // Handle status filter checkboxes
  statusCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      renderTasks(searchInput.value, getSelectedStatuses());
    });
  });

  // Initial load
  loadTasks();
  renderTasks();
});
