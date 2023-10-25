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

    cliente = {...cliente, mesa, hora};
    
    //Ocultar Modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario); //Coge la instancia de formulario
    modalBootstrap.hide(); //Y ya podemos acceder a uno de los metodos de bootstrap para ocultarlo

    //Mostrar secciones
    mostrarSecciones();


    //Obtener platos de la Api de json-server
    obtenerPlatos();

}

function mostrarSecciones(){
    const secciones = document.querySelectorAll('.d-none');
    secciones.forEach(seccion => {
        seccion.classList.remove('d-none')
    })
}

async function obtenerPlatos(){
    const url = 'http://localhost:4000/platillos';

    try{
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarPlatos(resultado);

    }catch(error){
        console.log(error);
    }
}

function mostrarPlatos(platos){
    
    const contenido = document.querySelector('#platillos .contenido');

    platos.forEach(plato=> {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');
        
        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = plato.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `${plato.precio}€`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[plato.categoria];

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);

        contenido.appendChild(row);
    })
}