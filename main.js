$(document).ready(function () {
  // Aktualisiert die Fortschrittsleiste, wenn der Wert des Inputs geändert wird
  $("#fortschrittInput").on("input", function () {
    var value = $(this).val();
    $(".progress-bar")
      .css("width", value + "%")
      .attr("aria-valuenow", value)
      .text(value + "%");
  });
  // Ändert die Farbe der Fortschrittsleiste basierend auf dem Wert
  $("#fortschrittInput").on("input", function () {
    var value = $(this).val();

    // Aktualisiert den Wert und den Text der Fortschrittsleiste
    $(".progress-bar")
      .css("width", value + "%")
      .attr("aria-valuenow", value)
      .text(value + "%");

    // Entfernt alle Farbklassen
    $(".progress-bar").removeClass("bg-success bg-warning bg-danger");

    // Fügt die Farbklassen basierend auf dem Wert hinzu
    if (value < 33) {
      $(".progress-bar").addClass("bg-danger");
    } else if (value < 66) {
      $(".progress-bar").addClass("bg-warning");
    } else {
      $(".progress-bar").addClass("bg-success");
    }
  });
});

let form = document.getElementById("neueAufgabe");
let titelInput = document.getElementById("titelInput");
let startdatumInput = document.getElementById("startdatumInput");
let enddatumInput = document.getElementById("enddatumInput");
let beschreibungInput = document.getElementById("beschreibungInput");
let autorInput = document.getElementById("autorInput");
let fortschrittInput = document.getElementById("fortschrittInput");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

// Kategorie Dropdown Auswahl
$(".dropdown-item").on("click", function () {
  selectedCategory = $(this).text();
  $(".dropdown-toggle").text(selectedCategory);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  if (titelInput.value === "") {
    console.log("Fehler: Aufgabe kann nicht leer sein.");
  } else {
    console.log("Erfolg: Aufgabe wurde hinzugefügt.");
    acceptData();
    resetForm();
    $("#neueAufgabe").modal("hide");
  }
};

let data = JSON.parse(localStorage.getItem("data")) || [];

let acceptData = () => {
  data.push({
    titel: titelInput.value,
    startdatum: startdatumInput.value,
    enddatum: enddatumInput.value,
    beschreibung: beschreibungInput.value,
    autor: autorInput.value,
    kategorie: selectedCategory, // Aktualisiert
    fortschritt: fortschrittInput.value,
  });

  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
};

let createTasks = () => {
  tasks.innerHTML = "";
  data.map((x, y) => {
    return (tasks.innerHTML += `
      <div id=${y} class="task-card">
  
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="fw-bold">
              ${x.titel}
            </div>
            <div class="small text-secondary">
              Startdatum: ${x.startdatum}
              <br>
              Enddatum: ${x.enddatum}
            </div>
          
          </li>
          <li class="list-group-item">Beschreibung: ${x.beschreibung}</li>
          <li class="list-group-item">Autor*in: ${x.autor}</li>
          <li class="list-group-item">Kategorie: ${x.kategorie}</li>
          <li class="list-group-item">Fortschritt: ${x.fortschritt}%</li>
        </ul>

        <span class="options">
          <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#neueAufgabe" class="fas fa-edit"></i>
          <i onClick="deleteTask(this);createTasks()" class="fas fa-trash-alt"></i>
        </span>
      </div>
    `);
  });

  resetForm();
};

let deleteTask = (e) => {
  e.parentElement.parentElement.remove();
  data.splice(e.parentElement.parentElement.id, 1);
  localStorage.setItem("data", JSON.stringify(data));
  console.log(data);
};

// Funktion zum Bearbeiten einer Aufgabe
let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  titelInput.value = selectedTask.children[0].innerHTML;
  startdatumInput.value = selectedTask.children[1].innerHTML.split(": ")[1];
  enddatumInput.value = selectedTask.children[2].innerHTML.split(": ")[1];
  beschreibungInput.value = selectedTask.children[3].innerHTML.split(": ")[1];
  autorInput.value = selectedTask.children[4].innerHTML.split(": ")[1];
  document.querySelector(".dropdown-toggle").textContent =
    selectedTask.children[5].innerHTML.split(": ")[1];
  selectedCategory = selectedTask.children[5].innerHTML.split(": ")[1];
  fortschrittInput.value = selectedTask.children[6].innerHTML.split(": ")[1];

  deleteTask(e);
};

let resetForm = () => {
  titelInput.value = "";
  startdatumInput.value = "";
  enddatumInput.value = "";
  beschreibungInput.value = "";
  autorInput.value = "";
  selectedCategory = "";
  document.querySelector(".dropdown-toggle").textContent = "Kategorie";
  fortschrittInput.value = "";
};

(() => {
  data = JSON.parse(localStorage.getItem("data")) || [];
  console.log(data);
  createTasks();
})();
