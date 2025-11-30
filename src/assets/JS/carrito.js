(()=>{
    const containerCarrito = document.querySelector(".items-container");
    const resumenContainer = document.querySelector(".resumen-compra__container");
    const labelSubtotal = document.getElementById("precio-subtotal");
    const labelTotal = document.getElementById("precio-total");
    const containerContinuar = document.querySelector(".realizar-pedido__container");


    function agregarCarrito(pro){
        const producto = {
            "idProducto": pro.idProducto,
            "nombre": pro.nombre,
            "precio": pro.precio,
            "idEstadoProducto": pro.idEstadoProducto,
            "imagenProducto": pro.imagenProducto,
            "cantidad": 1
        }
        return producto
    }

    function llenarCarrito(){
        window.carrito.forEach(pro => {
            const existe = window.carritoFinal.some(item => item.idProducto === pro.idProducto)
            if(!existe){
                const producto = agregarCarrito(pro);
                carritoFinal.push(producto);
                console.log(window.carrito)
                console.log(window.carritoFinal)
                guardarCarrito();
            }
        });

        window.carrito = []
    }
    llenarCarrito()
    

    function mostrarCarrito(){
        resumenComprayContinuarCompra()
        const fragment = document.createDocumentFragment();

        window.carritoFinal.forEach(producto => {
            const pro = crearItemCarrito(producto);
            fragment.appendChild(pro)
        });

        containerCarrito.innerHTML = "";
        montoSubTotalyTotal()
        containerCarrito.appendChild(fragment)
    }

    mostrarCarrito()


    function resumenComprayContinuarCompra(){
        if(carritoFinal.length > 0){
            resumenContainer.style.display = "flex"
            contenedorRealizarPedido.classList.add("active-realizar-pedido")
        }else{
            resumenContainer.style.display = "none";
            contenedorRealizarPedido.classList.remove("active-realizar-pedido")
        }
    }

    function montoSubTotalyTotal(){
        let subTotal = 0
        window.carritoFinal.forEach(item => {
            subTotal += item.precio * item.cantidad
            labelSubtotal.textContent = `S/${subTotal}`
            labelTotal.textContent = `S/${subTotal}`
        });
    }


    function crearItemCarrito(pro){
        const producto = document.createElement("DIV");
        producto.classList.add("item__container");
        producto.dataset.id = pro.idProducto;
        producto.dataset.cantidad = pro.cantidad
        producto.innerHTML = `<div class="image-item__carrito">
                        <img src="../FRONTEND/IMAGES/${pro.imagenProducto}" alt="${pro.imagenProducto}">
                    </div>
                    <div class="info-item__container">
                        <label for="" class="name-item">${pro.nombre}</label>
                        <label for="" class="precio-item">S/${pro.precio}</label>
                        <div class="cantidad__container">
                            <button class="menos"><label for="">-</label></button>
                            <p class="cantidad-item">${pro.cantidad}</p>
                            <button class="mas"><label for="">+</label></button>
                        </div>
                        <button class="btn-eliminar">Eliminar</button>
                    </div>`
        const btnMas = producto.querySelector(".mas");
        const btnMenos = producto.querySelector(".menos");
        const pCantidad = producto.querySelector(".cantidad-item")
        btnMas.addEventListener("click",()=>{
            aumentarCantidad(pro,pCantidad)
        })
        btnMenos.addEventListener("click",()=>{
            restarCantidad(pro,pCantidad)
        })
        const btnEliminar = producto.querySelector(".btn-eliminar");
        btnEliminar.addEventListener("click",()=>{
            eliminarItem(producto,pro)
            console.log(carritoFinal)
        })
        return producto;
    }

    function eliminarItem(producto,pro){
        let indice = window.carritoFinal.indexOf(pro);
        if(indice != -1){
            window.carritoFinal.splice(indice,1);
            containerCarrito.removeChild(producto)
            resumenComprayContinuarCompra()
            montoSubTotalyTotal()
            guardarCarrito();
        }
    }

    function aumentarCantidad(pro,pCantidad){
        pro.cantidad = pro.cantidad + 1
        pCantidad.textContent = pro.cantidad;
        montoSubTotalyTotal()
        guardarCarrito();
        console.log(pro.cantidad)
    }
    function restarCantidad(pro,pCantidad){
        if(pro.cantidad <= 1){
            return
        }else{
            pro.cantidad = pro.cantidad - 1
            pCantidad.textContent = pro.cantidad;
            console.log(pro.cantidad)
            montoSubTotalyTotal()
            guardarCarrito();
        }
    }

    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(window.carritoFinal));
    }


})();