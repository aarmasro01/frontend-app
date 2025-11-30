(()=>{

async function obtenerProductos() {
    const res = await fetch(`http://localhost:5000/api/products/`);
    const data = await res.json();

    const productos = []

    data.forEach(d =>{
        productos.push(d)
    })

    return productos
}


function agregarProducto(pro){
    let categoria = categoriaProducto(pro)
    const producto = document.createElement("TR");
    producto.dataset.id = pro.idProducto;
    producto.innerHTML = `<td class="id-producto">
                                <label for="">${pro.idProducto}</label>
                            </td>
                            <td class="name-image__producto">
                                <div class="image-producto__container">
                                    <img src="../FRONTEND/IMAGES/${pro.imagenProducto}" alt="">
                                </div>
                                <label for="">${pro.nombre}</label>
                            </td>
                            <td class="precio__producto">${pro.precio}</td>
                            <td class="categoria-producto">
                                <label for="">${categoria}</label>
                            </td>
                            <td class="disponible-producto">
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </td>
                            <td class="acciones-productos">
                                <div class="accion-button edit-button">
                                    <span class="material-symbols-outlined">
                                        edit
                                    </span>
                                </div>
                                <div class="accion-button delete-button">
                                    <span class="material-symbols-outlined">
                                        delete
                                    </span>
                                </div>
                            </td>`
    return producto

}


function categoriaProducto(pro){
    let categoria = "";
    let id = pro.idCategoriaMenu;
    if(id === 1){
        categoria = "Entrada";
    }else if(id === 2){
        categoria = "Segundo";
    }else if(id === 3){
        categoria = "Bebida";
    }
    return categoria
}

const table = document.getElementById("tabla-productos")

async function mostrarProductosTabla() {
    const fragment = document.createDocumentFragment();

    const productos = await obtenerProductos();
    productos.forEach(pro =>{
        const producto = agregarProducto(pro);
        fragment.appendChild(producto)
    })

    table.innerHTML = "";
    console.log(productos)
    table.appendChild(fragment)
    

}

mostrarProductosTabla()

const buscadorProductos = document.getElementById("input-productos-buscar");

async function buscarProductos(texto) {
    const fragment = document.createDocumentFragment()

    const productos = await obtenerProductos();
    const productosBuscados = productos.filter(p => p.nombre.toLowerCase().includes(texto))

    productosBuscados.forEach(pro =>{
        if(!verificarCategoria(pro)){
            return
        }
        if(!verificarEstado(pro)){
            return
        }
        const producto = agregarProducto(pro);
        fragment.appendChild(producto)
    })

    table.innerHTML = "";
    console.log(productosBuscados)
    table.appendChild(fragment)
}

const selectEstado = document.getElementById("select-estado")
const selectCategoria = document.getElementById("select-categoria")

function verificarCategoria(pro){
    let idCategoria = selectCategoria.value
    if(idCategoria === ""){
        return true
    }else if(pro.idCategoriaMenu === parseInt(idCategoria)){
        return true
    }else{
        return false
    }
}

function verificarEstado(pro){
    let idEstado = selectEstado.value
    if(idEstado === ""){
        return true
    }else if(pro.idEstadoProducto === parseInt(idEstado)){
        return true
    }else{
        return false
    }
}

const btnFiltrar = document.getElementById("btn-filtrar-productos");

btnFiltrar.addEventListener("click", async()=>{
    let texto = buscadorProductos.value.trim().toLowerCase()
    await buscarProductos(texto)
})

// AGREGAR PRODUCTO


const backgroundProducto = document.querySelector(".background-agregar-menu");
const btnAgregarProducto = document.getElementById("btnAgregar-producto")

function activarModalAgregar(){
    backgroundProducto.style.display = "flex"
    setTimeout(()=>{
        backgroundProducto.style.opacity = "1"
    },500)
}
function desactivarModalAgregar(){
    backgroundProducto.style.opacity = "0"
    setTimeout(()=>{
        backgroundProducto.style.display = "none"
    },500)
}

const inputImagen = document.getElementById("inputImagen");
const preview = document.getElementById("preview");

inputImagen.addEventListener("change", function() {
    const file = this.files[0];
    console.log(inputImagen.files[0].name)
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});


btnAgregarProducto.addEventListener("click",()=>{
    activarModalAgregar()
})
const formAgregar = document.querySelector(".form-agregar-menu");
const inputNombreAgregar = document.getElementById("input-producto-nombre");
const inputPrecioAgregar = document.getElementById("input-producto-precio");
const selectCategoriaAgregar = document.getElementById("select-producto-categoria")

function crearProducto(){
    const producto = {
        "idCategoriaMenu": parseInt(selectCategoriaAgregar.value),
        "nombre": inputNombreAgregar.value.trim(),
        "precio": parseFloat(inputPrecioAgregar.value),
        "idEstadoProducto": 1,
        "imagenProducto": inputImagen.files[0],
    }
    return producto
}

formAgregar.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const formData = new FormData()

    const producto = crearProducto();
    
    formData.append("idCategoriaMenu",producto.idCategoriaMenu)
    formData.append("nombre",producto.nombre)
    formData.append("precio",producto.precio)
    formData.append("idEstadoProducto",producto.idEstadoProducto)
    formData.append("imagenProducto",producto.imagenProducto)

    try {
        const res = await fetch(`http://localhost:5000/api/products/create`,{
        method: "POST",
        body: formData
        })

        const data = await res.json();
        console.log(data);

        if(res.ok){
            alert(data.message)
        }else{
            alert(data.error)
        }
    } catch (error) {
        console.log(error)
    }

    desactivarModalAgregar()
    mostrarProductosTabla()

})

})();