var coches = [];

async function cargarCoches(){

    const respuesta = await fetch(
        "http://localhost:8080/coches"
    );

    coches = await respuesta.json();
    const selector = document.getElementById("selectorCoches");

    selector.innerHTML = "";

    coches.forEach(coche => {

        const opcion = document.createElement("option");

        opcion.value = coche.id;
        opcion.textContent = coche.modelo;

        selector.appendChild(opcion);
    });
    //console.log(coches);
}

function mostrarCoche(){

    const id = document.getElementById("selectorCoches").value;
    if(id >= 0){
        const coche = coches.find(
        z => z.id == id);
        //console.log("Coche encontrado:", coche);
        const card = document.getElementById("card");
        card.innerHTML = "";
        card.appendChild(document.createElement("h2")).innerText = coche.modelo;
        card.appendChild(generarInputCoche("Marca:", coche.marca));
        card.appendChild(generarInputCoche("Precio:", coche.precio));
        card.appendChild(generarInputCoche("Matricula:", coche.matricula));
    }
}

function generarInputCoche(etiqueta, valor){
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.innerText = etiqueta;
    input.id = "coche" + etiqueta.replace(":", "").trim();
    input.type = "text";
    input.value = valor;
    input.readOnly = true;
    label.appendChild(input);
    return label;
}

function editarCoche(){
    const cocheTalla = document.getElementById("cocheTalla");
    const cochePrecio = document.getElementById("cochePrecio");
    cocheTalla.readOnly = false;
    cochePrecio.readOnly = false;
}

function guardarCoche(){
    const id = document.getElementById("selectorCoches").value;
    const coche = coches.find(
        z => z.id == id
    );

    const cocheTalla = document.getElementById("cocheTalla");
    const cochePrecio = document.getElementById("cochePrecio");
    cocheTalla.readOnly = true;
    cochePrecio.readOnly = true;
    coche.matricula = cocheTalla.value;
    coche.precio = parseDouble(cochePrecio.value);
    //console.log(JSON.stringify(coche));
    fetch(`http://localhost:8080/coches/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(coche)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(JSON.stringify(error));
            });
        }
        return response.json();
        })
        .then(data => {
            console.log("Coche actualizado:", data);
        })
        .catch(error => {
            console.error("Error al actualizar:", error);
        });
}