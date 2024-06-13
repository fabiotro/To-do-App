// Variablen für die Formularelemente und die Aufgabenliste
let form = document.getElementById("neueAufgabe");
let titelInput = document.getElementById("titelInput");
let startdatumInput = document.getElementById("startdatumInput");
let enddatumInput = document.getElementById("enddatumInput");
let beschreibungInput = document.getElementById("beschreibungInput");
let autorInput = document.getElementById("autorInput");
let fortschrittInput = document.getElementById("fortschrittInput");
let wichtigCheckbox = document.getElementById("wichtigCheckbox");
let dringendCheckbox = document.getElementById("dringendCheckbox");
let tasks = document.getElementById("tasks");
let searchInput = document.querySelector('input[type="search"]');
let searchButton = document.querySelector('button[type="submit"]');

// Kategorie Dropdown Auswahl
$(".dropdown-item").on("click", function () {
  selectedCategory = $(this).text();
  $(".dropdown-toggle").text(selectedCategory);
});

// Funktion, welche auf das Absenden des Formulars reagiert
form.addEventListener("submit", (e) => {
  // Ändert die Formularelemente zurück auf den "Hinzufügen"-Zustand
  changeFormToAdd();
  // Verhindert das Neuladen der Seite
  e.preventDefault();
  // Überprüft die Eingaben des Formulars
  formValidation();
  // Setzt die Formularelemente zurück
  resetForm();
});

// Funktion zur Validierung des Formulars
let formValidation = () => {
  let errors = [];

  // Titelüberprüfung
  if (titelInput.value.trim() === "") {
    errors.push("Fehler: Der Titel darf nicht leer sein.");
  } else if (titelInput.value.length < 1 || titelInput.value.length > 255) {
    errors.push(`Fehler: Der Titel muss zwischen 1 und 255 Zeichen lang sein.`);
  }

  // Startdatumüberprüfung
  if (startdatumInput.value === "") {
    errors.push("Fehler: Das Startdatum darf nicht leer sein.");
  } else if (!isValidDate(startdatumInput.value)) {
    errors.push("Fehler: Das Startdatum muss im Format YYYY-MM-DD sein.");
  }

  // Enddatumüberprüfung
  if (
    enddatumInput.value !== "" &&
    new Date(startdatumInput.value) > new Date(enddatumInput.value)
  ) {
    errors.push("Fehler: Das Enddatum darf nicht vor dem Startdatum liegen.");
  } else if (enddatumInput.value !== "" && !isValidDate(enddatumInput.value)) {
    errors.push("Fehler: Das Enddatum muss im Format YYYY-MM-DD sein.");
  }

  // Autorenüberprüfung
  if (autorInput.value.trim().length < 3 || autorInput.value.length > 10) {
    errors.push(
      `Fehler: Der Autorname muss zwischen 3 und 10 Zeichen lang sein.`
    );
  }

  // Fortschrittsüberprüfung
  if (fortschrittInput.value !== "") {
    if (!isNumeric(fortschrittInput.value)) {
      errors.push("Fehler: Der Fortschritt muss eine ganze Zahl sein.");
    } else {
      let fortschrittValue = parseInt(fortschrittInput.value);
      if (fortschrittValue < 1 || fortschrittValue > 100) {
        errors.push(`Fehler: Der Fortschritt muss zwischen 1 und 100 liegen.`);
      }
    }
  }

  if (errors.length > 0) {
    // Fehlermeldungen werden in einem Alert-Fenster und in der Konsole ausgegeben
    alert(errors.join("\n"));
    console.log(errors.join("\n"));
  } else {
    console.log("Erfolg: Aufgabe wurde hinzugefügt.");
    // Die Daten werden akzeptiert und die Aufgabe wird erstellt
    acceptData();
    resetForm();
    // Das Modal wird geschlossen
    $("#neueAufgabe").modal("hide");
  }
};

