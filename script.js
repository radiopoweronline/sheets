// Radio Player - Optimizado para performance
class RadioPlayer {
    constructor() {
        this.isRadioPlaying = false;
        this.isLoading = false;
        this.initializeElements();
        this.bindEvents();
        this.setInitialVolume();
    }

    initializeElements() {
        this.radioStream = document.getElementById('radio-stream');
        this.volumeControl = document.getElementById('radio-volume');
        this.playBtn = document.getElementById('radio-play-btn');
        this.radioStatus = document.getElementById('radio-status');
        this.radioInfo = document.getElementById('radio-info');
        this.playIcon = document.getElementById('radio-play-icon');
        this.pauseIcon = document.getElementById('radio-pause-icon');
        
        if (!this.checkElements()) {
            console.error('Elementos del reproductor no encontrados');
            return;
        }
    }

    checkElements() {
        return this.radioStream && this.volumeControl && this.playBtn && 
               this.radioStatus && this.radioInfo && this.playIcon && this.pauseIcon;
    }

    bindEvents() {
        if (this.volumeControl) {
            this.volumeControl.addEventListener('input', this.handleVolumeChange.bind(this));
        }
        
        if (this.playBtn) {
            this.playBtn.addEventListener('click', this.toggleRadio.bind(this));
        }

        this.bindRadioEvents();
    }

    bindRadioEvents() {
        if (!this.radioStream) return;

        this.radioStream.addEventListener('waiting', this.handleBuffering.bind(this));
        this.radioStream.addEventListener('canplay', this.handleCanPlay.bind(this));
        this.radioStream.addEventListener('error', this.handleError.bind(this));
        this.radioStream.addEventListener('loadstart', this.handleLoadStart.bind(this));
    }

    setInitialVolume() {
        if (this.radioStream && this.volumeControl) {
            this.radioStream.volume = this.volumeControl.value / 100;
        }
    }

    handleVolumeChange(e) {
        if (this.radioStream) {
            this.radioStream.volume = e.target.value / 100;
        }
    }

    handleLoadStart() {
        this.isLoading = true;
        this.updateUI('Cargando...', 'Conectando al servidor');
    }

    handleBuffering() {
        this.updateUI('Buffering...', 'Esperando datos del streaming');
    }

    handleCanPlay() {
        this.isLoading = false;
        if (this.isRadioPlaying) {
            this.updateUI('Reproduciendo en vivo', 'Radio Power - Música en vivo 24/7');
        }
    }

    handleError(e) {
        console.error('Error en el stream de audio:', e);
        this.isLoading = false;
        this.isRadioPlaying = false;
        this.updateUI('Error de conexión', 'Intenta de nuevo en unos momentos');
        this.updatePlayButton(false);
    }

    updateUI(status, info) {
        if (this.radioStatus) this.radioStatus.textContent = status;
        if (this.radioInfo) this.radioInfo.textContent = info;
    }

    updatePlayButton(playing) {
        if (playing) {
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
        } else {
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
        }
    }

    async startRadio() {
        if (!this.radioStream) return;

        this.isLoading = true;
        this.updateUI('Conectando...', 'Cargando streaming');
        
        try {
            // Usar el stream actual o recargar si es necesario
            if (!this.radioStream.src) {
                this.radioStream.src = 'https://stream.zeno.fm/dlvtl3hthyxvv';
            }
            
            await this.radioStream.play();
            this.isRadioPlaying = true;
            this.isLoading = false;
            this.updatePlayButton(true);
            this.updateUI('Reproduciendo en vivo', 'Radio Power - Música en vivo 24/7');
            
        } catch (error) {
            console.error('Error al reproducir:', error);
            this.handleError(error);
        }
    }

    stopRadio() {
        if (this.radioStream) {
            this.radioStream.pause();
        }
        this.isRadioPlaying = false;
        this.isLoading = false;
        this.updatePlayButton(false);
        this.updateUI('Radio Power', 'Música en vivo 24/7');
    }

    toggleRadio() {
        if (this.isLoading) return;
        
        if (this.isRadioPlaying) {
            this.stopRadio();
        } else {
            this.startRadio();
        }
    }
}

// Mobile Menu - Optimizado
class MobileMenu {
    constructor() {
        this.menuBtn = document.getElementById('mobile-menu-btn');
        this.menu = document.getElementById('mobile-menu');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.menu) {
            console.warn('Elementos de menú móvil no encontrados');
            return;
        }

        this.menuBtn.addEventListener('click', this.toggle.bind(this));
        
        // Cerrar menú al hacer clic en enlaces
        this.menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.menu.contains(e.target) && !this.menuBtn.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.menu.classList.remove('hidden');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.menu.classList.add('hidden');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// Smooth Scrolling - Optimizado
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleClick.bind(this));
        });
    }

    handleClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            this.scrollToElement(targetElement);
        }
    }

    scrollToElement(element) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Cerrar menú móvil si está abierto
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
}

// Modal Manager - Optimizado
class ModalManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.init();
    }

    init() {
        if (!this.modal) {
            console.warn('Modal no encontrado');
            return;
        }

        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Cerrar modal haciendo clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    openModal(element, title, description, imageUrl) {
        if (!this.modal) return;

        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');

        if (modalImage) modalImage.src = imageUrl || '';
        if (modalTitle) modalTitle.textContent = title || '';
        if (modalDescription) modalDescription.textContent = description || '';

        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}

// Image Protection
class ImageProtector {
    constructor() {
        this.init();
    }

    init() {
        // Prevenir clic derecho en imágenes
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Prevenir arrastre de imágenes
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }
}

// Main Application - Inicialización optimizada
class RadioPowerApp {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            this.components.radioPlayer = new RadioPlayer();
            this.components.mobileMenu = new MobileMenu();
            this.components.scroller = new SmoothScroller();
            this.components.modalManager = new ModalManager();
            this.components.imageProtector = new ImageProtector();

            this.setCurrentYear();
            this.setupGlobalFunctions();
            
            console.log('Radio Power App inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
        }
    }

    setCurrentYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupGlobalFunctions() {
        // Funciones globales para compatibilidad
        window.openModal = (elem, titulo, descripcion, url) => {
            this.components.modalManager.openModal(elem, titulo, descripcion, url);
        };

        window.closeModal = () => {
            this.components.modalManager.closeModal();
        };
    }
}

// Inicializar la aplicación
const radioPowerApp = new RadioPowerApp();

// Exportar para uso global (si es necesario)
window.RadioPowerApp = radioPowerApp;