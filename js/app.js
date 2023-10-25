let cliente = {
    hora: '',
    mesa: '',
    pedido: []
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

}