// Funktion zur Überprüfung des Datumsformats
let isValidDate = (dateString) => {
  // Regulärer Ausdruck für das Datumsformat
  let regex = /^\d{4}-\d{2}-\d{2}$/;
  // Wenn das Datum nicht dem Format entspricht, wird false zurückgegeben
  if (!dateString.match(regex)) return false;

  // Das Datum wird in einen Zeitstempel umgewandelt
  let date = new Date(dateString);
  let timestamp = date.getTime();

  // Wenn der Zeitstempel nicht eine Zahl ist, wird false zurückgegeben
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return false;

  // Wenn das Datum nicht dem ISO-Format entspricht, wird false zurückgegeben
  return dateString === date.toISOString().split("T")[0];
};

// Funktion zur Überprüfung, ob ein String eine Zahl ist
let isNumeric = (str) => {
  // Wenn der String kein String ist, wird false zurückgegeben
  if (typeof str != "string") return false;
  // Wenn der String eine Zahl ist, wird true zurückgegeben
  return !isNaN(str) && !isNaN(parseFloat(str));
};

// Array für die Aufgaben
let data = JSON.parse(localStorage.getItem("data")) || [];

// Funktion zum Hinzufügen der Daten in das Array
let acceptData = () => {
  data.push({
    titel: titelInput.value,
    startdatum: startdatumInput.value,
    enddatum: enddatumInput.value,
    beschreibung: beschreibungInput.value,
    autor: autorInput.value,
    kategorie: selectedCategory,
    fortschritt: fortschrittInput.value,
    wichtig: wichtigCheckbox.checked,
    dringend: dringendCheckbox.checked,
  });

  // Die Daten werden in den LocalStorage gespeichert
  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);
  createTasks();
};

// Funktion zum Erstellen der Aufgaben
let createTasks = () => {
  resetForm();
  tasks.innerHTML = "";
  data.map((x, y) => { // x ist die Aufgabe, y ist der Index der Aufgabe
    return (tasks.innerHTML += `
      <div id=${y} class="task-card">
  
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div class="fw-bold">
              <div class="task-title fs-4">
                ${x.titel}
              </div>
              <!-- Es wird geprüft, welche Checkboxen aktiviert sind und entsprechend die Icons hinzugefügt -->
              ${x.dringend ? '<i class="bi bi-clock-fill icon-clock"></i>' : ""}
              ${
                x.wichtig
                  ? '<i class="bi bi-exclamation-triangle-fill icon-exclamation"></i>'
                  : ""
              }
            </div>
            <div class="small text-secondary">
              Startdatum: ${x.startdatum}
              <br>
              Enddatum: ${x.enddatum}
            </div>
          
          </li>
          <li class="list-group-item"><b class="fw-bold">Beschreibung:</b> ${
            x.beschreibung
          }</li>
          <li class="list-group-item"><b class="fw-bold">Autor*in:</b> ${
            x.autor
          }</li>
          <li class="list-group-item"><b class="fw-bold">Kategorie:</b> ${
            x.kategorie
          }</li>
          <li class="list-group-item"><b class="fw-bold">Fortschritt:</b> ${
            x.fortschritt
          }</li>
        </ul>

        <span class="options">
          <i onClick="editTask(this)" data-bs-toggle="modal" data-bs-target="#neueAufgabe" class="bi bi-pencil-square"></i>
          <i onClick="deleteTask(this);createTasks()" class="bi bi-trash"></i>
        </span>
      </div>
    `);
  });

  resetForm();
};

// Funktion zum Löschen einer Aufgabe
let deleteTask = (e) => {
  e.parentElement.parentElement.remove(); // Entfernt die Aufgabe aus dem DOM
  data.splice(e.parentElement.parentElement.id, 1); // Entfernt die Aufgabe aus dem Array
  localStorage.setItem("data", JSON.stringify(data)); // Speichert das Array im LocalStorage
  console.log(data);
};

