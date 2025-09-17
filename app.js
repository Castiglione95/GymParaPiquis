// app.js
// Renombrado a GYM para Piquis

class GymTracker {
  constructor() {
    this.currentView = 'dashboard';
    this.currentPath = [];
    this.currentWorkout = null;
    this.currentExerciseIndex = 0;
    this.editMode = false;
    this.selectedColorEsfuerzo = null;
    this.workoutInProgress = false;
    this.autoBackupInterval = null;
    this.rutinaTemp = [];

    console.log('Inicializando GYM para Piquis...');
    this.initializeData();
    this.bindAllEvents();
    this.startAutoBackup();
    this.showToast('¡GYM para Piquis cargado!', 'success');
  }

  initializeData() {
    // Aquí iría la carga de datos desde localStorage u otra fuente
    console.log('Datos inicializados');
  }

  bindAllEvents() {
    this.safeBindEvent('quick-workout-btn', 'click', () => {
      this.startWorkout();
    });
    this.safeBindEvent('biblioteca-btn', 'click', () => {
      this.navigate('biblioteca');
    });
    this.safeBindEvent('historial-btn', 'click', () => {
      this.navigate('historial');
    });
    this.safeBindEvent('rutinas-btn', 'click', () => {
      this.navigate('rutinas');
    });
    console.log('Eventos vinculados');
  }

  safeBindEvent(elementId, event, handler) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener(event, handler);
      console.log(`✓ Evento ${event} vinculado a ${elementId}`);
      return true;
    } else {
      console.warn(`✗ Elemento ${elementId} no encontrado`);
      return false;
    }
  }

  startWorkout() {
    this.workoutInProgress = true;
    this.showToast('Entrenamiento iniciado', 'info');
    console.log('Entrenamiento en progreso...');
  }

  navigate(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const newView = document.getElementById(view);
    if (newView) {
      newView.classList.add('active');
      this.currentView = view;
      console.log(`Vista cambiada a: ${view}`);
    }
  }

  startAutoBackup() {
    this.autoBackupInterval = setInterval(() => {
      console.log('Backup automático ejecutado');
    }, 30000);
  }

  showToast(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.gymApp = new GymTracker();
});
