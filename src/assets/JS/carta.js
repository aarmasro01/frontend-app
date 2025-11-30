(()=>{

const containerEntradas = document.querySelector(".menu__container")
const containerSegundos = document.querySelector(".menu-segundo__container");
const containerBebidas = document.querySelector(".menu-bebidas__container");

async function obtenerProductos() {
    const res = await fetch("http://localhost:5000/api/products/")
    const data = await res.json()
    
    try{
        // creando una lista de productos vacia
        const productos = [] 
        data.forEach(producto => {
            productos.push(producto)
        });
        console.log(productos)

        mostrarEntradas(productos)
        mostrarSegundos(productos)
        mostrarBebidas(productos)
    }catch(err){
        console.error(err)
    }
}

function crearProducto(pro){
    const producto = document.createElement("DIV");
    producto.classList.add("plato")
    producto.dataset.categoria = pro.idCategoriaMenu
    producto.dataset.id = pro.idProducto
    producto.innerHTML = `<div class="image-plato__container">
                        <img src="../FRONTEND/IMAGES/${pro.imagenProducto}" alt="${pro.imagenProducto}">
                    </div>
                    <div class="info-plato__container">
                        <label for="" class="nombre-plato">${pro.nombre}</label>
                        <label for="" class="precio-plato">S/${pro.precio}</label>
                    </div>
                    <button class="button-plato">
                        <span class="material-symbols-outlined">
                            shopping_cart
                        </span>
                    </button>`
    const btnAgregarCarrito = producto.querySelector(".button-plato");
    btnAgregarCarrito.addEventListener("click",()=>{
        const existe = window.carritoFinal.some(item => item.idProducto === pro.idProducto)
        if(!existe){
            window.carrito.push(pro);
            alert("Se agrego correctamente al carrito")
        }else{
            alert("Ya se encuentra en el carrito")
        }
        console.log(window.carrito)
    })
    return producto
}

function mostrarEntradas(productos){
    const fragment = document.createDocumentFragment();
    productos.forEach(producto => {
        if(verificarCategoriaEntrada(producto)){
            const pro = crearProducto(producto);
            fragment.appendChild(pro)
        }
    });
    containerEntradas.appendChild(fragment)
}

function mostrarSegundos(productos){
    const fragment = document.createDocumentFragment();
    productos.forEach(producto => {
        if(verificarCategoriaSegundo(producto)){
            const pro = crearProducto(producto);
            fragment.appendChild(pro)
        }
    });
    containerSegundos.appendChild(fragment)
}

function mostrarBebidas(productos){
    const fragment = document.createDocumentFragment();
    productos.forEach(producto => {
        if(verificarCategoriaBebida(producto)){
            const pro = crearProducto(producto);
            fragment.appendChild(pro)
        }
    });
    containerBebidas.appendChild(fragment)
}

function verificarCategoriaEntrada(producto){
    let entra
    if(producto.idCategoriaMenu === 1 && producto.idEstadoProducto === 1){
        entra = true
    }else{
        entra = false
    }
    return entra
}

function verificarCategoriaSegundo(producto){
    let entra
    if(producto.idCategoriaMenu === 2 && producto.idEstadoProducto === 1){
        entra = true
    }else{
        entra = false
    }
    return entra
}

function verificarCategoriaBebida(producto){
    let entra
    if(producto.idCategoriaMenu === 3 && producto.idEstadoProducto === 1){
        entra = true
    }else{
        entra = false
    }
    return entra
}

obtenerProductos()
})();