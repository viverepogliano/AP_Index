const openContenuto = async function (href) {
    console.log("openContenuto", href)
    const response = await fetch(href)
    const data = await response.text()
    console.log(data)
    const contenuto = document.getElementById("contenuto");
    contenuto.innerHTML = data;
    const tables = contenuto.querySelectorAll("table");
    // tables.forEach(table => sistemaLink(table, href));
};

const sistemaLink = function (table, href) {
    const rows = Array.from(table.rows).filter(row => row.style.display !== 'none');
    if (rows.length === 1) {
        const div = table.parentElement;
        div.style.display = 'none';
        const h1 = div.previousElementSibling;
        if (h1) h1.style.display = 'none';
        return;
    }

    const links = table.querySelectorAll("a");
    links.forEach(link => {
        let docHref = link.getAttribute("href");
        if (!docHref.startsWith("http")) {
            docHref = href.replace(/\/.*$/, "/" + docHref);
            link.setAttribute("href", docHref);
        }
    });
};

const aggiungiTabella = function (pos, idTableDiv, title, data) {
    const contenuto = document.getElementById("contenuto");
    const newHtml = contenuto.innerHTML + `<h1>${pos + 1}. ${title}</h1>` +
        `<div id="${idTableDiv}">${data}</div>`;
    contenuto.innerHTML = newHtml;
};

const cercaInTabella = function (idTableDiv) {
    const table = document.querySelector(`#${idTableDiv} table`);
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
        const allCells = row.querySelectorAll('td');
        if (allCells.length > 0) {
            const regExp = new RegExp(document.getElementById("testo").value, 'i');
            const found = Array.from(allCells).some(td => regExp.test(td.textContent));
            row.style.display = found ? '' : 'none';
        }
    });
};

const caricaPagina = function (pos) {
    const idTableDiv = `tableDiv-${pos}`;
    const href = this.getAttribute("href");
    const title = this.textContent;

    fetch(href)
        .then(response => response.text())
        .then(data => {
            aggiungiTabella(pos, idTableDiv, title, data);
            cercaInTabella(idTableDiv);
            const table = document.querySelector(`#${idTableDiv} table`);
            sistemaLink(table, href);
        });
};

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            openContenuto(link.getAttribute("href"));
        });
    });

    const cercaButton = document.getElementById("cerca");
    cercaButton.setAttribute('disabled', 'disabled');

    const testoInput = document.getElementById("testo");
    testoInput.addEventListener("keyup", function () {
        if (testoInput.value !== '') {
            cercaButton.removeAttribute('disabled');
        } else {
            cercaButton.setAttribute('disabled', 'disabled');
        }
    });

    testoInput.addEventListener("keypress", function (e) {
        if (e.code === "Enter") cercaButton.click();
    });

    cercaButton.addEventListener("click", () => {
        const contenuto = document.getElementById("contenuto");
        contenuto.innerHTML = "";
        links.forEach((link, index) => caricaPagina.call(link, index));
    });
});
