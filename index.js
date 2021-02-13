function aggiungiEventi() {
  document.querySelectorAll(".draggebleDiv").forEach((draggebleDiv) => {
    dragElement(draggebleDiv);
  });
  document.getElementsByName("sfondo").forEach((inputSfondo) => {
    inputSfondo.onchange = cambiaSfondo;
  });
  document.getElementsByName("bordo").forEach((inputSfondo) => {
    inputSfondo.onchange = cambiaBordo;
  });
}

function dragElement(elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const header = elmnt.querySelector(".header");
  const headerDown = elmnt.querySelector(".header-down");

  if (header) {
    /* if present, the header is where you move the DIV from:*/
    header.onmousedown = dragMouseDown;
    headerDown.onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";

    const vediCoord = elmnt.querySelector(".view-coord");
    const text = `Y: ${elmnt.style.top} X: ${elmnt.style.left}`;
    vediCoord.innerHTML = text;
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function cambiaSfondo({ currentTarget: t }) {
  const divPrincipale =
    t.parentElement.parentElement.parentElement.parentElement;
  divPrincipale.style.backgroundColor = t.value;
  divPrincipale.style.color = getVisibleColor(t.value);
}

function cambiaBordo({ currentTarget: t }) {
  const divPrincipale =
    t.parentElement.parentElement.parentElement.parentElement;
  divPrincipale.style.borderColor = t.value;
  divPrincipale.style.borderWidth = "thick";
}

/**
 * Ritorna un colore visibile dato quello in input
 * @param {string} color rgb ex color like #123456
 * @returns {string} colore visibile dato l'input like #123456
 */
function getVisibleColor(color) {
  const red = parseInt(color.substr(1, 2), 16);
  const green = parseInt(color.substr(3, 2), 16);
  const blue = parseInt(color.substr(5, 2), 16);
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) return "#000000";
  else return "#ffffff";
}

function addDiv() {
  const draggabileDiv = document.createElement("div");
  draggabileDiv.classList.add("draggebleDiv");
  draggabileDiv.style.backgroundColor = "#f1f1f1";
  draggabileDiv.style.borderColor = "#ffffff";
  const containerDiv = document.createElement("div");
  containerDiv.classList.add("container");

  // header
  const headerDiv = document.createElement("div");
  headerDiv.classList.add("header", "headerColor");
  const smallHeader = document.createElement("small");
  smallHeader.classList.add("view-coord");
  smallHeader.innerHTML = "-";
  headerDiv.appendChild(smallHeader);
  containerDiv.appendChild(headerDiv);

  // id label
  const childDiv = document.createElement("div");
  const idLabel = document.createElement("label");
  idLabel.innerHTML = "ID: ";
  childDiv.appendChild(idLabel);
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.classList.add("form-control");
  nameInput.name = "id";
  nameInput.placeholder = "Nome ...";
  childDiv.appendChild(nameInput);
  containerDiv.appendChild(childDiv);

  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");

  // Sfondo
  const col1div = document.createElement("div");
  col1div.classList.add("col-sm");
  const labelSfondo = document.createElement("label");
  labelSfondo.innerHTML = "Sfondo: ";
  col1div.appendChild(labelSfondo);
  const inputSfondo = document.createElement("input");
  inputSfondo.name = "sfondo";
  inputSfondo.type = "color";
  inputSfondo.value = "#f1f1f1";
  inputSfondo.classList.add("form-control");
  inputSfondo.onchange = cambiaSfondo;
  col1div.appendChild(inputSfondo);
  rowDiv.appendChild(col1div);

  // Bordo
  const col2div = document.createElement("div");
  col2div.classList.add("col-sm");
  const labelBordo = document.createElement("label");
  labelBordo.innerHTML = "Bordo: ";
  col2div.appendChild(labelBordo);
  const inputBordo = document.createElement("input");
  inputBordo.name = "bordo";
  inputBordo.type = "color";
  inputBordo.value = "#ffffff";
  inputBordo.classList.add("form-control");
  inputBordo.onchange = cambiaBordo;
  col2div.appendChild(inputBordo);
  rowDiv.appendChild(col2div);

  containerDiv.appendChild(rowDiv);

  const spostabile = document.createElement("div");
  spostabile.classList.add("header-down", "headerColor", "my-2");
  containerDiv.appendChild(spostabile);
  draggabileDiv.appendChild(containerDiv);

  document.getElementById("main").appendChild(draggabileDiv);
  dragElement(draggabileDiv);
}

function esporta() {
  const div = document.createElement("div");
  div.classList.add("alert", "alert-primary");
  div.innerHTML = "Testo copiato sulla tastiera !";
  const obj = {
    commento: "commento della vista",
    riquadri: [],
    background: [255, 255, 255],
  };

  document.querySelectorAll(".draggebleDiv").forEach((e, idx) => {
    const el = getRiquadro(e);
    el.id = idx;
    obj.riquadri.push(el);
  });

  console.log(obj);

  const json = JSON.stringify(obj);
  copyToClipboard(json);

  document.querySelector("body").prepend(div);

  setInterval(() => {
    div.remove();
  }, 2000);
}

function getRiquadro(e) {
  const obj = {};
  obj.h = e.clientHeight;
  obj.w = e.offsetWidth;
  obj.x = e.offsetLeft;
  obj.y = e.offsetTop;
  obj.background = e.style.backgroundColor
    .replaceAll("rgb(", "")
    .replaceAll(")", "")
    .split(", ");
  obj.border = {
    color: e.style.borderColor
      .replaceAll("rgb(", "")
      .replaceAll(")", "")
      .split(", "),
    width: 1,
  };
  return obj;
}

function copyToClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
