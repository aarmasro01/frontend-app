const resetPasswordForm = document.getElementById('reset-password-form');
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || data.msg || data.error || 'Contraseña actualizada.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || data.msg || data.error || 'Ocurrió un error.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema de conexión. Intenta de nuevo más tarde.');
    }
});