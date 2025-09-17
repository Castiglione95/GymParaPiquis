// GymTracker v3.0 - Enhanced with Robust Backup System and Nested Folders
class GymTrackerV3 {
    constructor() {
        this.currentRoutine = null;
        this.currentWorkout = null;
        this.currentExerciseIndex = 0;
        this.editingRoutineId = null;
        this.editingExerciseIndex = null;
        this.editingWorkoutId = null;
        this.selectedMuscleGroup = 'all';
        this.currentFolderId = null; // For nested folder navigation
        this.draggedElement = null;
        this.autoSaveInterval = null;
        this.backupInterval = null;
        
        // Data from JSON
        this.exerciseLibrary = {
            "Pecho": [
                {"nombre": "Press de Banca", "musculo_primario": "Pecho", "descripcion": "Ejercicio básico con barra"},
                {"nombre": "Press Inclinado", "musculo_primario": "Pecho", "descripcion": "Enfoque en pecho superior"},
                {"nombre": "Press con Mancuernas", "musculo_primario": "Pecho", "descripcion": "Mayor rango de movimiento"},
                {"nombre": "Fondos en Paralelas", "musculo_primario": "Pecho", "descripcion": "Peso corporal o con lastre"},
                {"nombre": "Aperturas con Mancuernas", "musculo_primario": "Pecho", "descripcion": "Aislamiento del pecho"},
                {"nombre": "Press Declinado", "musculo_primario": "Pecho", "descripcion": "Pecho inferior"},
                {"nombre": "Cruces en Cable", "musculo_primario": "Pecho", "descripcion": "Aislamiento con cable"}
            ],
            "Espalda": [
                {"nombre": "Peso Muerto", "musculo_primario": "Espalda", "descripcion": "Ejercicio completo de tracción"},
                {"nombre": "Remo con Barra", "musculo_primario": "Espalda", "descripcion": "Desarrollo del grosor"},
                {"nombre": "Dominadas", "musculo_primario": "Espalda", "descripcion": "Anchura de espalda"},
                {"nombre": "Remo con Mancuerna", "musculo_primario": "Espalda", "descripcion": "Trabajo unilateral"},
                {"nombre": "Jalón al Pecho", "musculo_primario": "Espalda", "descripcion": "Alternativa a dominadas"},
                {"nombre": "Remo en Cable", "musculo_primario": "Espalda", "descripcion": "Tensión constante"},
                {"nombre": "Pullover", "musculo_primario": "Espalda", "descripcion": "Dorsales y serratos"}
            ],
            "Piernas": [
                {"nombre": "Sentadillas", "musculo_primario": "Piernas", "descripcion": "Rey de los ejercicios"},
                {"nombre": "Prensa de Piernas", "musculo_primario": "Piernas", "descripcion": "Alternativa segura"},
                {"nombre": "Zancadas", "musculo_primario": "Piernas", "descripcion": "Trabajo unilateral"},
                {"nombre": "Curl de Femoral", "musculo_primario": "Piernas", "descripcion": "Aislamiento de femorales"},
                {"nombre": "Extensión de Cuádriceps", "musculo_primario": "Piernas", "descripcion": "Aislamiento de cuádriceps"},
                {"nombre": "Peso Muerto Rumano", "musculo_primario": "Piernas", "descripcion": "Femorales y glúteos"},
                {"nombre": "Sentadilla Búlgara", "musculo_primario": "Piernas", "descripcion": "Unilateral intenso"}
            ],
            "Hombros": [
                {"nombre": "Press Militar", "musculo_primario": "Hombros", "descripcion": "Desarrollo general"},
                {"nombre": "Press con Mancuernas", "musculo_primario": "Hombros", "descripcion": "Mayor estabilización"},
                {"nombre": "Elevaciones Laterales", "musculo_primario": "Hombros", "descripcion": "Deltoides medio"},
                {"nombre": "Elevaciones Posteriores", "musculo_primario": "Hombros", "descripcion": "Deltoides posterior"},
                {"nombre": "Elevaciones Frontales", "musculo_primario": "Hombros", "descripcion": "Deltoides anterior"},
                {"nombre": "Encogimientos", "musculo_primario": "Hombros", "descripcion": "Trapecios"},
                {"nombre": "Face Pulls", "musculo_primario": "Hombros", "descripcion": "Posterior y estabilidad"}
            ],
            "Brazos": [
                {"nombre": "Curl de Bíceps", "musculo_primario": "Brazos", "descripcion": "Básico de bíceps"},
                {"nombre": "Press Francés", "musculo_primario": "Brazos", "descripcion": "Aislamiento de tríceps"},
                {"nombre": "Curl Martillo", "musculo_primario": "Brazos", "descripcion": "Braquial y bíceps"},
                {"nombre": "Fondos en Banco", "musculo_primario": "Brazos", "descripcion": "Tríceps con peso corporal"},
                {"nombre": "Curl en Cable", "musculo_primario": "Brazos", "descripcion": "Tensión constante"},
                {"nombre": "Press Cerrado", "musculo_primario": "Brazos", "descripcion": "Tríceps con barra"},
                {"nombre": "Curl Concentrado", "musculo_primario": "Brazos", "descripcion": "Aislamiento de bíceps"}
            ]
        };

        this.equipmentTypes = [
            "Barra", "Mancuernas", "Máquina", "Cable", "Peso Corporal", "Kettlebell", "Banda Elástica"
        ];

        this.effortColors = {
            "easy": {"nombre": "Fácil", "color": "green", "icon": "🟢"},
            "hard": {"nombre": "Difícil", "color": "yellow", "icon": "🟡"},
            "failure": {"nombre": "Fallo", "color": "red", "icon": "🔴"}
        };

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.populateExerciseOptions();
        this.populateEquipmentOptions();
        this.populateFolderOptions();
        this.populateRoutineOptions();
        
        // Initialize backup system
        this.initBackupSystem();
        
        // Add sample data if none exists
        if (this.getRoutines().length === 0) {
            this.addSampleData();
        }
        
        this.applyTheme();
        this.updateBackupIndicator();
    }

    // Enhanced Data Management with IndexedDB Support
    loadData() {
        try {
            this.routines = JSON.parse(localStorage.getItem('gymtracker_v3_routines') || '[]');
            this.workouts = JSON.parse(localStorage.getItem('gymtracker_v3_workouts') || '[]');
            this.folders = JSON.parse(localStorage.getItem('gymtracker_v3_folders') || '[]');
            this.customExercises = JSON.parse(localStorage.getItem('gymtracker_v3_custom_exercises') || '[]');
            this.settings = JSON.parse(localStorage.getItem('gymtracker_v3_settings') || '{"theme": "light", "restTimer": 120, "autoBackup": true, "backupReminders": true}');
            this.backupData = JSON.parse(localStorage.getItem('gymtracker_v3_backup_data') || '{"lastManualBackup": null, "lastAutoBackup": null, "backupVersions": []}');
        } catch (e) {
            console.error('Error loading data:', e);
            this.routines = [];
            this.workouts = [];
            this.folders = [];
            this.customExercises = [];
            this.settings = {"theme": "light", "restTimer": 120, "autoBackup": true, "backupReminders": true};
            this.backupData = {"lastManualBackup": null, "lastAutoBackup": null, "backupVersions": []};
        }
    }

