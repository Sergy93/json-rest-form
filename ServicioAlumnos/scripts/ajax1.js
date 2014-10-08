var url = "http://localhost:50119/api/";
var urlFinal = url + "alumnos";
//var urlFinal = 'http://alumnos-mcsd2014.azure-mobile.net/tables/cursos';



var saltoDeLinea = function () {
    var br = document.createElement("br");
    return br;
}

var borrarTabla = function () {
    var contenido = document.getElementById("contenido");
    contenido.removeChild(document.getElementById("tablaDatos"));
}
var borrarForm = function () {
    document.getElementById("formDiv").removeChild(
        document.getElementById("form"));
}

var cargarHTML = function (datos) {
    borrarTabla();
    borrarForm();

    cargarTabla(datos);
    cargarForm(datos);
}

var cargarTabla = function (datos) {
    var tabla = document.createElement("table");

    var contenido = document.getElementById("contenido");
    tabla.setAttribute("id", "tablaDatos");

    for (var i = 0; i < datos.length; i++) {
        var fila = document.createElement("tr");


        for (var param in datos[i]) {
            if (param == "id") fila.setAttribute("id", datos[i][param]);

            var td = document.createElement("td");
            var text = document.createTextNode(param + " = " + datos[i][param]);

            td.appendChild(text);
            fila.appendChild(td);
        }
        tabla.appendChild(fila);
    }
    contenido.appendChild(tabla);

    var filas = document.getElementsByTagName('tr');

    for (var j = 0; j < filas.length; j++) {
        filas[j].onclick = function (evt) {
            var seleccionados = document.getElementsByClassName("seleccionado");

            for (var j = 0; j < seleccionados.length; j++) {
                seleccionados[j].className = "";
            }
            evt.target.parentElement.className = "seleccionado";
        }
    }
    //Creamos el botón de borrar
    var btnBorrar = document.createElement("input");
    btnBorrar.value = "Borrar";

    btnBorrar.setAttribute("id", "btnUpdate");
    btnBorrar.setAttribute("type", "button");

    btnBorrar.onclick = borrarElemento;

    tabla.appendChild(btnBorrar);

    //Creamos el botón de actualizar
    var btnUpdate = document.createElement("input");
    btnUpdate.value = "Actualizar";

    btnUpdate.setAttribute("id", "btnUpdate");
    btnUpdate.setAttribute("type", "button");

    btnUpdate.onclick = actualizarElemento;

    tabla.appendChild(btnUpdate);
}

var cargarForm = function (datos) {

    var form = document.createElement("form");
    form.setAttribute("id", "form");

    for (var param in datos[0]) {

        if (param != "$id" && param != "id") {
            var input = document.createElement("input");

            //Creamos los atributos
            var attrId = document.createAttribute("id");
            attrId.value = param;
            var attrPlaceholder = document.createAttribute("placeholder");
            attrPlaceholder.value = param;
            var attrType = document.createAttribute("type");
            attrType.value = "text";

            //Añadimos los atributos
            input.setAttributeNode(attrId);
            input.setAttributeNode(attrPlaceholder);
            input.setAttributeNode(attrType);

            form.appendChild(input);
            form.appendChild(saltoDeLinea());
        }
    }

    //Creamos el botón de guardar
    var btnGuardar = document.createElement("input");
    btnGuardar.value = "Guardar";

    attrType = document.createAttribute("type");
    attrType.value = "button";

    attrId = document.createAttribute("id");
    attrId.value = "btnGuardar";

    btnGuardar.setAttributeNode(attrId);
    btnGuardar.setAttributeNode(attrType);

    btnGuardar.onclick = escribirDatos;

    form.appendChild(btnGuardar);

    document.getElementById("formDiv").appendChild(form);
}

var leerDatos = function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", urlFinal, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
            var datos = eval(xhr.responseText);
            cargarHTML(datos);
        }
    }
    xhr.send();
}

var escribirDatos = function () {

    var inputs = document.getElementsByTagName('input');
    var nombres = [];

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") == "text") {
            if (!inputs[i].value)
                return;

            nombres.push([inputs[i].getAttribute("id"), inputs[i].value]);
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", urlFinal, true);

    xhr.setRequestHeader("Content-type", "application/json");

    var json = {};
    for (var j = 0; j < nombres.length; j++) {
        Object.defineProperty(json, nombres[j][0], {
            configurable: true,
            enumerable: true,
            writable: true,
            value: nombres[j][1]
        });
    }

    var jsonText = JSON.stringify(json);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            leerDatos();
        }
    }
    xhr.send(jsonText);
}

var borrarElemento = function () {
    var seleccionados = document.getElementsByClassName("seleccionado");

    var id = seleccionados[0].getAttribute("id");

    borrarPorId(id);
}

var borrarPorId = function (id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", urlFinal + "/" + id, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            leerDatos();
        }
    }
    xhr.send();
}
var actualizarElemento = function () {
    var seleccionados = document.getElementsByClassName("seleccionado");

    var id = seleccionados[0].getAttribute("id");

    actualizarPorId(id);

}
var actualizarPorId = function (id) {
    var inputs = document.getElementsByTagName('input');
    var nombres = [];

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") == "text") {
            if (!inputs[i].value)
                return;

            nombres.push([inputs[i].getAttribute("id"), inputs[i].value]);
        }
    }

    var metodo = urlFinal.indexOf("azure") > -1 ? "PATCH" : "PUT";

    var xhr = new XMLHttpRequest();
    xhr.open(metodo, urlFinal + "/" + id, true);

    xhr.setRequestHeader("Content-type", "application/json");

    var json = {};
    for (var j = 0; j < nombres.length; j++) {
        Object.defineProperty(json, nombres[j][0], {
            configurable: true,
            enumerable: true,
            writable: true,
            value: nombres[j][1]
        });
    }
    json.id = id;

    var jsonText = JSON.stringify(json);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            leerDatos();
        }
    }
    xhr.send(jsonText);
}

leerDatos();

