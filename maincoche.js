var coches = [];
var marcas = [];

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

async function cargarMarcas(){
    const respuesta = await fetch(
        "http://localhost:8080/marca"
    );

    marcas = await respuesta.json();
    
    const selector = document.createElement("select");
    selector.id = "selectorMarcas";
    selector.innerHTML = "";
    marcas.forEach(marca => {
        const opcion = document.createElement("option");
        opcion.value = marca.id;
        opcion.textContent = marca.nombre;
        const id = document.getElementById("selectorCoches").value;
        if(id >= 0){
            const coche = coches.find(
            z => z.id == id);
            if (opcion.textContent == coche.marca.nombre){
                opcion.selected = true;
            }
        }
        selector.appendChild(opcion);
    });
    selector.disabled = true;
    const label = document.createElement("label");
    label.innerText = "Marca";
    label.id = "etiquetaMarca";
    label.appendChild(selector);
    return label;
}

async function mostrarCoche(){
    const id = document.getElementById("selectorCoches").value;
    if(id >= 0){
        const coche = coches.find(
        z => z.id == id);
        //console.log("Coche encontrado:", coche);
        const card = document.getElementById("card");
        card.innerHTML = "";
        card.appendChild(document.createElement("h2")).innerText = coche.modelo;
        card.appendChild(await cargarMarcas());
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
    const selectorMarca = document.getElementById("selectorMarcas");
    const cocheMatricula = document.getElementById("cocheMatricula");
    const cochePrecio = document.getElementById("cochePrecio");
    selectorMarca.disabled = false;
    cocheMatricula.readOnly = false;
    cochePrecio.readOnly = false;
}

function guardarCoche(){
    const id = document.getElementById("selectorCoches").value;
    const coche = coches.find(
        z => z.id == id
    );

    const cocheMatricula = document.getElementById("cocheMatricula");
    const cochePrecio = document.getElementById("cochePrecio");
    const selectorMarca = document.getElementById("selectorMarcas");
    cocheMatricula.readOnly = true;
    cochePrecio.readOnly = true;
    selectorMarca.disabled = true;
    coche.matricula = cocheMatricula.value;
    coche.precio = parseFloat(cochePrecio.value);
    coche.marcaId = parseInt(selectorMarca.value);
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