addEventListener("DOMContentLoaded", (e) => {
    let Myfrom = document.querySelector("form");
    let lista = [], valor = Number(document.querySelector('[name="valor"]').value);
    Myfrom.addEventListener("submit", (e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.target));
        data.horas = Number(data.horas);
        verificar(data);
    })
    let verificar = (data) => {
        let bandera;
        if (lista.length == 0) {
            data.valor = data.horas * valor;
            lista.push(data)
        } else {
            lista.forEach((val, id) => {
                if (val.cedula === data.cedula) {
                    data.horas += val.horas;
                    bandera = id;
                }
            })
            data.valor = data.horas * valor;
            (bandera == 0 || bandera > 0) ? lista[bandera] = data : lista.push(data);
        }
        diseño();
    }
    let diseño = () => {
        let plantilla = "", total = 0;
        lista.forEach((val, id) => {
            let moneda = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'COB', minimumFractionDigits: 0 });
            total += val.valor;
            plantilla += `
                <tr>
                    <td>${(id + 1)} <button data-crup="${val.cedula}" title="Eliminar dato">🚫</button> <button data-editar='${JSON.stringify(val)}' title="Editar dato">🗑️</button></td>
                    <td>${val.cedula}</td>
                    <td>${val.nombre}</td>
                    <td>${val.horas}</td>
                    <td>$ ${moneda.format(val.valor)}</td>
                </tr>
            `;
            if (lista.length == id + 1) {
                plantilla += `
                <tr>
                    <th colspan="4">Total a pagar</th>
                    <td>$ ${moneda.format(total)}</td>
                </tr>
            `;
            }
        });
        let tabla = document.querySelector("tbody");
        tabla.innerHTML = "";
        tabla.insertAdjacentHTML("beforeend", plantilla);
        let Mybotton = document.querySelectorAll("button");
        Mybotton.forEach(element => {
            element.addEventListener("click", (e) => {
                lista.forEach((val, id) => {
                    if(e.target.dataset.crup){
                        if (val.cedula === e.target.dataset.crup) {
                            lista.splice(id, 1);
                        }
                    }else{
                        let editar = JSON.parse(e.target.dataset.editar);
                        document.querySelector('[name="cedula"]').value = editar.cedula;
                        document.querySelector('[name="nombre"]').value = editar.nombre;
                        document.querySelector('[name="horas"]').value = editar.horas;
                    }
                    diseño();
                });
            })
        });
    }
})