const registerForm = document.querySelector('.form-register');

async function obtenerUltimoIdUsuario() {
    const res = await fetch("http://localhost:5000/api/auth/ultimo")
    const data = await res.json()

    console.log(data)

    return data.idUsuario
}



async function crearCliente(nombre,email,telefono){
    const cliente = {
        "idUsuario": await obtenerUltimoIdUsuario(),
        "nombreCompleto": nombre,
        "correo": email,
        "telefono": telefono
    }
    console.log(cliente)
    return cliente
}

async function registrarCliente(cliente) {
    try {
        const res = await fetch(`http://localhost:5000/api/clientes/register`,{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(cliente)
        })
        const data = await res.json();
        console.log(data)

        // if (res.ok) {
        //     alert(data.message);
        // } else {
        //     alert(data.error);
        // }
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        alert('Hubo un problema de conexión. Por favor, intenta de nuevo.');
    }
}

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = registerForm.querySelectorAll('input');

    const nombre = inputs[0].value;
    const email = inputs[1].value;
    const telefono = inputs[2].value;
    const password = inputs[3].value;
    const confirmPassword = inputs[4].value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, verifica.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreCompleto: nombre, 
                correo: email,         
                password: password,
                telefono: telefono,
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = '../login.html';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Hubo un problema de conexión. Por favor, intenta de nuevo.');
    }

    const cliente = await crearCliente(nombre,email,telefono);
    console.log(cliente)
    await registrarCliente(cliente)
});