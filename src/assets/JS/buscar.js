(()=>{
    const buscador = document.getElementById("buscador-header");
    const containerBuscar = document.querySelector(".productos-relacionados__container")

    async function buscarProductos(texto) {
        const res = await fetch("http://localhost:5000/api/products/");
        const data = await res.json();

        const productos = [];

        data.forEach(producto => {
            productos.push(producto)
        });

        let productoBuscados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
        containerBuscar.innerHTML = ""
        mostrarProductosBuscados(productoBuscados)
    }


    buscador.addEventListener("input", async()=>{
        let texto = buscador.value.toLowerCase();
        if(texto === ""){
            containerBuscar.innerHTML = ""
            return
        }
        await buscarProductos(texto)

    })

    function mostrarProductosBuscados(productos){
        const fragment = document.createDocumentFragment();
        productos.forEach(producto => {
            const pro = crearProducto(producto);
            fragment.appendChild(pro)
        });
        containerBuscar.appendChild(fragment)
    }

    function crearProducto(pro){
        const producto = document.createElement("DIV");
        producto.classList.add("plato")
        producto.dataset.categoria = pro.idCategoriaMenu
        producto.innerHTML = `<div class="image-plato__container">
                            <img src="../FRONTEND/IMAGES/${pro.imagenProducto}" alt="${pro.imagenProducto}">
                        </div>
                        <div class="info-plato__container">
                            <label for="" class="nombre-plato">${pro.nombre}</label>
                            <label for="" class="precio-plato">S/${pro.precio}</label>
                        </div>
                        <button class="button-producto">
                            <span class="material-symbols-outlined">
                                shopping_cart
                            </span>
                        </button>`
        const btnAgregar = producto.querySelector(".button-producto");
        btnAgregar.addEventListener("click",()=>{
            const existe = carritoFinal.some(item => item.idProducto === pro.idProducto)
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

})();


