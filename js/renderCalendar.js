import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
    getFirestore, collection, getDocs
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAsMNnGQPgpQtykLXadrfhRVQt3zk4NM8k",
    authDomain: "tareas-todolist.firebaseapp.com",
    projectId: "tareas-todolist",
    storageBucket: "tareas-todolist.firebasestorage.app",
    messagingSenderId: "907655812218",
    appId: "1:907655812218:web:289b478ff63d003a6697c3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Renderizar calendario
document.addEventListener('DOMContentLoaded', async () => {
    const calendarEl = document.getElementById('calendar');
    const tareasSnapshot = await getDocs(collection(db, 'tareas'));

    const eventos = [];

    tareasSnapshot.forEach(doc => {
        const tarea = doc.data();
        if (tarea.fechaFin) {
            eventos.push({
                title: tarea.nombre,
                start: tarea.fechaFin, // o tarea.fechaInicio si preferís
                backgroundColor: getEstadoColor(tarea.estado),
                borderColor: '#000',
                allDay: true,
            });
        }
    });

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        events: eventos,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek'
        },
    });

    calendar.render();

    // Modal handling
    const modal = document.getElementById('taskModal');
    const closeModal = document.getElementById('closeModal');

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Evento al hacer clic en una tarea del calendario
    calendar.on('eventClick', function (info) {
        const task = info.event.extendedProps;

        document.getElementById('modalTitle').textContent = info.event.title;
        document.getElementById('modalStatus').textContent = task.estado;
        document.getElementById('modalObjective').textContent = task.objetivo || '—';
        document.getElementById('modalStartDate').textContent = formatDate(task.fechaInicio);
        document.getElementById('modalEndDate').textContent = formatDate(task.fechaFin);

        modal.classList.remove('hidden');
    });

    function formatDate(fecha) {
        const [year, month, day] = fecha.split("-");
        return `${day}-${month}-${year}`;
    }

});

function getEstadoColor(estado) {
  switch (estado) {
    case 'Sin iniciar': return '#facc15';   // amarillo
    case 'En proceso': return '#60a5fa';    // azul
    case 'Finalizada': return '#34d399';    // verde
    default: return '#d1d5db';              // gris
  }
}