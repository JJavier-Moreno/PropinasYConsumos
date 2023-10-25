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
        inputCantidad.type = Number;
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

    //Comprobar si el arreglo de pedido esta vacio para mostrar el mensaje de añadir platos
    if (cliente.pedido.length) {

        //mostrarResumen
        mostrarResumen();
    } else {
        mensajePedidoVacio();
    }


}

function mostrarResumen() {

    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

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


    //Titulo de la seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platos Ordenados';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedido
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group')
    const { pedido } = cliente;

    pedido.forEach(articulo => {
        const { nombre, cantidad, precio, id } = articulo;
        console.log(precio);
        const lista = document.createElement('LI');
        lista.classList.add('list-group.item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;


        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `${precio}€`;

        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = `${calcularSubtotal(precio, cantidad)}€`;

        //Boton para eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del pedido';
        btnEliminar.onclick = function () {
            eliminarProducto(id);
        }

        //Agregar valores a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        //Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })

    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar formulario de propinas
    formularioPropinas();
}

function limpiarHTML() {

    const contenido = document.querySelector('#resumen .contenido');

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio, cantidad) {
    return precio * cantidad;
}

function eliminarProducto(id) {
    const { pedido } = cliente;

    const pedidoActualizado = pedido.filter(item => item.id !== id);
    cliente.pedido = [...pedidoActualizado];

    //limpiar el codigo HTML previo
    limpiarHTML();

    //Comprobar si el arreglo de pedido esta vacio para mostrar el mensaje de añadir platos
    if (cliente.pedido.length) {

        //mostrarResumen
        mostrarResumen();
    } else {
        mensajePedidoVacio();
    }

    //El producto se eliminó por lo que debemos regresar las cantidad del formulario a 0
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;

}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');


    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.value = "10";
    radio10.name = 'propina';
    radio10.classList.add('form-check-input');

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.value = "25";
    radio25.name = 'propina';
    radio25.classList.add('form-check-input');

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //Radio button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.value = "50";
    radio50.name = 'propina';
    radio50.classList.add('form-check-input');

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');


    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);


    //Agregar al div principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);


    //Agregarlo al formulario
    formulario.appendChild(divFormulario);


    contenido.appendChild(formulario);



}