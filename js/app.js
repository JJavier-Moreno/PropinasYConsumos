let cliente = {
    hora: '',
    mesa: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {

    const hora = document.querySelector('#hora').value;
    const mesa = document.querySelector('#mesa').value;

    const camposVacios = [hora, mesa].some(campo => campo === '');

    if (camposVacios) {
        //Comprobar si ya existe una alerta
        const existeAlerta = document.querySelector('.invalid-feedback');
        if (!existeAlerta) {

            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';

            document.querySelector('.modal-body form').appendChild(alerta);


            //Eliminar la alerta tras 3 segundos
            setTimeout(() => {
                alerta.remove();
            }, 3000)

            return;
        }
    }

    cliente = { ...cliente, mesa, hora };

    //Ocultar Modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario); //Coge la instancia de formulario
    modalBootstrap.hide(); //Y ya podemos acceder a uno de los metodos de bootstrap para ocultarlo

    //Mostrar secciones
    mostrarSecciones();


    //Obtener platos de la Api de json-server
    obtenerPlatos();

}

function mostrarSecciones() {
    const secciones = document.querySelectorAll('.d-none');
    secciones.forEach(seccion => {
        seccion.classList.remove('d-none')
    })
}

async function obtenerPlatos() {
    const url = 'http://localhost:4000/platillos';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarPlatos(resultado);

    } catch (error) {
        console.log(error);
    }
}

function mostrarPlatos(platos) {

    const contenido = document.querySelector('#platillos .contenido');

    platos.forEach(plato => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = plato.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `${plato.precio}€`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[plato.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${plato.id}`;
        inputCantidad.classList.add('form-control');

        inputCantidad.onchange = () => {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlato({ ...plato, cantidad });
        }


        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');

        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })
}

function agregarPlato(producto) {
    //Extraigo el pedido actual
    let { pedido } = cliente;

    //Comprobar si la cantidad es mayor a 0;
    if (producto.cantidad > 0) {

        //Comprobar si el producto que añadimos ya esta en el array
        const existeProducto = pedido.some(articulo => articulo.id === producto.id);
        if (existeProducto) {
            //El producto YA existe por lo que debemos actualizar la cantidad
            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            })

            //Se asigna el nuevo array a cliete.pedido
            cliente.pedido = [...pedidoActualizado];
        } else {

            //El articulo no existe por lo que SI que lo añadimos al array
            cliente.pedido = [...pedido, producto];
            console.log(cliente.pedido);

        }

    } else {
        //Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    //limpiar el codigo HTML previo
    limpiarHTML();

    //mostrarResumen
    mostrarResumen();

}

function mostrarResumen(){

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6');

    //Informacion de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-bold');


    //Informacion de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-bold');

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);


    contenido.appendChild(mesa);
    contenido.appendChild(hora);
}

function limpiarHTML(){

    const contenido = document.querySelector('#resumen .contenido');

    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}