// Funktion zum Bearbeiten einer Aufgabe
let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement;

  titelInput.value =
    selectedTask.children[0].children[0].children[0].children[0].innerHTML.trim();

  let datumsText =
    selectedTask.children[0].children[0].children[1].innerHTML.trim();
  let datumsTeile = datumsText.split("<br>");
  startdatumInput.value = datumsTeile[0].replace("Startdatum: ", "").trim();
  enddatumInput.value = datumsTeile[1].replace("Enddatum: ", "").trim();

  let beschreibungText = selectedTask.children[0].children[1].innerHTML.trim();
  // Zusätzlich wird geprüft, ob das Feld "Beschreibung" bei der Erstellung der Aufgabe leer war
  if (beschreibungText.startsWith('<b class="fw-bold">Beschreibung:</b>')) {
    beschreibungInput.value = beschreibungText
      .replace('<b class="fw-bold">Beschreibung:</b>', "")
      .trim();
  } else {
    beschreibungInput.value = "";
  }

  let autorText = selectedTask.children[0].children[2].innerHTML.trim();
  autorInput.value = autorText
    .replace('<b class="fw-bold">Autor*in:</b>', "")
    .trim();

  let kategorieText = selectedTask.children[0].children[3].innerHTML.trim();
  if (kategorieText.startsWith('<b class="fw-bold">Kategorie:</b>')) {
    selectedCategory = kategorieText
      .replace('<b class="fw-bold">Kategorie:</b>', "")
      .trim();
  } else {
    selectedCategory = "";
  }

  // Setze den Text des Dropdown-Buttons basierend auf der ausgewählten Kategorie
  if (selectedCategory) {
    $(".dropdown-toggle").text(selectedCategory);
  } else {
    $(".dropdown-toggle").text("Kategorie");
  }

  let fortschrittText = selectedTask.children[0].children[4].innerHTML.trim();
  fortschrittInput.value = fortschrittText
    .replace('<b class="fw-bold">Fortschritt:</b>', "")
    .trim();

  wichtigCheckbox.checked =
    selectedTask.querySelector(".icon-exclamation") !== null;

  dringendCheckbox.checked = selectedTask.querySelector(".icon-clock") !== null;

  $("#neueAufgabeLabel").text("Aufgabe bearbeiten");
  $("#add").text("Ändern");
  $("#dismiss-btn").hide();
  $("#dismiss-btn-top").hide();

  deleteTask(e);
};

// Funktion zum Ändern des Formulars auf den "Hinzufügen"-Zustand
let changeFormToAdd = () => {
  $("#neueAufgabeLabel").text("Aufgabe hinzufügen");
  $("#add").text("Hinzufügen");
  $("#dismiss-btn").show();
  $("#dismiss-btn-top").show();
};

// Funktion zum Zurücksetzen der Formularelemente
let resetForm = () => {
  titelInput.value = "";
  startdatumInput.value = "";
  enddatumInput.value = "";
  beschreibungInput.value = "";
  autorInput.value = "";
  selectedCategory = "";
  document.querySelector(".dropdown-toggle").textContent = "Kategorie";
  fortschrittInput.value = "";
  wichtigCheckbox.checked = false;
  dringendCheckbox.checked = false;
};

// Funktion zum Laden der Aufgaben
(() => {
  data = JSON.parse(localStorage.getItem("data")) || []; // Lädt die Daten aus dem LocalStorage
  console.log(data);
  createTasks();
})();

// Funktion zum Suchen von Aufgaben
searchButton.addEventListener("click", (e) => { // Event-Listener für das Klicken auf den Suchen-Button
  e.preventDefault();
  let searchText = searchInput.value.toLowerCase(); // Der Suchtext wird in Kleinbuchstaben umgewandelt
  let taskCards = document.querySelectorAll(".task-card"); // Alle Aufgaben werden ausgewählt

  taskCards.forEach((taskCard) => { // Jede Aufgabe wird durchgegangen
    let taskTitle = taskCard
      .querySelector(".task-title")
      .innerText.toLowerCase();
    if (taskTitle.includes(searchText)) { // Wenn der Titel der Aufgabe den Suchtext enthält, wird die Aufgabe angezeigt
      $(taskCard).show();
    } else {
      $(taskCard).hide();
    }
  });
});
