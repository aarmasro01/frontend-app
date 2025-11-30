const inputNombre = document.getElementById("nombre-pedido");
const inputApellido = document.getElementById("apellido-pedido");
const inputDni = document.getElementById("dni-pedido");
const inputCorreo = document.getElementById("correo-pedido");
const inputTelefono = document.getElementById("telefono-pedido");

const labelNombre = document.getElementById("nombre-title-pedido");
const labelApellido = document.getElementById("apellido-title-pedido");
const labelDni = document.getElementById("dni-title-pedido");
const labelCorreo = document.getElementById("correo-title-pedido");
const labelTelefono = document.getElementById("telefono-title-pedido");
const labelDireccion = document.getElementById("direccion-title-pedido")

let nombreCliente = "";
let apellidoCliente = "";
let dniCliente = "";
let correoCliente = "";
let telefonoCliente = "";

function modifcarLabelContenido(label){
    label.style.fontSize = "0.75rem"
    label.style.transform = "translateY(-25px)" 
    label.style.backgroundColor = "#ffffff"
}
function modifcarLabelSinContenido(label){
    label.style.fontSize = "1rem"
    label.style.transform = "none"
    label.style.backgroundColor = "transparent"
}

inputNombre.addEventListener("input",()=>{
    if(inputNombre.value === ""){
        modifcarLabelSinContenido(labelNombre)
    }else{
        modifcarLabelContenido(labelNombre)
        nombreCliente = inputNombre.value;
    }
})

inputApellido.addEventListener("input",()=>{
    if(inputApellido.value === ""){
        modifcarLabelSinContenido(labelApellido)
    }else{
        modifcarLabelContenido(labelApellido)
        apellidoCliente = inputApellido.value;
    }
})

inputDni.addEventListener("input",()=>{
    if(inputDni.value === ""){
        modifcarLabelSinContenido(labelDni)
    }else{
        modifcarLabelContenido(labelDni)
        dniCliente = inputDni.value;
    }
})

inputCorreo.addEventListener("input",()=>{
    if(inputCorreo.value === ""){
        modifcarLabelSinContenido(labelCorreo)
    }else{
        modifcarLabelContenido(labelCorreo)
        correoCliente = inputCorreo.value;
    }
})

inputTelefono.addEventListener("input",()=>{
    if(inputTelefono.value === ""){
        modifcarLabelSinContenido(labelTelefono)
    }else{
        modifcarLabelContenido(labelTelefono)
        telefonoCliente = inputTelefono.value;
    }
})




const checkboxs = document.querySelectorAll(".input-checkbox")
const checkElectronica = document.getElementById("boleta-elec")
const checkSimple = document.getElementById("boleta-simple")
const checkFactura = document.getElementById("factura")


function comprobantePago(){
    let comprobante = ""
    if(checkElectronica.checked){
        comprobante = "Boleta electronica"
    }else if(checkSimple.checked){
        comprobante = "Boleta simple"
    }else if(checkFactura.checked){
        comprobante = "factura"
    }
    return comprobante
}

let comprobanteDePago = "";

checkboxs.forEach(check =>{
    check.addEventListener("change",()=>{
        if (check.checked) {
            checkboxs.forEach(other => {
                if (other !== check) other.checked = false;
            });
            comprobanteDePago = comprobantePago()
            console.log(comprobanteDePago)
        }

    })
})

const inputDireccion = document.getElementById("input-direccion");

let direccionCliente = "";

inputDireccion.addEventListener("input",()=>{
    if(inputDireccion.value === ""){
        modifcarLabelSinContenido(labelDireccion)
    }else{
        modifcarLabelContenido(labelDireccion)
        direccionCliente = inputDireccion.value;
    }
})

const usuario = JSON.parse(localStorage.getItem("usuario"));
let idUsuario = usuario.idUsuario
console.log(idUsuario)


async function obtenerIdCliente(idUsuario) {
    const res = await fetch(`http://localhost:5000/api/clientes/usuario/${idUsuario}`)
    const data = await res.json()

    // const idCliente = data.cliente.idCliente
    
    console.log(data.idCliente)
    return data.idCliente
}

