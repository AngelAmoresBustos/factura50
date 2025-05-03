document.addEventListener('DOMContentLoaded', function() {
    irArriba(); // Inicializar botón ir arriba
    setupContactForm(); // Inicializar formulario de contacto
    putCookieOnPlanSelection(); // Inicializar cookies para planes
});

function irArriba() {
    const scrollTopButton = document.querySelector('.scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopButton.classList.add('show');
        } else {
            scrollTopButton.classList.remove('show');
        }
    });

    scrollTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío normal del formulario
        if (validateForm()) {
            sendFormData();
        }
    });
}


function validateForm() {
    let isValid = true;
    const nombre = document.getElementById('clienteNombre');
    const correo = document.getElementById('clienteCorreo');
    const mensaje = document.getElementById('clienteMensaje');

    if (!nombre.value.trim()) {
        nombre.classList.add('is-invalid');
        isValid = false;
    } else {
        nombre.classList.remove('is-invalid');
    }

    if (!isValidEmail(correo.value.trim())) {
        correo.classList.add('is-invalid');
        isValid = false;
    } else {
        correo.classList.remove('is-invalid');
    }

    if (!mensaje.value.trim()) {
        mensaje.classList.add('is-invalid');
        isValid = false;
    } else {
        mensaje.classList.remove('is-invalid');
    }

    return isValid;
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function sendFormData() {
    const nombre = document.getElementById('clienteNombre').value;
    const correo = document.getElementById('clienteCorreo').value;
    const mensaje = document.getElementById('clienteMensaje').value;

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('correo', correo);
    formData.append('mensaje', mensaje);

    fetch('controller/guardarcorreo.php', { // Asegúrate de que la ruta sea correcta
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'ok') {
            Swal({
                title: "¡Mensaje Enviado!",
                text: "Gracias por escribirnos, pronto tendrás noticias nuestras.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    resetForm();
                }
            });
        } else {
            swal({
                title: "Error",
                text: "El correo no pudo ser enviado. Por favor, intenta nuevamente.",
                icon: "error",
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        console.error('Error al enviar el formulario:', error);
        Swal({
            title: "Error",
            text: "Hubo un problema al enviar el mensaje. Por favor, intenta nuevamente más tarde.",
            icon: "error",
            confirmButtonText: 'OK'
        });
    });
}


function resetForm() {
    document.getElementById('clienteNombre').value = '';
    document.getElementById('clienteCorreo').value = '';
    document.getElementById('clienteMensaje').value = '';
}


function putCookieOnPlanSelection() {
    const planButtons = document.querySelectorAll('.btn-plan');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planId = this.closest('.plan-card').querySelector('h3').textContent; // Obtener el nombre del plan
            let cookieValue;

            switch (planId) {
                case 'Mini': cookieValue = 1; break;
                case 'Basic': cookieValue = 2; break;
                case 'Pro': cookieValue = 3; break;
                case 'Premium': cookieValue = 4; break;
                default: cookieValue = 0; // Valor por defecto o error
            }
            if (cookieValue) {
                setCookie('plan', cookieValue, 0.0156); // Duración de la cookie como en tu código original
            }
        });
    });
}