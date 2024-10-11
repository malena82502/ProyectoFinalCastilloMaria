let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

if (document.title === "Home funkos") {
    fetch("../data.json")
    .then((resp) => resp.json())
    .then((data) => {
        todosLosProductos(data);
        carruselDeProductos(data);
    })

    //JS para index.html
    function todosLosProductos(productos){
        const contenedorProductos = document.querySelector("#productos");
        productos.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("cardFunkos");
            //imagen producto
            let img = document.createElement("img");
            img.src = producto.img1;  
            img.classList.add("imagenProducto");
            //hover imagen
            img.addEventListener("mouseover", () => {
            img.src = producto.img2;  
            });
            img.addEventListener("mouseout", () => {
            img.src = producto.img1;  
            });
            //texto html productos
            div.innerHTML = `
                <h2>${producto.nombre}</h2>
                <h3 class="productShop">${producto.clase}</h3>
                <h3>$ ${producto.precio}</h3>
                <h3 class="promoShop">${producto.cuotas} CUOTAS SIN INTERES</h3>
            `; 
            //cargar antes la imagen
            div.prepend(img);
            //boton comprar
            let button = document.createElement("button");
            button.classList.add("btn", "btn-light", "botonComprar");
            button.innerText = "COMPRAR";
        
            button.addEventListener("click", () => {
                agregarAlCarrito(producto);
            })

            div.append(button);
            contenedorProductos.append(div);
        })
    };
    
    function carruselDeProductos(productos){
        const carruselProductos = document.querySelector("#carrusel");
        productos.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carruselFunkos");
            div.innerHTML = `
                <img src=${producto.img1}>
                <h2 class="nombre">${producto.nombre}</h2>
                <h3 class="clase">${producto.clase}</h3>
                <p class="nuevo">NUEVO</p>
            `; 
            carruselProductos.append(div);
        });
        new Glider(document.querySelector('.carousel__lista'), {
            slidesToShow: 3,
            slidesToScroll: 3,
            draggable: true,
            dots: '.carousel__indicadores',
            arrows: {
                prev: '.carousel__anterior',
                next: '.carousel__siguiente'
            },
            });
    };

    function agregarAlCarrito(producto) {
        let itemEncontrado = carrito.find((item) => item.id === producto.id);
    
        if (itemEncontrado) {
            itemEncontrado.cantidad++;
        } else {
            carrito.push({...producto, cantidad: 1});
        }
        actualizarNumerito();

        localStorage.setItem("carrito", JSON.stringify(carrito));
        //tostadita de producto agregado
        Toastify({
            text: "Producto gregado",
            close: true,
            duration: 1000,
            avatar: "../img/logofooter.svg",
            stopOnFocus: true,
            style: {
                borderRadius: "10px",
                background: "#30343f"
            }
            }).showToast();
    }
    //numerito carrito
    const numeritoCarrito = document.querySelector("#numeritoCarrito"); //numerito del carrito
    function actualizarNumerito() {
        let nuevoNumerito = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numeritoCarrito.innerText = nuevoNumerito;
    }
//JS para carrito html
}else if (document.title === "Carrito funkos") {
    const carritoVacio = document.querySelector("#carritoVacio");
    const carritoProductos = document.querySelector("#carritoProductos");
    const carritoTotal = document.querySelector("#carritoTotal");
    
    actualizarCarrito();

    function actualizarCarrito() {
        if (carrito.length === 0) {
            carritoVacio.classList.remove("d-none");
            carritoProductos.classList.add("d-none");
        } else {
            carritoVacio.classList.add("d-none");
            carritoProductos.classList.remove("d-none");
            //carrito
            carritoProductos.innerHTML = "";
            carrito.forEach((producto) => {
                let div = document.createElement("div");
                div.classList.add("carritoProducto");
                div.innerHTML = `
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio}</p>
                    <p>Cant: ${producto.cantidad}</p>
                    <p>Subt: $ ${producto.precio * producto.cantidad}</p>
                `;
                //boton aumentar
                let buttonAumentar = document.createElement("button");
                buttonAumentar.classList.add("carritoBoton");
                buttonAumentar.innerText = "+";
                buttonAumentar.addEventListener("click", () => {
                    aumentarCantidad(producto);
                })
                div.append(buttonAumentar);
                //boton reducir
                let buttonReducir = document.createElement("button");
                buttonReducir.classList.add("carritoBoton");
                buttonReducir.innerText = "-";
                buttonReducir.addEventListener("click", () => {
                    reducirCantidad(producto);
                })
                div.append(buttonReducir);
                //boton eliminar
                let button = document.createElement("button");
                button.classList.add("carritoBoton");
                button.innerText = "Eliminar";
                button.addEventListener("click", () => {
                    borrarDelCarrito(producto);
                });
    
                div.append(button);
                carritoProductos.append(div);
            });
        }
        actualizarTotal();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    //borrar
    function borrarDelCarrito(producto) {
        let indice = carrito.findIndex((item) => item.id === producto.id);
        carrito.splice(indice, 1);
    
        Toastify({
            text: "Producto eliminado",
            close: true,
            duration: 1000,
            avatar: "../img/logofooter.svg",
            stopOnFocus: true,
            style: {
                borderRadius: "10px",
                background: "#30343f"
            }
            }).showToast();
    
        actualizarCarrito();
    }
    //total de compra
    function actualizarTotal() {
        let total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
        carritoTotal.innerText = `El total de su compra es:  $ ${total}`;
    } 
    //sumar productos
    function aumentarCantidad(producto) {
        let itemEncontrado = carrito.find((item) => item.id === producto.id);
        itemEncontrado.cantidad++;
    
        actualizarCarrito();
    }
    //restar productos
    function reducirCantidad(producto) {
        let itemEncontrado = carrito.find((item) => item.id === producto.id);
    
        if (itemEncontrado.cantidad >= 2) {
            itemEncontrado.cantidad--;
            actualizarCarrito();
        } else {
            borrarDelCarrito(itemEncontrado);
        }
    
    } 
    //pagar compra
    let sweetAlert = document.querySelector("#comprar");
    sweetAlert.addEventListener("click", () => {
        Swal.fire({
            position: "bottom-center",
            icon: "success",
            title: "¡Compra exitosa!",
            text: "Quieres seguir comprando?",
            showConfirmButton: true,
            showCancelButton: true,
    
            confirmButtonText: "Continuar",
            cancelButtonText: "Salir",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "http://127.0.0.1:5500/index.html"; // Redirigir a otra página
                carrito.length = 0;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            }else{
                carrito.length = 0;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito()
            }
        })
    })
    //vaciar carrito
    let carritoVaciar = document.querySelector("#vaciarCarrito");
    carritoVaciar.addEventListener("click", vaciarCarrito);
    function vaciarCarrito() {
        Swal.fire({
            title: '¿Estás seguro?',
            icon: 'question',
            html: `Se van a borrar ${carrito.reduce((acc, producto) => acc + producto.cantidad, 0)} producto(s).`,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.length = 0;
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarCarrito();
            }
        })
    }
    
    actualizarCarrito();
}