// obtenerIdCliente(idUsuario)



 async function crearCliente(){
    const cliente = {
    "idUsuario": idUsuario,
    "idCliente": await obtenerIdCliente(idUsuario),
    "nombres": nombreCliente,
    "apellidos": apellidoCliente,
    "dni": dniCliente,
    "correo": correoCliente,
    "telefono": telefonoCliente,
    "comprobante": comprobanteDePago,
    "direccion": direccionCliente
    }   
    return cliente
}

function guardarCliente(cliente){
    localStorage.setItem("clientePedido",JSON.stringify(cliente));
}

const inputPolitica = document.getElementById("input-politica");

function verificacionCasillas(){
    if(nombreCliente === "" || apellidoCliente === ""){
        console.log(nombreCliente)
        console.log(apellidoCliente)
        console.log("Rellene todos los campos correspondientes")
        alert("Rellene todos los campos correspondientes")
        return false
    }
    if(dniCliente.length !== 8){
        console.log(dniCliente)
        console.log("Coloque correctamente su dni")
        alert("Coloque correctamente su dni")
        return false
    }

    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regex.test(correoCliente)) {
        console.log(correoCliente)
        console.log("Coloque correctamente su correo");
        alert("Coloque correctamente su correo");
        return false
    }

    if(telefonoCliente.length !== 9){
        console.log(telefonoCliente)
        console.log("Coloque correctamente su telefono")
        alert("Coloque correctamente su telefono")
        return false
    }

    if(!checkElectronica.checked && !checkSimple.checked && !checkFactura.checked){
        console.log("Selecciona al menos un comprobante de pago")
        alert("Selecciona al menos un comprobante de pago")
        return false
    }

    if(direccionCliente === ""){
        console.log(direccionCliente)
        console.log("Coloque su direccion")
        alert("Coloque su direccion")
        return false
    }

    if(!inputPolitica.checked){
        console.log("Acepte terminos y condiciones")
        alert("Acepte terminos y condiciones")
        return false
    }
    return true
}

const btnContinuar = document.querySelector(".btn-continuar");

btnContinuar.addEventListener("click", async ()=>{
    if(verificacionCasillas()){
        const cli = await crearCliente()
        guardarCliente(cli)
        window.location.href = "../VISTAS/pago.html"
    }
})

function updateLabelState(){
    // Aseguramos que los elementos existan
    if (!inputNombre || !labelNombre) return;
    if (!inputApellido || !labelApellido) return;
    if (!inputDni || !labelDni) return;
    if (!inputCorreo || !labelCorreo) return;
    if (!inputTelefono || !labelTelefono) return;
    if (!inputDireccion || !labelDireccion) return;

    const campos = [
        { input: inputNombre, label: labelNombre },
        { input: inputApellido, label: labelApellido },
        { input: inputDni, label: labelDni },
        { input: inputCorreo, label: labelCorreo },
        { input: inputTelefono, label: labelTelefono },
        { input: inputDireccion, label: labelDireccion }
    ];

    campos.forEach(({ input, label }) => {
        if (input.value && input.value.trim() !== "") {
            modifcarLabelContenido(label);
        } else {
            modifcarLabelSinContenido(label);
        }
    });
    
}

function actualizarVariablesCliente() {
    nombreCliente = inputNombre.value;
    apellidoCliente = inputApellido.value;
    dniCliente = inputDni.value;
    correoCliente = inputCorreo.value;
    telefonoCliente = inputTelefono.value;
    direccionCliente = inputDireccion.value;
}

// --- Llamadas seguras: si DOM ya cargó llamamos directamente; si no, esperamos ---
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateLabelState);
} else {
    // DOM ya listo
    updateLabelState();
    actualizarVariablesCliente();
    guardarCliente()
}

// --- Manejar regreso desde historial (bfcache) que puede restaurar valores tardíamente ---
window.addEventListener("pageshow", (event) => {
    // Si viene del back/forward cache (persisted = true) o no, volvemos a actualizar
    updateLabelState();
    actualizarVariablesCliente();
    guardarCliente()
});

// window.location.href



