window.addEventListener("error", (e) => {
  console.error("🔥 Error global detectado:", e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("🚨 Promesa sin manejar:", e.reason);
});
const inputsMetodos = document.querySelectorAll(".input-metodo-pago");
const inputYape = document.getElementById("input-yape");
const inputPlin = document.getElementById("input-plin");


function MetodoPago(){
    let metodo = ""
    if(inputYape.checked){
        metodo = "Yape"
    }else if(inputPlin.checked){
        metodo = "Plin"
    }
    return metodo
}

let metodoDePago = "";

inputsMetodos.forEach(check =>{
    check.addEventListener("change",()=>{
        if (check.checked) {
            inputsMetodos.forEach(other => {
                if (other !== check) other.checked = false;
            });
            metodoDePago = MetodoPago()
            console.log(metodoDePago)
        }

    })
})

const inputCaptura = document.getElementById("captura-pago");

function verificarCaptura(){
    if(inputCaptura.files.length === 0){
        alert("Selecciono un archivo")
        console.log("Seleccione un archivo");
        return false
    }
    return true
}

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

console.log(carrito)

let calculo = (10 * (carrito.length - 1)) + (80 * carrito.length) + 10; 
// (10 * (carrito.length - 1)) + (80 * carrito.length) + 10

const spanResumen = document.getElementById("mostrar-resumen")
const resumenContainer = document.querySelector(".resumen-carrito__container")

function mostrarResumen(){
    resumenContainer.style.display = "flex"
    setTimeout(()=>{
        resumenContainer.style.opacity = "1"
    },400)
    setTimeout(()=>{
        resumenContainer.style.height = `${calculo}px`
    },200)
}

function ocultarResumen(){
    resumenContainer.style.opacity = "0"
    setTimeout(()=>{
        resumenContainer.style.height = "0px"
    },100)
    setTimeout(()=>{
        resumenContainer.style.display = "none"
    },500)
}

function mostrarCarrito(){
    if(spanResumen.classList.contains("active")){
        mostrarResumen()
    }else{
        ocultarResumen()
    }
}

spanResumen.addEventListener("click",()=>{
    spanResumen.classList.toggle("active")
    mostrarCarrito();
})


function crearProductoResumen(pro){
    const producto = document.createElement("DIV");
    producto.classList.add("producto-resumen");
    producto.dataset.id = pro.idProducto;
    producto.innerHTML = `<div class="img-nombre__producto-resumen">
                            <div class="imge-container__producto-resumen">
                                <img src="../IMAGES/${pro.imagenProducto}" alt="${pro.imagenProducto}">
                            </div>
                            <label for="">${pro.cantidad} x ${pro.nombre}</label>
                        </div>
                        <div class="precio__producto-resumen">
                            <label for="">S/${pro.precio}</label>
                        </div>`
    return producto
}

function visualizarResumenPedido(){

    const fragment = document.createDocumentFragment();

    carrito.forEach(producto =>{
        const pro = crearProductoResumen(producto)
        fragment.appendChild(pro)
    })

    resumenContainer.appendChild(fragment)
}

visualizarResumenPedido()

const labelSubTotal = document.querySelector(".precio-subtotal")
const labelTotal = document.querySelector(".precio-total")

function calcularSubTotal(){
    let subTotal = 0
    carrito.forEach(pro =>{
        subTotal += pro.precio * pro.cantidad
    })
    return subTotal
}

function calcularTotal(){
    return calcularSubTotal()
}

function montos(){
    labelSubTotal.textContent = `S/${calcularSubTotal()}`
    labelTotal.textContent = `S/${calcularTotal()}`
}
montos();

const checkAuto = document.getElementById("check-autorizacion");

function verificarAutorizacion(){
    if(!checkAuto.checked){
        alert("Necesitamos tu autorizacion");
        console.log("Necesitamos tu autorizacion")
        return false
    }
    return true
}

const backgroundGracias = document.querySelector(".background-gracias-por-su-compra");

function habilitarGracias(){
    backgroundGracias.style.display = "flex"
    setTimeout(()=>{
        backgroundGracias.style.opacity = "1"
    },1000)
}

function deshabilitarGracias(){
    backgroundGracias.style.opacity = "0"
    backgroundGracias.style.display = "none"
}

const btnRegresar = document.getElementById("btn-regresar");

const btnFinalizar = document.querySelector(".btn-finalizar")

btnFinalizar.addEventListener("click",async(e)=>{
    e.preventDefault(); // 🔥 evita recargar la página

    if (!verificarCaptura()) return;
    if (!verificarAutorizacion()) return;
    if (metodoDePago === "") {
        alert("Seleccione un metodo de pago");
        return;
    }

    // --- REGISTRAR PAGO ---
    const pago = crearPago();
    await registrarPago(pago);

    // --- CREAR PEDIDO ---
    const pedido = await crearPedido();
    await registrarPedido(pedido);

    // --- GUARDAR DETALLES ---
    await guardarDetalles();

    // --- MOSTRAR MENSAJE DE GRACIAS ---
    habilitarGracias();
})

btnRegresar.addEventListener("click",()=>{
    deshabilitarGracias();
    localStorage.setItem("carrito", JSON.stringify([]));
    window.location.href = "../index.html"
})

const cliente = JSON.parse(localStorage.getItem("clientePedido"))
console.log(cliente);

const fecha = new Date()
const fechaFormateada = fecha.toISOString().slice(0, 19).replace('T', ' ');

console.log(fecha.toLocaleDateString())

function crearPago(){
    const pago = {
        "metodoPago": metodoDePago,
        "comprobantePago": inputCaptura.files[0],
        "fechaPago": fechaFormateada
    }
    return pago
}
async function registrarPago(pago) {
    try {
        const formData = new FormData();
        formData.append("metodoPago", pago.metodoPago);
        formData.append("comprobantePago", pago.comprobantePago);
        formData.append("fechaPago", pago.fechaPago);

        const res = await fetch("http://localhost:5000/api/pagos/register", {
            method: "POST",
            body: formData // 🔥 no uses headers Content-Type
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            console.log("Pago registrado correctamente");
        } else {
            console.log("Error al registrar pago:", data.error);
        }

    } catch (error) {
        console.log("Error en registrarPago:", error);
    }
}

async function obtenerIdPago() {
    const res = await fetch(`http://localhost:5000/api/pagos/ultimo`);
    const data = await res.json()

    const idPago = data.idPago

    return idPago
}

const fechaPedido = new Date()
console.log(fechaPedido.toLocaleDateString())

async function crearPedido() {
    const pedido = {
        "idUsuario": cliente.idUsuario,
        "idCliente": cliente.idCliente,
        "nombreReceptor": cliente.nombres,
        "apellidosReceptor": cliente.apellidos,
        "correoReceptor": cliente.correo,
        "telefonoReceptor": cliente.telefono,
        "direccionEntrega": cliente.direccion,
        "fecha": fechaPedido.toISOString().split('T')[0],
        "hora": fechaPedido.toLocaleTimeString(),
        "idEstadoPedido": 1,
        "tipoComprobantePago": cliente.comprobante,
        "idPago": await obtenerIdPago()
    }

    return pedido
}

async function registrarPedido(pedido) {
    try {
        const res = await fetch(`http://localhost:5000/api/pedidos/register`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(pedido)
        })

        const data = await res.json()
        console.log(data);

        if(res.ok){
            console.log(data.message);
        }else{
            console.log(data.error)
        }
    } catch (error) {
        console.log(error)
    }

}

async function obtenerIdPedido() {
    const res = await fetch(`http://localhost:5000/api/pedidos/ultimo`)
    const data = await res.json();

    const idPedido = data.idPedido

    console.log(idPedido)
    return idPedido
}



async function crearDetallePedido(producto) {
    const detalle = {
        "idPedido": await obtenerIdPedido(),
        "idProducto": producto.idProducto,
        "precioUnitario": producto.precio,
        "cantidad": producto.cantidad,
        "subtotal": producto.precio * producto.cantidad
    }
    console.log(detalle)
    return detalle
}
console.log(carrito)
async function registrarDetalle(detalle) {
    try {
        const res = await fetch(`http://localhost:5000/api/detalles/register`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(detalle)
        })
        const data = await res.json()

        console.log(data)

        if(res.ok){
            console.log(data.message)
        }else{
            console.log(data.error)
        }
    } catch (error) {
        console.log(error)
    }
}

async function guardarDetalles() {
    for(const producto of carrito){
        const detalle = await crearDetallePedido(producto)
        console.log(detalle)
         await registrarDetalle(detalle)
    }
}