const btnsPedido = document.querySelectorAll(".btn-detalles");


btnsPedido.forEach(btn =>{
    btn.addEventListener("click",()=>{
        verMiPedido()
    })
})

function verMiPedido(){
    window.location.href = "../FRONTEND/VISTAS/detallePedido.html"
}