    saveData(skipAutoSave = false) {
        try {
            localStorage.setItem('gymtracker_v3_routines', JSON.stringify(this.routines));
            localStorage.setItem('gymtracker_v3_workouts', JSON.stringify(this.workouts));
            localStorage.setItem('gymtracker_v3_folders', JSON.stringify(this.folders));
            localStorage.setItem('gymtracker_v3_custom_exercises', JSON.stringify(this.customExercises));
            localStorage.setItem('gymtracker_v3_settings', JSON.stringify(this.settings));
            localStorage.setItem('gymtracker_v3_backup_data', JSON.stringify(this.backupData));
            
            if (!skipAutoSave) {
                this.showAutoSaveIndicator();
            }
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    // Backup System Implementation
    initBackupSystem() {
        // Auto-save every 30 seconds
        if (this.settings.autoBackup) {
            this.startAutoSave();
            this.startDailyBackup();
        }
        
        // Check for backup reminders
        this.checkBackupReminder();
    }

    startAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            this.saveData(true); // Skip auto-save animation for this
        }, 30000); // Every 30 seconds
    }

    startDailyBackup() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
        }
        
        // Check every hour for daily backup
        this.backupInterval = setInterval(() => {
            this.checkDailyBackup();
        }, 3600000); // Every hour
        
        // Also check on init
        this.checkDailyBackup();
    }

    checkDailyBackup() {
        const now = new Date();
        const lastBackup = this.backupData.lastAutoBackup ? new Date(this.backupData.lastAutoBackup) : null;
        
        if (!lastBackup || (now - lastBackup) > 24 * 60 * 60 * 1000) {
            this.createAutoBackup();
        }
    }

    createAutoBackup() {
        const backupData = this.exportAllData();
        const timestamp = new Date().toISOString();
        
        // Store in IndexedDB (more persistent than localStorage)
        this.storeBackupInIndexedDB(`auto_backup_${timestamp}`, backupData);
        
        // Update backup versions list
        this.backupData.backupVersions.push({
            type: 'auto',
            timestamp: timestamp,
            key: `auto_backup_${timestamp}`
        });
        
        // Keep only last 7 auto backups
        this.backupData.backupVersions = this.backupData.backupVersions
            .filter(backup => backup.type === 'manual' || 
                    this.backupData.backupVersions.indexOf(backup) >= this.backupData.backupVersions.length - 7);
        
        this.backupData.lastAutoBackup = timestamp;
        this.saveData(true);
        this.updateBackupIndicator();
    }

    createManualBackup() {
        const backupData = this.exportAllData();
        const timestamp = new Date().toISOString();
        
        // Store in IndexedDB
        this.storeBackupInIndexedDB(`manual_backup_${timestamp}`, backupData);
        
        // Update backup versions list
        this.backupData.backupVersions.push({
            type: 'manual',
            timestamp: timestamp,
            key: `manual_backup_${timestamp}`
        });
        
        this.backupData.lastManualBackup = timestamp;
        this.saveData(true);
        this.updateBackupIndicator();
        this.showNotification('Backup manual creado correctamente', 'success');
    }

    async storeBackupInIndexedDB(key, data) {
        // Simple IndexedDB wrapper for backup storage
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('GymTrackerBackups', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['backups'], 'readwrite');
                const store = transaction.objectStore('backups');
                store.put({ key: key, data: data, timestamp: new Date().toISOString() });
                resolve();
            };
            
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('backups')) {
                    db.createObjectStore('backups', { keyPath: 'key' });
                }
            };
        });
    }

    checkBackupReminder() {
        if (!this.settings.backupReminders) return;
        
        const lastManual = this.backupData.lastManualBackup ? new Date(this.backupData.lastManualBackup) : null;
        const now = new Date();
        
        if (!lastManual || (now - lastManual) > 7 * 24 * 60 * 60 * 1000) {
            this.showBackupReminder();
        }
    }

    showBackupReminder() {
        const reminder = document.getElementById('backupReminder');
        if (reminder) {
            reminder.classList.remove('hidden');
        }
    }

    updateBackupIndicator() {
        const indicator = document.getElementById('backupIndicator');
        const lastBackupEl = document.getElementById('lastBackup');
        
        if (!indicator || !lastBackupEl) return;
        
        const lastManual = this.backupData.lastManualBackup ? new Date(this.backupData.lastManualBackup) : null;
        const lastAuto = this.backupData.lastAutoBackup ? new Date(this.backupData.lastAutoBackup) : null;
        const now = new Date();
        
        if (lastManual) {
            const daysSinceManual = Math.floor((now - lastManual) / (1000 * 60 * 60 * 24));
            lastBackupEl.textContent = daysSinceManual === 0 ? 'Hoy' : `${daysSinceManual}d`;
            
            if (daysSinceManual > 7) {
                indicator.className = 'backup-indicator warning';
                indicator.querySelector('.backup-text').textContent = 'Backup Pendiente';
                indicator.querySelector('.backup-icon').textContent = '⚠️';
            } else {
                indicator.className = 'backup-indicator';
                indicator.querySelector('.backup-text').textContent = 'Backup OK';
                indicator.querySelector('.backup-icon').textContent = '💾';
            }
        } else {
            lastBackupEl.textContent = 'Nunca';
            indicator.className = 'backup-indicator error';
            indicator.querySelector('.backup-text').textContent = 'Sin Backup';
            indicator.querySelector('.backup-icon').textContent = '❌';
        }
    }

    exportAllData() {
        return {
            routines: this.routines,
            workouts: this.workouts,
            folders: this.folders,
            customExercises: this.customExercises,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '3.0'
        };
    }

    exportDataAsFile() {
        const data = this.exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `gymtracker_backup_${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('Backup exportado correctamente', 'success');
    }

    exportSingleRoutine() {
        const routineSelect = document.getElementById('routineToExport');
        if (!routineSelect || !routineSelect.value) return;
        
        const routine = this.routines.find(r => r.id === routineSelect.value);
        if (!routine) return;
        
        const exportData = {
            routine: routine,
            exportDate: new Date().toISOString(),
            version: '3.0',
            type: 'single_routine'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rutina_${routine.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.hideModal('exportRoutineModal');
        this.showNotification('Rutina exportada correctamente', 'success');
    }

    importDataFromFile() {
        const input = document.getElementById('importFileInput');
        input.click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                this.processImportedData(importData);
            } catch (error) {
                this.showNotification('Error al leer el archivo. Formato inválido.', 'error');
            }
        };
        reader.readAsText(file);
    }

    processImportedData(importData) {
        if (importData.type === 'single_routine' && importData.routine) {
            // Import single routine
            const routine = {
                ...importData.routine,
                id: Date.now().toString(), // New ID to avoid conflicts
                createdAt: new Date().toISOString()
            };
            this.routines.push(routine);
            this.saveData();
            this.showNotification(`Rutina "${routine.name}" importada correctamente`, 'success');
            this.updateRoutinesList();
            this.populateRoutineOptions();
        } else if (importData.routines && importData.workouts) {
            // Import full backup
            this.showConfirmModal(
                'Importar Backup Completo',
                '¿Estás seguro? Esto reemplazará todos tus datos actuales.',
                () => {
                    this.routines = importData.routines || [];
                    this.workouts = importData.workouts || [];
                    this.folders = importData.folders || [];
                    this.customExercises = importData.customExercises || [];
                    this.settings = {...this.settings, ...importData.settings};
                    this.saveData();
                    this.showNotification('Datos importados correctamente', 'success');
                    this.updateDashboard();
                    this.updateRoutinesList();
                }
            );
        } else {
            this.showNotification('Formato de archivo no reconocido', 'error');
        }
    }

    showAutoSaveIndicator() {
        let indicator = document.querySelector('.auto-save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'auto-save-indicator';
            indicator.textContent = '💾 Guardado';
            document.body.appendChild(indicator);
        }
        
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-${type === 'error' ? 'error' : 'success'});
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }

    getAllExercises() {
        let allExercises = [];
        Object.keys(this.exerciseLibrary).forEach(muscle => {
            allExercises = allExercises.concat(this.exerciseLibrary[muscle]);
        });
        return allExercises.concat(this.customExercises);
    }

    getRoutines() {
        return this.routines || [];
    }

    getWorkouts() {
        return this.workouts || [];
    }

    getFolders() {
        return this.folders || [];
    }

    // Enhanced Nested Folders
    getFoldersByParent(parentId = null) {
        return this.getFolders().filter(folder => folder.parentId === parentId);
    }

    getFolderPath(folderId) {
        if (!folderId) return [];
        
        const folder = this.getFolders().find(f => f.id === folderId);
        if (!folder) return [];
        
        const path = [folder];
        if (folder.parentId) {
            path.unshift(...this.getFolderPath(folder.parentId));
        }
        return path;
    }

    navigateToFolder(folderId) {
        this.currentFolderId = folderId;
        this.updateRoutinesList();
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const breadcrumbs = document.getElementById('folderBreadcrumbs');
        if (!breadcrumbs) return;
        
        if (!this.currentFolderId) {
            breadcrumbs.classList.add('hidden');
            return;
        }
        
        breadcrumbs.classList.remove('hidden');
        const path = this.getFolderPath(this.currentFolderId);
        
        let html = '<span class="breadcrumb-item" data-folder="">🏠 Inicio</span>';
        path.forEach(folder => {
            html += `<span class="breadcrumb-item" data-folder="${folder.id}">📁 ${folder.name}</span>`;
        });
        
        breadcrumbs.innerHTML = html;
        
        // Add click handlers for breadcrumbs
        breadcrumbs.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => {
                const folderId = item.dataset.folder || null;
                this.navigateToFolder(folderId);
            });
        });
    }

    // Event Listeners Enhanced
    setupEventListeners() {
        this.setupNavigationListeners();
        setTimeout(() => {
            this.setupAllEventListeners();
        }, 100);
    }

    setupNavigationListeners() {
        // Regular navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.showView(view);
                }
            });
        });
        
        // Workout navigation
        this.setupWorkoutNavigationListeners();
    }

    setupWorkoutNavigationListeners() {
        const prevBtn = document.getElementById('prevExerciseBtn');
        const nextBtn = document.getElementById('nextExerciseBtn');
        const overviewBtn = document.getElementById('workoutOverviewBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousExercise());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextExercise());
        }
        if (overviewBtn) {
            overviewBtn.addEventListener('click', () => {
                this.hideWorkoutNavigation();
                this.showView('workoutOverview');
            });
        }
    }

    setupAllEventListeners() {
        this.setupBasicListeners();
        this.setupExerciseLibraryListeners();
        this.setupRoutineListeners();
        this.setupWorkoutListeners();
        this.setupModalListeners();
        this.setupBackupListeners();
        this.setupFileImportListener();
    }

    setupBackupListeners() {
        const backupIndicator = document.getElementById('backupIndicator');
        if (backupIndicator) {
            backupIndicator.addEventListener('click', () => {
                this.showView('backupConfig');
            });
        }

        const quickBackupBtn = document.getElementById('quickBackupBtn');
        if (quickBackupBtn) {
            quickBackupBtn.addEventListener('click', () => {
                this.createManualBackup();
                document.getElementById('backupReminder').classList.add('hidden');
            });
        }

        const createManualBackup = document.getElementById('createManualBackup');
        if (createManualBackup) {
            createManualBackup.addEventListener('click', () => this.createManualBackup());
        }

        const exportDataBtn = document.getElementById('exportDataBtn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => this.exportDataAsFile());
        }

        const importDataBtn = document.getElementById('importDataBtn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => this.importDataFromFile());
        }

        const exportRoutineBtn = document.getElementById('exportRoutineBtn');
        if (exportRoutineBtn) {
            exportRoutineBtn.addEventListener('click', () => {
                this.populateExportRoutineOptions();
                this.showModal('exportRoutineModal');
            });
        }

        const confirmExportRoutine = document.getElementById('confirmExportRoutine');
        if (confirmExportRoutine) {
            confirmExportRoutine.addEventListener('click', () => this.exportSingleRoutine());
        }

        const cancelExportRoutine = document.getElementById('cancelExportRoutine');
        if (cancelExportRoutine) {
            cancelExportRoutine.addEventListener('click', () => this.hideModal('exportRoutineModal'));
        }

        const closeExportRoutineModal = document.getElementById('closeExportRoutineModal');
        if (closeExportRoutineModal) {
            closeExportRoutineModal.addEventListener('click', () => this.hideModal('exportRoutineModal'));
        }

        const backFromBackupConfig = document.getElementById('backFromBackupConfig');
        if (backFromBackupConfig) {
            backFromBackupConfig.addEventListener('click', () => this.showView('dashboard'));
        }

        const autoBackupEnabled = document.getElementById('autoBackupEnabled');
        if (autoBackupEnabled) {
            autoBackupEnabled.addEventListener('change', (e) => {
                this.settings.autoBackup = e.target.checked;
                this.saveData();
                if (e.target.checked) {
                    this.startAutoSave();
                    this.startDailyBackup();
                } else {
                    clearInterval(this.autoSaveInterval);
                    clearInterval(this.backupInterval);
                }
            });
        }

        const backupRemindersEnabled = document.getElementById('backupRemindersEnabled');
        if (backupRemindersEnabled) {
            backupRemindersEnabled.addEventListener('change', (e) => {
                this.settings.backupReminders = e.target.checked;
                this.saveData();
            });
        }
    }

    setupFileImportListener() {
        const importFileInput = document.getElementById('importFileInput');
        if (importFileInput) {
            importFileInput.addEventListener('change', (e) => this.handleFileImport(e));
        }
    }

    setupBasicListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        const startWorkoutBtn = document.getElementById('startWorkoutBtn');
        if (startWorkoutBtn) {
            startWorkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showView('selectRoutine');
            });
        }
    }

    setupExerciseLibraryListeners() {
        setTimeout(() => {
            const muscleButtons = document.querySelectorAll('.muscle-btn');
            muscleButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const muscle = e.currentTarget.dataset.muscle;
                    this.filterByMuscle(muscle);
                });
            });
        }, 200);

        const createCustomBtn = document.getElementById('createCustomExerciseBtn');
        if (createCustomBtn) {
            createCustomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showCustomExerciseModal();
            });
        }
    }

    setupRoutineListeners() {
        const createRoutineBtn = document.getElementById('createRoutineBtn');
        if (createRoutineBtn) {
            createRoutineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showRoutineEditor();
            });
        }

        const createFolderBtn = document.getElementById('createFolderBtn');
        if (createFolderBtn) {
            createFolderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showFolderModal();
            });
        }

        const cancelRoutineBtn = document.getElementById('cancelRoutineBtn');
        if (cancelRoutineBtn) {
            cancelRoutineBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('routines');
            });
        }

        const routineForm = document.getElementById('routineForm');
        if (routineForm) {
            routineForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveRoutine();
            });
        }

        const addExerciseBtn = document.getElementById('addExerciseBtn');
        if (addExerciseBtn) {
            addExerciseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showExerciseModal();
            });
        }
    }

    setupWorkoutListeners() {
        const backToDashboard = document.getElementById('backToDashboard');
        if (backToDashboard) {
            backToDashboard.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('dashboard');
            });
        }

        const cancelWorkoutBtn = document.getElementById('cancelWorkoutBtn');
        if (cancelWorkoutBtn) {
            cancelWorkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('dashboard');
            });
        }

        const backToWorkoutOverviewBtn = document.getElementById('backToWorkoutOverviewBtn');
        if (backToWorkoutOverviewBtn) {
            backToWorkoutOverviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('workoutOverview');
            });
        }

        const finishWorkoutFromOverviewBtn = document.getElementById('finishWorkoutFromOverviewBtn');
        if (finishWorkoutFromOverviewBtn) {
            finishWorkoutFromOverviewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.finishWorkout();
            });
        }

        const closeSummaryBtn = document.getElementById('closeSummaryBtn');
        if (closeSummaryBtn) {
            closeSummaryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('workoutSummaryModal');
                this.showView('dashboard');
            });
        }

        const cancelEditWorkoutBtn = document.getElementById('cancelEditWorkoutBtn');
        if (cancelEditWorkoutBtn) {
            cancelEditWorkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('history');
            });
        }

        const editWorkoutForm = document.getElementById('editWorkoutForm');
        if (editWorkoutForm) {
            editWorkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEditedWorkout();
            });
        }
    }

    setupModalListeners() {
        // Exercise modal - SIMPLIFIED FLOW
        const closeExerciseModal = document.getElementById('closeExerciseModal');
        if (closeExerciseModal) {
            closeExerciseModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideExerciseModal();
            });
        }

        const cancelExerciseBtn = document.getElementById('cancelExerciseBtn');
        if (cancelExerciseBtn) {
            cancelExerciseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideExerciseModal();
            });
        }

        const exerciseForm = document.getElementById('exerciseForm');
        if (exerciseForm) {
            exerciseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExerciseToSelectedRoutine(); // New simplified method
            });
        }

        const closeEditExerciseModal = document.getElementById('closeEditExerciseModal');
        if (closeEditExerciseModal) {
            closeEditExerciseModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('editExerciseModal');
            });
        }

        const cancelEditExerciseBtn = document.getElementById('cancelEditExerciseBtn');
        if (cancelEditExerciseBtn) {
            cancelEditExerciseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('editExerciseModal');
            });
        }

        const editExerciseForm = document.getElementById('editExerciseForm');
        if (editExerciseForm) {
            editExerciseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEditedExercise();
            });
        }

        // Folder modal enhanced for nested folders
        const closeFolderModal = document.getElementById('closeFolderModal');
        if (closeFolderModal) {
            closeFolderModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('folderModal');
            });
        }

        const cancelFolderBtn = document.getElementById('cancelFolderBtn');
        if (cancelFolderBtn) {
            cancelFolderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('folderModal');
            });
        }

        const folderForm = document.getElementById('folderForm');
        if (folderForm) {
            folderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createFolder();
            });
        }

        // Custom exercise modal
        const closeCustomExerciseModal = document.getElementById('closeCustomExerciseModal');
        if (closeCustomExerciseModal) {
            closeCustomExerciseModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('customExerciseModal');
            });
        }

        const cancelCustomExerciseBtn = document.getElementById('cancelCustomExerciseBtn');
        if (cancelCustomExerciseBtn) {
            cancelCustomExerciseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('customExerciseModal');
            });
        }

        const customExerciseForm = document.getElementById('customExerciseForm');
        if (customExerciseForm) {
            customExerciseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createCustomExercise();
            });
        }

        const confirmCancel = document.getElementById('confirmCancel');
        if (confirmCancel) {
            confirmCancel.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('confirmModal');
            });
        }
    }

    // Global functions for inline onclick handlers
    setupGlobalFunctions() {
        window.quickAddToRoutine = (exerciseName) => this.quickAddToRoutine(exerciseName);
        window.editRoutine = (routineId) => this.editRoutine(routineId);
        window.deleteRoutine = (routineId) => this.deleteRoutine(routineId);
        window.toggleFolder = (folderId) => this.toggleFolder(folderId);
        window.enterFolder = (folderId) => this.navigateToFolder(folderId);
        window.startWorkout = (routineId) => this.startWorkout(routineId);
        window.showExerciseDetail = (exerciseIndex) => this.showExerciseDetail(exerciseIndex);
        window.editExerciseInRoutine = (exerciseIndex) => this.editExerciseInRoutine(exerciseIndex);
        window.removeExercise = (exerciseIndex) => this.removeExercise(exerciseIndex);
        window.updateSet = (exerciseIndex, setIndex, field, value) => this.updateSet(exerciseIndex, setIndex, field, value);
        window.updateEditingSet = (exerciseIndex, setIndex, field, value) => this.updateEditingSet(exerciseIndex, setIndex, field, value);
        window.editWorkout = (workoutId) => this.editWorkout(workoutId);
    }

    // View Management Enhanced
    showView(viewName) {
        console.log('Showing view:', viewName);
        
        const allViews = document.querySelectorAll('.view');
        allViews.forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.classList.add('active');
        } else {
            console.error('View not found:', viewName);
            return;
        }
        
        const allNavItems = document.querySelectorAll('.nav-item');
        allNavItems.forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Hide workout navigation unless in workout views
        if (!['workoutOverview', 'exerciseDetail'].includes(viewName)) {
            this.hideWorkoutNavigation();
        }

        this.setupGlobalFunctions();

        switch(viewName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'exerciseLibrary':
                this.updateExerciseLibrary();
                this.setupExerciseLibraryListeners();
                break;
            case 'routines':
                this.updateRoutinesList();
                break;
            case 'selectRoutine':
                this.updateSelectRoutineList();
                break;
            case 'history':
                this.updateHistoryList();
                break;
            case 'progress':
                this.updateProgressView();
                break;
            case 'backupConfig':
                this.updateBackupConfigView();
                break;
        }
    }

    showWorkoutNavigation() {
        const workoutNav = document.getElementById('workoutBottomNav');
        const regularNav = document.querySelector('.bottom-nav');
        
        if (workoutNav) workoutNav.classList.remove('hidden');
        if (regularNav) regularNav.style.display = 'none';
        
        this.updateWorkoutNavigationButtons();
    }

    hideWorkoutNavigation() {
        const workoutNav = document.getElementById('workoutBottomNav');
        const regularNav = document.querySelector('.bottom-nav');
        
        if (workoutNav) workoutNav.classList.add('hidden');
        if (regularNav) regularNav.style.display = 'grid';
    }

    updateWorkoutNavigationButtons() {
        const prevBtn = document.getElementById('prevExerciseBtn');
        const nextBtn = document.getElementById('nextExerciseBtn');
        
        if (!this.currentWorkout) return;
        
        if (prevBtn) {
            prevBtn.disabled = this.currentExerciseIndex <= 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentExerciseIndex >= this.currentWorkout.exercises.length - 1;
        }
    }

    previousExercise() {
        if (this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
            this.showExerciseDetail(this.currentExerciseIndex);
        }
    }

    nextExercise() {
        if (this.currentWorkout && this.currentExerciseIndex < this.currentWorkout.exercises.length - 1) {
            this.currentExerciseIndex++;
            this.showExerciseDetail(this.currentExerciseIndex);
        }
    }

    // Dashboard Enhanced
    updateDashboard() {
        const totalWorkouts = this.getWorkouts().length;
        const totalRoutines = this.getRoutines().length;
        const lastWorkout = this.getLastWorkoutDate();

        const totalWorkoutsEl = document.getElementById('totalWorkouts');
        const totalRoutinesEl = document.getElementById('totalRoutines');
        const lastWorkoutEl = document.getElementById('lastWorkout');

        if (totalWorkoutsEl) totalWorkoutsEl.textContent = totalWorkouts;
        if (totalRoutinesEl) totalRoutinesEl.textContent = totalRoutines;
        if (lastWorkoutEl) lastWorkoutEl.textContent = lastWorkout;

        this.updateRecentWorkoutsList();
        this.checkBackupReminder();
    }

    getLastWorkoutDate() {
        const workouts = this.getWorkouts();
        if (workouts.length === 0) return '-';
        
        const lastWorkout = workouts[workouts.length - 1];
        const date = new Date(lastWorkout.date);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Ayer';
        return `${diffDays} días`;
    }

    updateRecentWorkoutsList() {
        const container = document.getElementById('recentWorkoutsList');
        if (!container) return;
        
        const recentWorkouts = this.getWorkouts().slice(-5).reverse();

        if (recentWorkouts.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay entrenamientos recientes</div>';
            return;
        }

        container.innerHTML = recentWorkouts.map(workout => `
            <div class="workout-item">
                <div class="workout-info">
                    <h4>${workout.routineName}</h4>
                    <div class="workout-date">${this.formatDate(workout.date)}</div>
                </div>
                <div class="workout-stats">
                    <span class="status status--success">${workout.exercises.length} ejercicios</span>
                </div>
            </div>
        `).join('');
    }

    // Exercise Library with Simplified Add to Routine Flow
    updateExerciseLibrary() {
        const container = document.getElementById('exerciseLibraryList');
        if (!container) return;

        const allExercises = this.getAllExercises();
        const filteredExercises = this.selectedMuscleGroup === 'all' ? 
            allExercises : 
            allExercises.filter(ex => ex.musculo_primario === this.selectedMuscleGroup);

        if (filteredExercises.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay ejercicios en esta categoría</div>';
            return;
        }

        container.innerHTML = filteredExercises.map(exercise => `
            <div class="exercise-library-item">
                <div class="exercise-lib-header">
                    <h3 class="exercise-lib-title">${exercise.nombre}</h3>
                    <span class="exercise-lib-muscle">${exercise.musculo_primario}</span>
                </div>
                <div class="exercise-lib-desc">${exercise.descripcion || 'Sin descripción'}</div>
                <button class="add-to-routine-btn" onclick="quickAddToRoutine('${exercise.nombre}')">
                    Añadir a Rutina
                </button>
            </div>
        `).join('');
    }

    filterByMuscle(muscle) {
        this.selectedMuscleGroup = muscle;
        
        const muscleButtons = document.querySelectorAll('.muscle-btn');
        muscleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.muscle === muscle) {
                btn.classList.add('active');
            }
        });

        this.updateExerciseLibrary();
    }

    // Simplified flow: Exercise pre-selected, user chooses routine
    quickAddToRoutine(exerciseName) {
        if (this.getRoutines().length === 0) {
            this.showNotification('Primero crea una rutina', 'error');
            return;
        }
        this.showExerciseModal(exerciseName);
    }

    showExerciseModal(preSelectedExercise = null) {
        const form = document.getElementById('exerciseForm');
        const selectedExerciseInput = document.getElementById('selectedExerciseName');
        
        if (form) {
            form.reset();
            if (preSelectedExercise && selectedExerciseInput) {
                selectedExerciseInput.value = preSelectedExercise;
            }
        }
        
        this.populateRoutineOptions(); // Populate available routines
        this.showModal('exerciseModal');
    }

    addExerciseToSelectedRoutine() {
        const form = document.getElementById('exerciseForm');
        if (!form) return;
        
        const exerciseName = document.getElementById('selectedExerciseName').value;
        const targetRoutineId = form.targetRoutine.value;
        
        if (!targetRoutineId) {
            this.showNotification('Selecciona una rutina destino', 'error');
            return;
        }
        
        const targetRoutine = this.routines.find(r => r.id === targetRoutineId);
        if (!targetRoutine) {
            this.showNotification('Rutina no encontrada', 'error');
            return;
        }
        
        const exercise = {
            nombre: exerciseName,
            equipamiento: form.exerciseEquipment.value,
            series_objetivo: parseInt(form.exerciseSets.value),
            repeticiones_objetivo: parseInt(form.exerciseReps.value),
            peso_objetivo: parseFloat(form.exerciseWeight.value),
            observaciones: form.exerciseNotes.value
        };

        targetRoutine.exercises.push(exercise);
        this.saveData();
        this.hideExerciseModal();
        this.showNotification(`Ejercicio añadido a "${targetRoutine.name}"`, 'success');
        
        // Update button text to show success
        const addBtn = document.getElementById('addToRoutineBtn');
        if (addBtn) {
            const originalText = addBtn.textContent;
            addBtn.textContent = '✓ Añadido';
            addBtn.disabled = true;
            setTimeout(() => {
                addBtn.textContent = originalText;
                addBtn.disabled = false;
            }, 2000);
        }
    }

    populateRoutineOptions() {
        const select = document.getElementById('targetRoutine');
        if (!select) return;
        
        const routines = this.getRoutines();
        select.innerHTML = '<option value="">Seleccionar rutina...</option>' +
            routines.map(routine => `<option value="${routine.id}">${routine.name}</option>`).join('');
    }

    populateExportRoutineOptions() {
        const select = document.getElementById('routineToExport');
        if (!select) return;
        
        const routines = this.getRoutines();
        select.innerHTML = '<option value="">Seleccionar rutina para exportar...</option>' +
            routines.map(routine => `<option value="${routine.id}">${routine.name}</option>`).join('');
    }

    hideExerciseModal() {
        this.hideModal('exerciseModal');
    }

    showCustomExerciseModal() {
        const form = document.getElementById('customExerciseForm');
        if (form) form.reset();
        this.showModal('customExerciseModal');
    }

    createCustomExercise() {
        const form = document.getElementById('customExerciseForm');
        if (!form) return;

        const exercise = {
            nombre: form.customExerciseName.value,
            musculo_primario: form.customExerciseMuscle.value,
            descripcion: form.customExerciseDesc.value || 'Ejercicio personalizado',
            custom: true
        };

        this.customExercises.push(exercise);
        this.saveData();
        this.populateExerciseOptions();
        this.updateExerciseLibrary();
        this.hideModal('customExerciseModal');
    }

    // Enhanced Nested Folders with Drag & Drop
    showFolderModal(parentId = null) {
        const form = document.getElementById('folderForm');
        const parentSelect = document.getElementById('parentFolder');
        const title = document.getElementById('folderModalTitle');
        
        if (form) form.reset();
        if (title) title.textContent = 'Nueva Carpeta';
        
        // Populate parent folder options
        this.populateParentFolderOptions(parentId);
        
        if (parentId && parentSelect) {
            parentSelect.value = parentId;
        }
        
        this.showModal('folderModal');
    }

    populateParentFolderOptions(excludeId = null) {
        const select = document.getElementById('parentFolder');
        if (!select) return;
        
        const folders = this.getFolders().filter(f => f.id !== excludeId);
        select.innerHTML = '<option value="">Carpeta raíz</option>' +
            folders.map(folder => {
                const path = this.getFolderPath(folder.id);
                const displayName = path.map(f => f.name).join(' > ');
                return `<option value="${folder.id}">${displayName}</option>`;
            }).join('');
    }

    createFolder() {
        const form = document.getElementById('folderForm');
        if (!form) return;

        const folder = {
            id: Date.now().toString(),
            name: form.folderName.value,
            parentId: form.parentFolder.value || null,
            createdAt: new Date().toISOString()
        };

        this.folders.push(folder);
        this.saveData();
        this.populateFolderOptions();
        this.updateRoutinesList();
        this.hideModal('folderModal');
        this.showNotification('Carpeta creada correctamente', 'success');
    }

    // Enhanced Routines List with Nested Folders and Drag & Drop
    updateRoutinesList() {
        const container = document.getElementById('routinesList');
        if (!container) return;
        
        const routines = this.getRoutines();
        const folders = this.getFolders();

        if (routines.length === 0 && folders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No tienes rutinas creadas</p>
                    <button class="btn btn--primary" onclick="app.showRoutineEditor()">Crear Primera Rutina</button>
                </div>
            `;
            return;
        }

        let html = '';

        // Show folders and routines for current level
        const currentFolders = this.getFoldersByParent(this.currentFolderId);
        const currentRoutines = routines.filter(r => r.folderId === this.currentFolderId);

        // Render folders
        currentFolders.forEach(folder => {
            const folderRoutines = routines.filter(r => r.folderId === folder.id);
            const subfolders = this.getFoldersByParent(folder.id);
            const hasContent = folderRoutines.length > 0 || subfolders.length > 0;
            
            html += `
                <div class="folder-container" id="folder-${folder.id}" draggable="true" data-folder-id="${folder.id}">
                    <div class="folder-header" onclick="toggleFolder('${folder.id}')">
                        <h3 class="folder-title">
                            📁 ${folder.name}
                            <span style="font-size: 12px; color: var(--color-text-secondary);">
                                (${folderRoutines.length} rutinas, ${subfolders.length} subcarpetas)
                            </span>
                        </h3>
                        <div class="folder-actions">
                            <span class="drag-handle" title="Arrastrar">⋮⋮</span>
                            <button class="btn btn--sm btn--outline" onclick="event.stopPropagation(); enterFolder('${folder.id}')">Abrir</button>
                            <span class="folder-toggle">▼</span>
                        </div>
                    </div>
                    ${hasContent ? `
                        <div class="folder-content">
                            <p style="text-align: center; color: var(--color-text-secondary); font-size: 14px;">
                                Haz clic en "Abrir" para explorar esta carpeta
                            </p>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        // Render routines at current level
        if (currentRoutines.length > 0) {
            html += '<div class="no-folder-routines">';
            html += currentRoutines.map(routine => this.renderRoutineCard(routine)).join('');
            html += '</div>';
        }

        container.innerHTML = html;
        this.setupDragAndDrop();
    }

    renderRoutineCard(routine) {
        return `
            <div class="routine-card" draggable="true" data-routine-id="${routine.id}">
                <div class="routine-header">
                    <h3 class="routine-title">${routine.name}</h3>
                    <div class="routine-actions">
                        <span class="drag-handle" title="Arrastrar">⋮⋮</span>
                        <button class="btn btn--sm btn--secondary" onclick="editRoutine('${routine.id}')">Editar</button>
                        <button class="btn btn--sm btn--outline" onclick="deleteRoutine('${routine.id}')">Eliminar</button>
                    </div>
                </div>
                <div class="routine-exercises">${routine.exercises.length} ejercicios</div>
            </div>
        `;
    }

    setupDragAndDrop() {
        // Setup drag and drop for routines and folders
        const draggableItems = document.querySelectorAll('[draggable="true"]');
        const dropZones = document.querySelectorAll('.folder-container, .routines-list');

        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = {
                    element: item,
                    type: item.dataset.routineId ? 'routine' : 'folder',
                    id: item.dataset.routineId || item.dataset.folderId
                };
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            item.addEventListener('dragend', (e) => {
                item.classList.remove('dragging');
                this.draggedElement = null;
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                this.handleDrop(zone, e);
            });
        });
    }

    handleDrop(dropZone, event) {
        if (!this.draggedElement) return;

        const targetFolderId = dropZone.dataset.folderId || null;
        
        if (this.draggedElement.type === 'routine') {
            this.moveRoutineToFolder(this.draggedElement.id, targetFolderId);
        } else if (this.draggedElement.type === 'folder') {
            this.moveFolderToFolder(this.draggedElement.id, targetFolderId);
        }
    }

    moveRoutineToFolder(routineId, targetFolderId) {
        const routine = this.routines.find(r => r.id === routineId);
        if (!routine) return;

        routine.folderId = targetFolderId;
        this.saveData();
        this.updateRoutinesList();
        this.showNotification('Rutina movida correctamente', 'success');
    }

    moveFolderToFolder(folderId, targetFolderId) {
        // Prevent moving a folder into itself or its descendants
        if (folderId === targetFolderId) return;
        
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder) return;

        // Check if target is a descendant
        if (this.isFolderDescendant(targetFolderId, folderId)) {
            this.showNotification('No puedes mover una carpeta dentro de sí misma', 'error');
            return;
        }

        folder.parentId = targetFolderId;
        this.saveData();
        this.updateRoutinesList();
        this.showNotification('Carpeta movida correctamente', 'success');
    }

    isFolderDescendant(childId, parentId) {
        if (!childId) return false;
        
        const child = this.folders.find(f => f.id === childId);
        if (!child) return false;
        
        if (child.parentId === parentId) return true;
        
        return this.isFolderDescendant(child.parentId, parentId);
    }

    toggleFolder(folderId) {
        const folderContainer = document.getElementById(`folder-${folderId}`);
        if (folderContainer) {
            folderContainer.classList.toggle('collapsed');
        }
    }

    showRoutineEditor(routineId = null) {
        this.editingRoutineId = routineId;
        const title = document.getElementById('routineEditorTitle');
        const form = document.getElementById('routineForm');
        
        if (routineId) {
            const routine = this.getRoutines().find(r => r.id === routineId);
            if (routine) {
                if (title) title.textContent = 'Editar Rutina';
                const routineNameInput = document.getElementById('routineName');
                const routineFolderSelect = document.getElementById('routineFolder');
                if (routineNameInput) routineNameInput.value = routine.name;
                if (routineFolderSelect) routineFolderSelect.value = routine.folderId || '';
                this.currentEditingExercises = [...routine.exercises];
            }
        } else {
            if (title) title.textContent = 'Nueva Rutina';
            if (form) form.reset();
            this.currentEditingExercises = [];
        }
        
        this.updateExercisesList();
        this.showView('routineEditor');
    }

    updateExercisesList() {
        const container = document.getElementById('exercisesList');
        if (!container) return;
        
        const exercises = this.currentEditingExercises || [];

        container.innerHTML = exercises.map((exercise, index) => `
            <div class="exercise-item">
                <div class="exercise-header">
                    <h4 class="exercise-name">${exercise.nombre}</h4>
                    <div class="exercise-actions">
                        <button type="button" class="exercise-edit" onclick="editExerciseInRoutine(${index})">✏️</button>
                        <button type="button" class="exercise-remove" onclick="removeExercise(${index})">&times;</button>
                    </div>
                </div>
                <div class="exercise-details">
                    <div><strong>${exercise.series_objetivo}</strong> series</div>
                    <div><strong>${exercise.repeticiones_objetivo}</strong> reps</div>
                    <div><strong>${exercise.peso_objetivo}</strong> kg</div>
                    <div class="exercise-equipment">${exercise.equipamiento}</div>
                </div>
                ${exercise.observaciones ? `<div class="exercise-notes">${exercise.observaciones}</div>` : ''}
            </div>
        `).join('');
    }

    editExerciseInRoutine(exerciseIndex) {
        this.editingExerciseIndex = exerciseIndex;
        const exercise = this.currentEditingExercises[exerciseIndex];
        
        const form = document.getElementById('editExerciseForm');
        if (form) {
            form.editExerciseName.value = exercise.nombre;
            form.editExerciseEquipment.value = exercise.equipamiento;
            form.editExerciseSets.value = exercise.series_objetivo;
            form.editExerciseReps.value = exercise.repeticiones_objetivo;
            form.editExerciseWeight.value = exercise.peso_objetivo;
            form.editExerciseNotes.value = exercise.observaciones || '';
        }
        
        this.showModal('editExerciseModal');
    }

    saveEditedExercise() {
        const form = document.getElementById('editExerciseForm');
        if (!form || this.editingExerciseIndex === null) return;

        const updatedExercise = {
            ...this.currentEditingExercises[this.editingExerciseIndex],
            equipamiento: form.editExerciseEquipment.value,
            series_objetivo: parseInt(form.editExerciseSets.value),
            repeticiones_objetivo: parseInt(form.editExerciseReps.value),
            peso_objetivo: parseFloat(form.editExerciseWeight.value),
            observaciones: form.editExerciseNotes.value
        };

        this.currentEditingExercises[this.editingExerciseIndex] = updatedExercise;
        this.updateExercisesList();
        this.hideModal('editExerciseModal');
        this.editingExerciseIndex = null;
    }

    populateExerciseOptions() {
        const select = document.getElementById('exerciseName');
        if (!select) return;
        
        const allExercises = this.getAllExercises();
        select.innerHTML = '<option value="">Seleccionar ejercicio...</option>' +
            allExercises.map(ex => `<option value="${ex.nombre}">${ex.nombre} (${ex.musculo_primario})</option>`).join('');
    }

    populateEquipmentOptions() {
        const selects = ['exerciseEquipment', 'editExerciseEquipment'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.innerHTML = '<option value="">Seleccionar equipamiento...</option>' +
                    this.equipmentTypes.map(eq => `<option value="${eq}">${eq}</option>`).join('');
            }
        });
    }

    populateFolderOptions() {
        const select = document.getElementById('routineFolder');
        if (!select) return;
        
        const folders = this.getFolders();
        select.innerHTML = '<option value="">Sin carpeta</option>' +
            folders.map(folder => {
                const path = this.getFolderPath(folder.id);
                const displayName = path.map(f => f.name).join(' > ');
                return `<option value="${folder.id}">${displayName}</option>`;
            }).join('');
    }

    addExerciseToRoutine() {
        const form = document.getElementById('exerciseForm');
        if (!form) return;
        
        const exercise = {
            nombre: form.exerciseName.value,
            equipamiento: form.exerciseEquipment.value,
            series_objetivo: parseInt(form.exerciseSets.value),
            repeticiones_objetivo: parseInt(form.exerciseReps.value),
            peso_objetivo: parseFloat(form.exerciseWeight.value),
            observaciones: form.exerciseNotes.value
        };

        this.currentEditingExercises = this.currentEditingExercises || [];
        this.currentEditingExercises.push(exercise);
        this.updateExercisesList();
        this.hideExerciseModal();
    }

    removeExercise(index) {
        if (this.currentEditingExercises) {
            this.currentEditingExercises.splice(index, 1);
            this.updateExercisesList();
        }
    }

    saveRoutine() {
        const nameInput = document.getElementById('routineName');
        const folderSelect = document.getElementById('routineFolder');
        if (!nameInput) return;
        
        const name = nameInput.value;
        const folderId = folderSelect ? folderSelect.value : null;
        const exercises = this.currentEditingExercises || [];

        if (!name || exercises.length === 0) {
            this.showNotification('Por favor completa el nombre y agrega al menos un ejercicio', 'error');
            return;
        }

        const routine = {
            id: this.editingRoutineId || Date.now().toString(),
            name: name,
            folderId: folderId || null,
            exercises: exercises,
            createdAt: this.editingRoutineId ? this.getRoutines().find(r => r.id === this.editingRoutineId)?.createdAt : new Date().toISOString()
        };

        if (this.editingRoutineId) {
            const index = this.routines.findIndex(r => r.id === this.editingRoutineId);
            if (index >= 0) {
                this.routines[index] = routine;
            }
        } else {
            this.routines.push(routine);
        }

        this.saveData();
        this.editingRoutineId = null;
        this.currentEditingExercises = [];
        this.showView('routines');
        this.showNotification('Rutina guardada correctamente', 'success');
    }

    editRoutine(routineId) {
        this.showRoutineEditor(routineId);
    }

    deleteRoutine(routineId) {
        this.showConfirmModal(
            'Eliminar Rutina',
            '¿Estás seguro de que quieres eliminar esta rutina?',
            () => {
                this.routines = this.routines.filter(r => r.id !== routineId);
                this.saveData();
                this.updateRoutinesList();
                this.showNotification('Rutina eliminada', 'success');
            }
        );
    }

    // Select Routine for Workout
    updateSelectRoutineList() {
        const container = document.getElementById('selectRoutineList');
        if (!container) return;
        
        const routines = this.getRoutines();

        if (routines.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No tienes rutinas disponibles</p>
                    <button class="btn btn--primary" onclick="app.showView('routines')">Crear Rutina</button>
                </div>
            `;
            return;
        }

        container.innerHTML = routines.map(routine => `
            <div class="select-routine-item" onclick="startWorkout('${routine.id}')">
                <h3>${routine.name}</h3>
                <p>${routine.exercises.length} ejercicios</p>
            </div>
        `).join('');
    }

    // Workout Mode with Enhanced Navigation
    startWorkout(routineId) {
        const routine = this.getRoutines().find(r => r.id === routineId);
        if (!routine) return;

        this.currentRoutine = routine;
        this.currentWorkout = {
            id: Date.now().toString(),
            routineId: routineId,
            routineName: routine.name,
            date: new Date().toISOString(),
            exercises: routine.exercises.map(ex => ({
                ...ex,
                sets: Array(ex.series_objetivo).fill(null).map(() => ({
                    weight: ex.peso_objetivo,
                    reps: ex.repeticiones_objetivo,
                    effort: null
                }))
            }))
        };

        this.showView('workoutOverview');
        this.updateWorkoutOverview();
    }

    updateWorkoutOverview() {
        if (!this.currentWorkout) return;

        const titleEl = document.getElementById('workoutOverviewTitle');
        if (titleEl) titleEl.textContent = this.currentRoutine.name;

        const container = document.getElementById('workoutExercisesList');
        if (!container) return;

        container.innerHTML = this.currentWorkout.exercises.map((exercise, index) => {
            const completedSets = exercise.sets.filter(s => s.effort !== null).length;
            const lastWorkoutData = this.getLastWorkoutData(exercise.nombre);
            
            return `
                <div class="workout-exercise-item" onclick="showExerciseDetail(${index})">
                    <div class="workout-exercise-header">
                        <h3 class="workout-exercise-title">${exercise.nombre}</h3>
                        <span class="workout-exercise-progress">${completedSets}/${exercise.series_objetivo}</span>
                    </div>
                    <div class="workout-exercise-details">
                        <div><strong>${exercise.series_objetivo}</strong> series</div>
                        <div><strong>${exercise.repeticiones_objetivo}</strong> reps</div>
                        <div><strong>${exercise.peso_objetivo}</strong> kg</div>
                        <div class="exercise-equipment">${exercise.equipamiento}</div>
                    </div>
                    ${lastWorkoutData ? `
                        <div class="workout-last-reference">
                            <div class="last-ref-title">Referencia del último entrenamiento:</div>
                            <div class="last-ref-details">
                                <span class="last-ref-target">Rutina: ${exercise.peso_objetivo}kg</span>
                                <span class="last-ref-actual">
                                    Último: ${lastWorkoutData.weight}kg ${this.effortColors[lastWorkoutData.effort]?.icon || '⚪'}
                                </span>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    getLastWorkoutData(exerciseName) {
        const workouts = this.getWorkouts().slice().reverse();
        for (let workout of workouts) {
            for (let exercise of workout.exercises) {
                if (exercise.nombre === exerciseName && exercise.sets && exercise.sets.length > 0) {
                    const lastSet = exercise.sets[exercise.sets.length - 1];
                    if (lastSet.effort) {
                        return {
                            weight: lastSet.weight,
                            effort: lastSet.effort
                        };
                    }
                }
            }
        }
        return null;
    }

    showExerciseDetail(exerciseIndex) {
        this.currentExerciseIndex = exerciseIndex;
        this.showView('exerciseDetail');
        this.showWorkoutNavigation();
        this.updateExerciseDetail();
    }

    updateExerciseDetail() {
        if (!this.currentWorkout) return;

        const exercise = this.currentWorkout.exercises[this.currentExerciseIndex];
        const titleEl = document.getElementById('exerciseDetailTitle');
        if (titleEl) titleEl.textContent = exercise.nombre;

        const container = document.getElementById('exerciseDetailContent');
        if (!container) return;

        const lastWorkoutData = this.getLastWorkoutData(exercise.nombre);

        container.innerHTML = `
            <div class="exercise-target-summary">
                <div class="target-grid">
                    <div class="target-item">
                        <div class="target-value">${exercise.series_objetivo}</div>
                        <div class="target-label">Series</div>
                    </div>
                    <div class="target-item">
                        <div class="target-value">${exercise.repeticiones_objetivo}</div>
                        <div class="target-label">Reps</div>
                    </div>
                    <div class="target-item">
                        <div class="target-value">${exercise.peso_objetivo}</div>
                        <div class="target-label">Peso (kg)</div>
                    </div>
                    <div class="target-item">
                        <div class="target-value">${exercise.equipamiento}</div>
                        <div class="target-label">Equipamiento</div>
                    </div>
                </div>
            </div>

            ${lastWorkoutData ? `
                <div class="last-workout-reference">
                    <div class="last-workout-title">Referencia del último entrenamiento:</div>
                    <div class="last-workout-comparison">
                        <span class="target-weight">Rutina: ${exercise.peso_objetivo}kg</span>
                        <span class="actual-weight">
                            Último: ${lastWorkoutData.weight}kg ${this.effortColors[lastWorkoutData.effort]?.icon || '⚪'}
                        </span>
                    </div>
                </div>
            ` : ''}

            <div class="sets-tracker">
                <h4>Registrar Series</h4>
                <div class="effort-legend">
                    <div class="effort-legend-item">
                        <span class="effort-indicator effort-indicator--easy"></span>
                        <span>Fácil</span>
                    </div>
                    <div class="effort-legend-item">
                        <span class="effort-indicator effort-indicator--hard"></span>
                        <span>Difícil</span>
                    </div>
                    <div class="effort-legend-item">
                        <span class="effort-indicator effort-indicator--failure"></span>
                        <span>Fallo</span>
                    </div>
                </div>
                <div class="sets-grid">
                    ${exercise.sets.map((set, setIndex) => `
                        <div class="set-row ${set.effort ? 'effort-' + set.effort : ''}">
                            <div class="set-number">S${setIndex + 1}</div>
                            <input type="number" class="set-input" placeholder="Peso" 
                                   value="${set.weight}" step="0.25" min="0"
                                   onchange="updateSet(${this.currentExerciseIndex}, ${setIndex}, 'weight', this.value)">
                            <input type="number" class="set-input" placeholder="Reps" 
                                   value="${set.reps}" min="0" max="50"
                                   onchange="updateSet(${this.currentExerciseIndex}, ${setIndex}, 'reps', this.value)">
                            <div class="effort-buttons">
                                <button type="button" class="effort-btn effort-btn--easy ${set.effort === 'easy' ? 'active' : ''}"
                                        onclick="updateSet(${this.currentExerciseIndex}, ${setIndex}, 'effort', 'easy')">🟢</button>
                                <button type="button" class="effort-btn effort-btn--hard ${set.effort === 'hard' ? 'active' : ''}"
                                        onclick="updateSet(${this.currentExerciseIndex}, ${setIndex}, 'effort', 'hard')">🟡</button>
                                <button type="button" class="effort-btn effort-btn--failure ${set.effort === 'failure' ? 'active' : ''}"
                                        onclick="updateSet(${this.currentExerciseIndex}, ${setIndex}, 'effort', 'failure')">🔴</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            ${exercise.observaciones ? `
                <div class="workout-notes">
                    <strong>Notas:</strong> ${exercise.observaciones}
                </div>
            ` : ''}
        `;
        
        this.updateWorkoutNavigationButtons();
    }

    updateSet(exerciseIndex, setIndex, field, value) {
        if (!this.currentWorkout) return;
        
        if (field === 'weight' || field === 'reps') {
            value = parseFloat(value) || 0;
        }
        
        this.currentWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
        
        if (field === 'effort') {
            this.updateExerciseDetail();
            this.updateWorkoutOverview();
        }
    }

    finishWorkout() {
        this.showConfirmModal(
            'Finalizar Entrenamiento',
            '¿Quieres terminar este entrenamiento?',
            () => {
                if (this.currentWorkout) {
                    this.workouts.push(this.currentWorkout);
                    this.saveData();
                    this.showWorkoutSummary();
                    this.currentWorkout = null;
                    this.currentRoutine = null;
                    this.currentExerciseIndex = 0;
                    this.hideWorkoutNavigation();
                }
            }
        );
    }

    showWorkoutSummary() {
        if (!this.currentWorkout) return;
        
        const workout = this.currentWorkout;
        const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
        const completedSets = workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.effort !== null).length, 0);
        const totalVolume = workout.exercises.reduce((sum, ex) => {
            return sum + ex.sets.reduce((exSum, set) => exSum + (set.weight * set.reps), 0);
        }, 0);

        const summaryContent = document.getElementById('workoutSummaryContent');
        if (summaryContent) {
            summaryContent.innerHTML = `
                <h4>¡Entrenamiento completado!</h4>
                <div class="summary-stats">
                    <div class="summary-stat">
                        <div class="stat-value">${completedSets}/${totalSets}</div>
                        <div class="stat-label">Series Registradas</div>
                    </div>
                    <div class="summary-stat">
                        <div class="stat-value">${totalVolume.toFixed(0)}</div>
                        <div class="stat-label">Volumen Total (kg)</div>
                    </div>
                </div>
                <div class="motivation-message">
                    ${this.getMotivationalMessage(completedSets, totalSets)}
                </div>
            `;
        }

        this.showModal('workoutSummaryModal');
    }

    getMotivationalMessage(completed, total) {
        const percentage = (completed / total) * 100;
        if (percentage === 100) return "¡Perfecto! Registraste todas las series 💪";
        if (percentage >= 80) return "¡Excelente trabajo! Casi lo completaste todo 🔥";
        if (percentage >= 60) return "¡Buen esfuerzo! Sigue así la próxima vez 👏";
        return "Todo esfuerzo cuenta. ¡La próxima será mejor! 💪";
    }

    // History with Edit Functionality
    updateHistoryList() {
        const container = document.getElementById('historyList');
        if (!container) return;
        
        const workouts = this.getWorkouts().slice().reverse();

        if (workouts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <p>No hay entrenamientos en el historial</p>
                </div>
            `;
            return;
        }

        container.innerHTML = workouts.map(workout => `
            <div class="history-item">
                <div class="history-header">
                    <h4>${workout.routineName}</h4>
                    <span class="history-date">${this.formatDate(workout.date)}</span>
                </div>
                <div class="history-exercises">
                    ${workout.exercises.length} ejercicios - 
                    ${workout.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.effort !== null).length, 0)} series registradas
                </div>
                <div class="history-actions">
                    <button class="btn btn--sm btn--secondary" onclick="editWorkout('${workout.id}')">Editar</button>
                </div>
            </div>
        `).join('');
    }

    editWorkout(workoutId) {
        this.editingWorkoutId = workoutId;
        const workout = this.getWorkouts().find(w => w.id === workoutId);
        if (!workout) return;

        this.showView('editWorkout');
        
        const dateInput = document.getElementById('editWorkoutDate');
        if (dateInput) {
            dateInput.value = workout.date.split('T')[0];
        }

        this.updateEditWorkoutForm(workout);
    }

    updateEditWorkoutForm(workout) {
        const container = document.getElementById('editWorkoutExercises');
        if (!container) return;

        container.innerHTML = workout.exercises.map((exercise, exerciseIndex) => `
            <div class="edit-exercise-section">
                <div class="edit-exercise-header">
                    <h3 class="edit-exercise-title">${exercise.nombre}</h3>
                </div>
                <div class="edit-sets-grid">
                    ${exercise.sets.map((set, setIndex) => `
                        <div class="edit-set-row">
                            <div class="set-number">S${setIndex + 1}</div>
                            <input type="number" class="set-input" value="${set.weight}" step="0.25" min="0"
                                   onchange="updateEditingSet(${exerciseIndex}, ${setIndex}, 'weight', this.value)">
                            <input type="number" class="set-input" value="${set.reps}" min="0"
                                   onchange="updateEditingSet(${exerciseIndex}, ${setIndex}, 'reps', this.value)">
                            <div class="effort-buttons">
                                <button type="button" class="effort-btn effort-btn--easy ${set.effort === 'easy' ? 'active' : ''}"
                                        onclick="updateEditingSet(${exerciseIndex}, ${setIndex}, 'effort', 'easy')">🟢</button>
                                <button type="button" class="effort-btn effort-btn--hard ${set.effort === 'hard' ? 'active' : ''}"
                                        onclick="updateEditingSet(${exerciseIndex}, ${setIndex}, 'effort', 'hard')">🟡</button>
                                <button type="button" class="effort-btn effort-btn--failure ${set.effort === 'failure' ? 'active' : ''}"
                                        onclick="updateEditingSet(${exerciseIndex}, ${setIndex}, 'effort', 'failure')">🔴</button>
                            </div>
                            <span class="effort-indicator effort-indicator--${set.effort || 'none'}"></span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    updateEditingSet(exerciseIndex, setIndex, field, value) {
        const workout = this.getWorkouts().find(w => w.id === this.editingWorkoutId);
        if (!workout) return;

        if (field === 'weight' || field === 'reps') {
            value = parseFloat(value) || 0;
        }
        
        workout.exercises[exerciseIndex].sets[setIndex][field] = value;
        
        if (field === 'effort') {
            this.updateEditWorkoutForm(workout);
        }
    }

    saveEditedWorkout() {
        const dateInput = document.getElementById('editWorkoutDate');
        if (!dateInput || !this.editingWorkoutId) return;

        const workoutIndex = this.workouts.findIndex(w => w.id === this.editingWorkoutId);
        if (workoutIndex >= 0) {
            this.workouts[workoutIndex].date = new Date(dateInput.value).toISOString();
            this.saveData();
            this.editingWorkoutId = null;
            this.showView('history');
            this.showNotification('Entrenamiento actualizado', 'success');
        }
    }

    // Progress
    updateProgressView() {
        const container = document.getElementById('progressContent');
        if (!container) return;
        
        const workouts = this.getWorkouts();

        if (workouts.length < 2) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📈</div>
                    <p>Necesitas al menos 2 entrenamientos para ver tu progreso</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="progress-summary">
                <h3>Resumen de Progreso</h3>
                <p>Total de entrenamientos: ${workouts.length}</p>
                <p>Promedio semanal: ${(workouts.length / this.getWeeksSinceFirst()).toFixed(1)} entrenamientos</p>
            </div>
        `;
    }

    updateBackupConfigView() {
        // Update backup status information
        const lastAutoBackupEl = document.getElementById('lastAutoBackup');
        const lastManualBackupEl = document.getElementById('lastManualBackup');
        const storedBackupsEl = document.getElementById('storedBackups');
        const autoBackupCheckbox = document.getElementById('autoBackupEnabled');
        const backupRemindersCheckbox = document.getElementById('backupRemindersEnabled');

        if (lastAutoBackupEl) {
            const lastAuto = this.backupData.lastAutoBackup;
            lastAutoBackupEl.textContent = lastAuto ? this.formatDate(lastAuto) : 'Nunca';
        }

        if (lastManualBackupEl) {
            const lastManual = this.backupData.lastManualBackup;
            lastManualBackupEl.textContent = lastManual ? this.formatDate(lastManual) : 'Nunca';
        }

        if (storedBackupsEl) {
            storedBackupsEl.textContent = this.backupData.backupVersions.length;
        }

        if (autoBackupCheckbox) {
            autoBackupCheckbox.checked = this.settings.autoBackup;
        }

        if (backupRemindersCheckbox) {
            backupRemindersCheckbox.checked = this.settings.backupReminders;
        }
    }

    getWeeksSinceFirst() {
        const workouts = this.getWorkouts();
        if (workouts.length === 0) return 1;
        
        const first = new Date(workouts[0].date);
        const now = new Date();
        return Math.max(1, Math.ceil((now - first) / (1000 * 60 * 60 * 24 * 7)));
    }

    // Utility Methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showConfirmModal(title, message, onConfirm) {
        const titleEl = document.getElementById('confirmTitle');
        const messageEl = document.getElementById('confirmMessage');
        const confirmBtn = document.getElementById('confirmOk');
        
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                this.hideModal('confirmModal');
                onConfirm();
            };
        }
        
        this.showModal('confirmModal');
    }

    applyTheme() {
        const theme = this.settings.theme || 'light';
        document.documentElement.setAttribute('data-color-scheme', theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
        }
        
        this.settings.theme = newTheme;
        this.saveData();
    }

    addSampleData() {
        // Enhanced sample data with nested folders
        const sampleFolders = [
            { id: '1', name: 'Preparación Competencia', parentId: null, createdAt: new Date().toISOString() },
            { id: '1a', name: 'Fase Fuerza', parentId: '1', createdAt: new Date().toISOString() },
            { id: '1b', name: 'Fase Hipertrofia', parentId: '1', createdAt: new Date().toISOString() },
            { id: '1c', name: 'Fase Definición', parentId: '1', createdAt: new Date().toISOString() },
            { id: '2', name: 'Mantenimiento', parentId: null, createdAt: new Date().toISOString() },
            { id: '2a', name: 'Rutinas Básicas', parentId: '2', createdAt: new Date().toISOString() },
            { id: '3', name: 'Rehabilitación', parentId: null, createdAt: new Date().toISOString() }
        ];
        this.folders = sampleFolders;

        // Sample routines distributed in folders
        const sampleRoutines = [
            {
                id: Date.now().toString(),
                name: "Push A - Pecho y Hombros",
                folderId: '1b', // Fase Hipertrofia
                exercises: [
                    {
                        nombre: "Press de Banca",
                        equipamiento: "Barra",
                        series_objetivo: 4,
                        repeticiones_objetivo: 8,
                        peso_objetivo: 85.0,
                        observaciones: "Mantener escápulas retraídas"
                    },
                    {
                        nombre: "Press con Mancuernas",
                        equipamiento: "Mancuernas",
                        series_objetivo: 3,
                        repeticiones_objetivo: 10,
                        peso_objetivo: 35.0,
                        observaciones: "Peso por mancuerna, rango completo"
                    },
                    {
                        nombre: "Elevaciones Laterales",
                        equipamiento: "Mancuernas",
                        series_objetivo: 3,
                        repeticiones_objetivo: 15,
                        peso_objetivo: 15.0,
                        observaciones: "Tempo controlado 2-1-2"
                    }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: (Date.now() + 1).toString(),
                name: "Fuerza 5x5",
                folderId: '1a', // Fase Fuerza
                exercises: [
                    {
                        nombre: "Sentadillas",
                        equipamiento: "Barra",
                        series_objetivo: 5,
                        repeticiones_objetivo: 5,
                        peso_objetivo: 120.0,
                        observaciones: "Fuerza máxima"
                    }
                ],
                createdAt: new Date().toISOString()
            },
            {
                id: (Date.now() + 2).toString(),
                name: "Full Body A",
                folderId: '2a', // Rutinas Básicas
                exercises: [
                    {
                        nombre: "Sentadillas",
                        equipamiento: "Barra",
                        series_objetivo: 3,
                        repeticiones_objetivo: 12,
                        peso_objetivo: 80.0,
                        observaciones: "Mantenimiento general"
                    }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        this.routines.push(...sampleRoutines);

        // Sample workout
        const sampleWorkout = {
            id: "1",
            routineId: sampleRoutines[0].id,
            routineName: "Push A - Pecho y Hombros",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            exercises: [
                {
                    nombre: "Press de Banca",
                    equipamiento: "Barra",
                    series_objetivo: 4,
                    repeticiones_objetivo: 8,
                    peso_objetivo: 85.0,
                    sets: [
                        { weight: 80.0, reps: 8, effort: "easy" },
                        { weight: 85.0, reps: 8, effort: "hard" },
                        { weight: 85.0, reps: 7, effort: "failure" },
                        { weight: 80.0, reps: 8, effort: "hard" }
                    ]
                }
            ]
        };

        this.workouts.push(sampleWorkout);
        
        // Initialize backup data
        this.backupData.lastAutoBackup = new Date().toISOString();
        
        this.saveData();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GymTrackerV3();
});
