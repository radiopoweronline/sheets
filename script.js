document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.error('Elementos de menú móvil no encontrados');
    }

    // Slider functionality
    const slider = document.querySelector('.slider');
    const slidesContainer = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;
    let slides = [];

    // URL de Google Sheets publicada como TSV (ajusta con tu URL)
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/TU_SHEET_ID/pub?output=tsv'; // Reemplaza con tu URL

    async function loadSlidesFromSheets() {
        try {
            // Fetch datos de Google Sheets
            const response = await fetch(sheetUrl);
            const data = await response.text();
            const rows = data.split('\n').map(row => row.split('\t')); // Para TSV
            const images = rows.slice(1).map(row => row[0]).filter(url => url); // URLs de imágenes

            // Limpia contenedor
            slidesContainer.innerHTML = '';

            // Crea slides dinámicamente
            images.forEach((imgUrl, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide';
                slide.style.opacity = index === 0 ? '1' : '0'; // Primer slide visible
                slide.innerHTML = `<img src="${imgUrl}" alt="Slide ${index + 1}">`;
                slidesContainer.appendChild(slide);
            });

            slides = document.querySelectorAll('.slide');

            // Inicia slider
            if (slides.length > 0) {
                showSlide(currentSlide);
            } else {
                console.error('No se encontraron imágenes en Google Sheets');
            }
        } catch (error) {
            console.error('Error cargando imágenes de Google Sheets:', error);
        }
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transition = 'opacity 0.5s ease-in-out'; // Efecto fade
            slide.style.opacity = i === index ? '1' : '0';
        });
        currentSlide = index;
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    // Controles del slider
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    } else {
        console.error('Botones de slider no encontrados');
    }

    // Carga imágenes al iniciar
    loadSlidesFromSheets();

    // Auto-avance opcional (cada 5 segundos)
    setInterval(nextSlide, 5000);

    // Radio Player Functionality
    let isRadioPlaying = false;
    const radioStream = document.getElementById('radio-stream');
    const volumeControl = document.getElementById('radio-volume');
    const playBtn = document.getElementById('radio-play-btn');
    const radioStatus = document.getElementById('radio-status');
    const radioInfo = document.getElementById('radio-info');
    const closePlayer = document.getElementById('close-player');

    if (!radioStream || !volumeControl || !playBtn || !radioStatus || !radioInfo) {
        console.error('Faltan elementos del reproductor en el DOM');
        return;
    }

    // Set initial volume
    radioStream.volume = volumeControl.value / 100;

    // Volume control
    volumeControl.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        radioStream.volume = volume;
        console.log('Volumen ajustado a:', volume);
    });

    function showRadioPlayer() {
        document.getElementById('floating-player').classList.remove('hidden');
    }

    function hideRadioPlayer() {
        document.getElementById('floating-player').classList.add('hidden');
        stopRadio();
    }

    function startRadio() {
        radioStatus.textContent = 'Conectando...';
        radioInfo.textContent = 'Cargando streaming';

        radioStream.src = 'https://stream.zeno.fm/dlvtl3hthyxvv';
        radioStream.load();

        const onCanPlay = () => {
            isRadioPlaying = true;
            document.getElementById('radio-play-icon').classList.add('hidden');
            document.getElementById('radio-pause-icon').classList.remove('hidden');
            radioStatus.textContent = 'Reproduciendo en vivo';
            radioInfo.textContent = 'Radio Power - Música en vivo 24/7';
            radioStream.removeEventListener('canplay', onCanPlay);
        };

        radioStream.addEventListener('canplay', onCanPlay);

        radioStream.play().catch((error) => {
            console.error('Error al reproducir:', error);
            radioStatus.textContent = 'Error de conexión';
            radioInfo.textContent = 'Intenta de nuevo en unos momentos';
            radioStream.removeEventListener('canplay', onCanPlay);
        });
    }

    function stopRadio() {
        radioStream.pause();
        isRadioPlaying = false;
        document.getElementById('radio-play-icon').classList.remove('hidden');
        document.getElementById('radio-pause-icon').classList.add('hidden');
        radioStatus.textContent = 'Radio Power';
        radioInfo.textContent = 'Música en vivo 24/7';
    }

    function toggleRadio() {
        if (isRadioPlaying) {
            stopRadio();
        } else {
            startRadio();
        }
    }

    // Radio controls
    playBtn.addEventListener('click', toggleRadio);
    if (closePlayer) {
        closePlayer.addEventListener('click', hideRadioPlayer);
    } else {
        console.error('Botón de cerrar reproductor no encontrado');
    }

    // Indicador de buffering
    radioStream.addEventListener('waiting', () => {
        radioStatus.textContent = 'Buffering...';
        radioInfo.textContent = 'Esperando datos del streaming';
    });

    // Manejo de errores del stream
    radioStream.addEventListener('error', (e) => {
        console.error('Error en el stream de audio:', e);
        radioStatus.textContent = 'Error en el stream';
        radioInfo.textContent = 'No se pudo cargar el audio';
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Modal functionality
    window.openModal = function (element, title, description) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalImage = document.getElementById('modalImage');

        if (!modal || !modalTitle || !modalDescription || !modalImage || !element) {
            console.error('Faltan elementos del modal o del elemento clickeado');
            return;
        }

        const imageUrl = element.querySelector('img').src;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.src = imageUrl;
        modalImage.alt = title;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});
