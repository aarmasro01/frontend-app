// Seleccionamos el formulario por su clase
const loginForm = document.querySelector('.form-login');

// Seleccionamos los campos de entrada dentro del formulario por su tipo
const emailInput = loginForm.querySelector('input[type="text"]');
const passwordInput = loginForm.querySelector('input[type="text"]:nth-of-type(2)');

// Agregamos un "escuchador de eventos" para cuando se envíe el formulario
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtenemos los valores de los campos
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('carrito', JSON.stringify([]));
            alert(data.message || data.msg || 'Inicio de sesión exitoso!');
            window.location.href = 'index.html';
        } else {
            alert(data.message || data.msg || data.error || 'Credenciales inválidas');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Hubo un problema de conexión. Intenta de nuevo más tarde.');
    }
});