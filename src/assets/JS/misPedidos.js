const btnVerDetalle = document.querySelectorAll(".btn-detalles");

btnVerDetalle.forEach(btn =>{
    btn.addEventListener("click",()=>{
        window.location.href = "../VISTAS/seguimiento-pedido.html"
    })
})