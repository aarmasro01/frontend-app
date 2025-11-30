(()=>{   

    const imgPerfilUsuario = document.getElementById("img-perfil-usuario")
    const labelNombreUsuario = document.getElementById("nombre-completo__usuario");
    const inputCorreoUsuario = document.getElementById("input-correo-perfil")
    const inputTelefonoUsuario = document.getElementById("input-telefono-perfil")

    // async function obtenerUsuario() {
    // const res = await fetch("../FRONTEND/JSON/usuario.json")
    // const data = await res.json();

    // console.log(data)
    // mostrarPerfil(data.usuario)
    // }

    // obtenerUsuario()

    function bloquearCorreoTelefono(){
        inputCorreoUsuario.disabled = true
        inputTelefonoUsuario.disabled = true
    }



    function mostrarPerfil(usuario){
        imgPerfilUsuario.setAttribute("src",`../FRONTEND/IMAGES/${usuario.imagenPerfil}`);
        labelNombreUsuario.textContent = usuario.nombreCompleto.toUpperCase()
        inputCorreoUsuario.value = usuario.correo
        inputTelefonoUsuario.value = usuario.telefono
        bloquearCorreoTelefono()
    }

    mostrarPerfil(window.usuario)

    const btnMisPedidos = document.getElementById("btn-misPedidos");

    btnMisPedidos.addEventListener("click",()=>{
        window.location.href = "../FRONTEND/VISTAS/misPedidos.html"
    })
})();
