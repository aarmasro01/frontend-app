const btnInicio = document.getElementById("btn-iniciar__sesion");



const principal = document.querySelector(".main");
const buscadorHeader = document.querySelector(".input-buscar__container");
const contenedorRealizarPedido = document.querySelector(".realizar-pedido__container");

const liPerfil = document.getElementById("li-perfil");
const liCarta = document.getElementById("li-carta");
const liBuscar = document.getElementById("li-buscar");
const liReclamo = document.getElementById("li-reclamo");
const liCarrito = document.getElementById("li-carrito");
const liUsuarios = document.getElementById("li-usuarios");
const liProductos = document.getElementById("li-productos");
const liPedidos = document.getElementById("li-pedidos");
const liPagos = document.getElementById("li-pagos");
const liZonas = document.getElementById("li-zonas");
const liReclamaciones = document.getElementById("li-reclamos");
const liEstadisticas = document.getElementById("li-estadisticas");

liPerfil.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("perfilUsuario")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})


liCarta.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("menu");
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liBuscar.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("buscar")
    eliminarContenedorRealizarPedido();
    buscadorHeader.classList.add("active-buscar")
})

liReclamo.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("reclamaciones");
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liCarrito.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("carrito");
    eliminarBuscador();
    contenedorRealizarPedido.classList.add("active-realizar-pedido")
})

liUsuarios.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("usuarios")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liProductos.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("productos")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liPedidos.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("pedidos")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liPagos.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("pagos")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liZonas.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("zonas")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liReclamaciones.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("reclamos")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})

liEstadisticas.addEventListener("click",()=>{
    cerrarNavAncho()
    cargarVista("estadistica")
    eliminarBuscador();
    eliminarContenedorRealizarPedido();
})


function eliminarBuscador(){
    if(buscadorHeader.classList.contains("active-buscar")){
        buscadorHeader.classList.remove("active-buscar")
    }
}

function eliminarContenedorRealizarPedido(){
    if(contenedorRealizarPedido.classList.contains("active-realizar-pedido")){
        contenedorRealizarPedido.classList.remove("active-realizar-pedido")
    }
}
// async function prueba(nombreVista) {
//     const res = await fetch(`../FRONTEND/VISTAS/${nombreVista}.html`)
//     const data = await res.text();

//     console.log(data)
// }

// prueba("perfilUsuario")


async function cargarVista(nombreVista) {

    const res = await fetch(`../FRONTEND/VISTAS/${nombreVista}.html`)
    const data = await res.text();

    principal.innerHTML = data

    if (nombreVista === "menu") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/carta.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "perfilUsuario") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/perfil.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "pedidos") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/pedidos.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "productos") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/productos.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "buscar") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/buscar.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "carrito") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/carrito.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "reclamaciones") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/reclamaciones.js";
        document.body.appendChild(script);
    }

    if (nombreVista === "estadistica") {
        const script = document.createElement("script");
        script.src = "../FRONTEND/JS/graficos.js";
        document.body.appendChild(script);
    }

}

window.usuario = JSON.parse(localStorage.getItem("usuario"))
console.log(window.usuario)
window.carritoFinal = JSON.parse(localStorage.getItem("carrito")) || [];

const perfilAdmin = document.getElementById("perfil-header")

function NavRolUsuario(){
    if(window.usuario.idRolUsuario === 1){
        navCliente.style.display = "flex"
        navAdmin.style.display = "none";
        cargarVista("menu")
        perfilAdmin.style.display = "none"
    }else if(window.usuario.idRolUsuario !== 1){
        navCliente.style.display = "none"
        navAdmin.style.display = "flex";
        cargarVista("estadistica")
        perfilAdmin.style.display = "flex"
    }
}
window.carrito = []




window.addEventListener("DOMContentLoaded",async()=>{
    NavRolUsuario()
})


// NAV
const backgroundNav = document.querySelector(".background-nav");
const menu = document.getElementById("menu");
const exitMenu = document.getElementById("exit-menu");

function cerrarNavAncho(){
    if(window.innerWidth >= 800){
        backgroundNav.style.display = "none";
    }
}

menu.addEventListener("click", () => {
  backgroundNav.style.display = "flex";
});

exitMenu.addEventListener("click", () => {
  backgroundNav.style.display = "none";
});

let anchoAnterior = window.innerWidth;

function verificarAncho() {
  const anchoActual = window.innerWidth;

  if (anchoAnterior < 800 && anchoActual >= 800) {
    backgroundNav.style.display = "none"; // Oculta el menú
  }else if(anchoAnterior >= 800 && anchoActual < 800){
    backgroundNav.style.display = "flex";
  }

  anchoAnterior = anchoActual;
}

window.addEventListener("resize", verificarAncho);


if (window.innerWidth > 800) {
  backgroundNav.style.display = "none";
}

const navCliente = document.getElementById("nav-cliente")
const navAdmin = document.getElementById("nav-admin")






