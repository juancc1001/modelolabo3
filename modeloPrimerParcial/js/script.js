window.addEventListener("load", CargarElementos);

function $(id)
{
    return document.getElementById(id);
}

function CargarElementos() 
{
    let promise = new Promise(ObtenerPersonas);
    promise.then(CargarFilas).catch(ErrorF);

    $("btnModificar").addEventListener("click", Modificar);
}

function ObtenerPersonas(resolve, reject)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function()
    {
        if(this.status == 200 && this.readyState==4)
        {
            var lista = new Array(JSON.parse(this.responseText));
            resolve(lista);
        }else if(this.status == 404 && this.readyState != 4)
        {
            reject();
        }
    }

    request.open("GET", "http://localhost:3000/personas");
    request.send();
}

function CargarFilas(lista)
{
    var tabla = $("table");
    for (let i = 0; i < lista[0].length; i++)
    {
        let fila = document.createElement("tr");

        let cId = document.createElement("td");
        let cNombre = document.createElement("td");
        let cApellido = document.createElement("td");
        let cFecha = document.createElement("td");
        let cSexo = document.createElement("td");

        let tId = document.createTextNode(lista[0][i].id);
        let tNombre = document.createTextNode(lista[0][i].nombre);
        let tApellido = document.createTextNode(lista[0][i].apellido);
        let tFecha = document.createTextNode(lista[0][i].fecha);
        let tSexo = document.createTextNode(lista[0][i].sexo);

        cId.appendChild(tId);
        cNombre.appendChild(tNombre);
        cApellido.appendChild(tApellido);
        cFecha.appendChild(tFecha);
        cSexo.appendChild(tSexo);
        
        fila.appendChild(cId);
        fila.appendChild(cNombre);
        fila.appendChild(cApellido);
        fila.appendChild(cFecha);
        fila.appendChild(cSexo);
        
        fila.addEventListener("dblclick",desplegarFormFila);

        tabla.appendChild(fila);
    }
}

function ErrorF()
{
    alert("Ocurrió un error");
}

function desplegarFormFila(event)
{
    $("divForm").hidden = false;
    
    let fila = event.target.parentNode; 

    let id = fila.childNodes[0].childNodes[0].nodeValue;
    let nombre = fila.childNodes[1].childNodes[0].nodeValue;
    let apellido = fila.childNodes[2].childNodes[0].nodeValue;
    let fecha = fila.childNodes[3].childNodes[0].nodeValue;
    let sexo = fila.childNodes[4].childNodes[0].nodeValue;

    $("inputNombre").value = nombre;
    $("inputApellido").value = apellido;
    sexo == "Female" ? $("rFemenino").checked = true : $("rMasculino").checked = true;
    $("inputDate").value=fecha;
}

function Modificar()
{
    flagValues = true;

    if($("inputNombre").value.length < 3)
    {
        
    }



}