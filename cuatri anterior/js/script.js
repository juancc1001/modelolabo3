window.addEventListener("load",CargarElementos);

function $(id) {
    return document.getElementById(id);
}


function CargarElementos()
{
    var peticion = new XMLHttpRequest();  
    peticion.onreadystatechange = function()
    {
        
        if(peticion.status == 200 && peticion.readyState == 4)
        {
            $("divSpinner").hidden=true;
            var materias = JSON.parse(peticion.responseText);
    
            for (let index = 0; index < materias.length; index++) 
            {
                crearFila(materias[index]);
            }       
        }
    }

    peticion.open("GET","http://localhost:3000/materias",true);
    peticion.send();    
    $("divSpinner").hidden=false;
}

function crearFila(materia)
{
    var fila = document.createElement("tr");

    var tdId = document.createElement("td");
    var tdNombre = document.createElement("td");
    var tdFechaFinal = document.createElement("td");
    var tdFechaFinal = document.createElement("td");
    var tdCuatrimestre = document.createElement("td");
    var tdTurno = document.createElement("td");
    
    var txtId = document.createTextNode(materia.id);
    var txtNombre = document.createTextNode(materia.nombre);
    var txtFechaFinal = document.createTextNode(materia.fechaFinal);
    var txtCuatrimestre = document.createTextNode(materia.cuatrimestre);
    var txtTurno = document.createTextNode(materia.turno);

    fila.appendChild(tdId);
    tdId.appendChild(txtId);

    fila.appendChild(tdNombre);
    tdNombre.appendChild(txtNombre);

    fila.appendChild(tdFechaFinal);
    tdFechaFinal.appendChild(txtFechaFinal);

    fila.appendChild(tdCuatrimestre);
    tdCuatrimestre.appendChild(txtCuatrimestre);

    fila.appendChild(tdTurno);
    tdTurno.appendChild(txtTurno);
    


    fila.addEventListener("dblclick",desplegarFormFila);

    $("tabla").appendChild(fila);
}

//form hidden

function desplegarFormFila(event)
{
    var divMateria=$("divFormMateria");
    divMateria.hidden = false;

    var tabla = $("tabla");
    var fila = event.target.parentNode; 
    var id = fila.childNodes[0].childNodes[0].nodeValue;
    var nombre = fila.childNodes[1].childNodes[0].nodeValue;
    var fechaFinal = fila.childNodes[2].childNodes[0].nodeValue;
    var cuatrimestre = fila.childNodes[3].childNodes[0].nodeValue;
    var turno = fila.childNodes[4].childNodes[0].nodeValue;

    var dia = fechaFinal.slice(0,2);
    var mes = fechaFinal.slice(3,5);
    var anio = fechaFinal.slice(6);
    var fechaFormato = String(anio + "-" + mes + "-" + dia)

    $("txtNombre").value = nombre;
    $("selectCuatrimestre").value = cuatrimestre;
    $("dateFechaFinal").value = fechaFormato;

    
    if(turno == "Mañana")
    {
        $("mañana").checked=true;
    }
    else
    {
        $("noche").checked=true;
    }

    $("btnModificar").onclick=function()
    {
       
        let flagNombre = true;
        let flagFecha = true;
        let flagTurno = true;
        let flagCuatrimestre = true;
       
        if($("txtNombre").value.length < 6)
        {
            
            $("txtNombre").style.borderColor="red";          
            flagNombre = false;

        }

        if(!($("mañana").checked || $("noche").checked))
        {
            flagTurno = false;
        }

        var fechaFinal = new Date($("dateFechaFinal").value);
        var fechaActual = Date.now();

        if(fechaActual < fechaFinal)
        {
            $("dateFechaFinal").style.borderColor = "red";
            flagFecha = false;
        }
   
    
        if(flagNombre && flagFecha && flagFecha)
        {
            var nombreInput= $("txtNombre").value;
            var cuatrimestreInput = $("selectCuatrimestre").value;
            var turnoInput;
            var fechaInput = $("dateFechaFinal").value;

            if($("noche").checked)
            {
                turnoInput = "Noche";
                $("mañana").checked = false;
            }else{
                turnoInput = "Mañana";
                $("noche").checked = false;
            }

            var jsonMateria={"id":id, "nombre":nombreInput,"cuatrimestre":cuatrimestreInput,"fechaFinal":fechaInput,"turno":turnoInput}

            var peticion = new XMLHttpRequest();
            peticion.onreadystatechange = function() 
            {
                
                if(peticion.status == 200 && peticion.readyState == 4)
                {
                    $("divSpinner").hidden = true;
                    
        
                    fila.childNodes[1].childNodes[0].nodeValue = nombreInput;
                    fila.childNodes[2].childNodes[0].nodeValue = fechaInput;
                    fila.childNodes[4].childNodes[0].nodeValue = turnoInput;
                    
                }
            }

            peticion.open("POST","http://localhost:3000/editar");
            peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            peticion.send(JSON.stringify(jsonMateria));
            
            $("divSpinner").hidden = false;            
        }



    }

    $("btnEliminar").onclick = function()
    {
        var jsonIdMateria = {"id":id}
    
        var peticion = new XMLHttpRequest();
        peticion.onreadystatechange = function() 
        {                
            if(peticion.status == 200 && peticion.readyState == 4)
            {
                $("divSpinner").hidden=true;
                tabla.removeChild(fila);
            }
        }
        peticion.open("POST","http://localhost:3000/eliminar");
        peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        peticion.send(JSON.stringify(jsonIdMateria));
        $("divSpinner").hidden=false;

        
    }

    $("btnCerrar").onclick = function(){
        $("divFormMateria").hidden = true;
    }

}