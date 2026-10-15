import holaMundo from "./holaMundo.js";

const div = document.querySelector("#hola-mundo-div");

div.innerHTML = "<p>" + holaMundo() + "</p>";
