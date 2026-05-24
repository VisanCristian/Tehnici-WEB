const PRODUSE_PER_PAGINA = 4;
let produseDeAfisat = [];
let pinned = [];
let removedSession = [];
try {
  removedSession = JSON.parse(sessionStorage.getItem("removedSession")) || [];
} catch (e) { }
let paginaCurenta = 1;
let nr_pagini = 1;
let produseAfisateCurent = [];
let animationTimeouts = [];

window.onload = function () {

  function afiseazaPagina(pagina) {
    for (let tid of animationTimeouts) {
      clearTimeout(tid);
    }
    animationTimeouts = [];

    let nrPagini = Math.ceil(produseDeAfisat.length / PRODUSE_PER_PAGINA);
    genereazaPaginare(nrPagini);
    for (let p of produseAfisateCurent) {
      p.style.display = "";
      p.classList.remove("active");
      p.classList.add("hidden");
    }
    produseAfisateCurent = [];

    let indexStart = (pagina - 1) * PRODUSE_PER_PAGINA;
    let indexFinal = Math.min(indexStart + PRODUSE_PER_PAGINA, produseDeAfisat.length);
    let t = 100;
    let produsePageCurenta = [];
    for (let i = indexStart; i < indexFinal; i++) {
      produsePageCurenta.push(produseDeAfisat[i]);
      produseAfisateCurent.push(produseDeAfisat[i]);
    }
    produsePageCurenta.forEach((element, index) => {
      let tid = setTimeout(() => {
        element.classList.remove("hidden");
        element.classList.add("active");
      }, (index + 1) * t);
      animationTimeouts.push(tid);
    });
  }

  function genereazaPaginare(nrPagini) {
    let divPagini = document.getElementById("paginare");
    if (!divPagini) return;
    divPagini.innerHTML = "";

    if (nrPagini <= 1) return; 

    for (let i = 1; i <= nrPagini; i++) {
      let buton = document.createElement("button");
      buton.className = "but-pagina";

      if (i === paginaCurenta) {
        buton.style.color = "var(--accent-cyan)";
      }

      buton.innerHTML = i;

      buton.onclick = function () {
        paginaCurenta = i;
        afiseazaPagina(paginaCurenta);
      };

      divPagini.appendChild(buton);
    }
  }

  function valideazaInputuri() {
    let valid = true
    if (!valideazaText()) valid = false
    if (!valideazaTextarea()) valid = false
    return valid
  }

  function filtreazaProduse() {
    if (!valideazaInputuri()) return

    let inpNume = document.getElementById("filtru-nume").value.trim().toLowerCase()

    let inpPretMax = parseFloat(document.getElementById("filtru-pret").value.trim())

    let inpExpediere = document.getElementById("filtru-expediere").value.trim().toLowerCase()

    let grupRadio = document.getElementsByName("filtru-joc")
    let jocSelectat = ""
    let isToateJocurile = false
    for (let rad of grupRadio) {
      if (rad.checked) {
        if (rad.value !== "") {
          jocSelectat = rad.value
        } else {
          isToateJocurile = true
        }
        break
      }
    }

    let inpCategorie = document.getElementById("filtru-categorie").value.trim().toLowerCase()

    let selectSubcat = document.getElementById("filtru-subcategorie")
    let subcatSelectate = []
    for (let opt of selectSubcat.options) {
      if (opt.selected && opt.value !== "") subcatSelectate.push(opt.value)
    }

    let checkboxPersonaje = document.getElementsByName("filtru-personaj")
    let personajeBifate = []
    for (let cb of checkboxPersonaje) {
      if (cb.checked) personajeBifate.push(cb.value)
    }

    let textVal = document.getElementById("filtru-textarea").value.trim()
    let cuvinteCheie = []
    if (textVal) {
      cuvinteCheie = textVal.split(",").map(function (c) { return c.trim().toLowerCase() }).filter(function (c) { return c.length > 0 })
    }

    let produse = document.getElementsByClassName("produs")
    let nrProduseVizibile = 0
    let produseFiltrate = [];

    for (let prod of produse) {
      if (removedSession.includes(prod.id)) {
        continue;
      }

      if (pinned.includes(prod.id)) {
        produseFiltrate.unshift(prod);
        nrProduseVizibile++;
        continue;
      }
      let nume = prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
      let cond1 = nume.includes(inpNume)

      let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
      let cond2 = pret <= inpPretMax

      let expediere = prod.getAttribute("data-expediere").toLowerCase()
      let cond3 = !inpExpediere || expediere === inpExpediere

      let joc = prod.getAttribute("data-joc")
      let cond4 = isToateJocurile || joc === jocSelectat

      let categorie = prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase()
      let cond5 = inpCategorie === "" || categorie === inpCategorie

      let subcategorie = prod.getAttribute("data-subcategorie")
      let cond6 = false
      if (subcatSelectate.length === 0) {
        cond6 = true
      } else {
        if (subcategorie === "" && subcatSelectate.indexOf("necategorizate") !== -1) {
          cond6 = true
        } else if (subcatSelectate.indexOf(subcategorie) !== -1) {
          cond6 = true
        }
      }

      let personajeProd = prod.getAttribute("data-personaje")
      let vectPersonaje = personajeProd ? personajeProd.split("|") : []
      let cond7 = personajeBifate.length === 0
      if (!cond7) {
        for (let pers of vectPersonaje) {
          if (personajeBifate.indexOf(pers) !== -1) {
            cond7 = true
            break
          }
        }
      }

      let descriere = prod.getElementsByClassName("val-descriere")[0].innerHTML.trim().toLowerCase()
      let cond8 = true
      if (cuvinteCheie.length > 0) {
        cond8 = false
        for (let cuv of cuvinteCheie) {
          if (descriere.includes(cuv)) {
            cond8 = true
            break
          }
        }
      }

      if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
        produseFiltrate.push(prod);
        nrProduseVizibile++
      }
    }

    let msg = document.getElementById("mesaj-lipsa-produse")
    if (nrProduseVizibile === 0) {
      if (!msg) {
        msg = document.createElement("div")
        msg.id = "mesaj-lipsa-produse"
        msg.className = "text-center p-4 w-100 fs-4 text-warning"
        msg.innerHTML = "<i class='bi bi-emoji-frown'></i> Nu exista niciun produs care sa corespunda filtrelor selectate."
        document.getElementById("container-produse").appendChild(msg)
      }
    } else {
      if (msg) {
        msg.remove()
      }
    }

    nr_pagini = Math.ceil(nrProduseVizibile / PRODUSE_PER_PAGINA);

    return produseFiltrate;
  }

  function aplicaFiltrare() {
    produseDeAfisat = filtreazaProduse();
    if (produseDeAfisat) {
      paginaCurenta = 1;
      afiseazaPagina(paginaCurenta);
    }
  }

  function salveazaFiltre() {
    if (typeof getCookie === "function" && !getCookie("cookiesAccepted")) {
      alert("Trebuie să acceptați cookie-urile din banner pentru a putea salva filtrele!");
      return;
    }

    let filtre = {
      nume: document.getElementById("filtru-nume").value,
      pret: document.getElementById("filtru-pret").value,
      expediere: document.getElementById("filtru-expediere").value,
      joc: Array.from(document.getElementsByName("filtru-joc")).find(r => r.checked)?.value || "",
      categorie: document.getElementById("filtru-categorie").value,
      subcategorie: Array.from(document.getElementById("filtru-subcategorie").selectedOptions).map(o => o.value),
      personaje: Array.from(document.getElementsByName("filtru-personaj")).filter(c => c.checked).map(c => c.value),
      textarea: document.getElementById("filtru-textarea").value
    };
    if (typeof setCookie === "function") {
      setCookie("savedFilters", JSON.stringify(filtre), 5 / 86400);
    }
  }

  function restaureazaFiltre() {
    if (typeof getCookie !== "function") return false;
    let saved = getCookie("savedFilters");
    if (!saved) return false;

    try {
      let filtre = JSON.parse(saved);
      document.getElementById("filtru-nume").value = filtre.nume || "";
      document.getElementById("filtru-pret").value = filtre.pret || document.getElementById("filtru-pret").max;
      document.getElementById("range-valoare").innerHTML = document.getElementById("filtru-pret").value;
      document.getElementById("filtru-expediere").value = filtre.expediere || "";

      let radioJocuri = document.getElementsByName("filtru-joc");
      for (let rad of radioJocuri) {
        rad.checked = (rad.value === filtre.joc);
      }

      document.getElementById("filtru-categorie").value = filtre.categorie || "";

      let selectSubcat = document.getElementById("filtru-subcategorie");
      for (let opt of selectSubcat.options) {
        opt.selected = filtre.subcategorie && filtre.subcategorie.includes(opt.value);
      }

      let checkPersonaje = document.getElementsByName("filtru-personaj");
      for (let cb of checkPersonaje) {
        cb.checked = filtre.personaje && filtre.personaje.includes(cb.value);
      }

      document.getElementById("filtru-textarea").value = filtre.textarea || "";

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  function sorteaza(semn) {
    if (!valideazaInputuri()) return

    let produse = document.getElementsByClassName("produs")
    let vProduse = Array.from(produse)
    vProduse.sort(function (a, b) {
      let pretA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim())
      let pretB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim())
      if (pretA !== pretB) {
        return semn * (pretA - pretB)
      }
      let nrA = parseInt(a.getAttribute("data-nr-personaje")) || 0
      let nrB = parseInt(b.getAttribute("data-nr-personaje")) || 0
      return semn * (nrA - nrB)
    })
    for (let prod of vProduse) {
      prod.parentElement.appendChild(prod)
    }
  }

  function afiseazaNotificare(html) {
    let p = document.getElementById("notificare-calcul")
    if (!p) {
      p = document.createElement("div")
      p.id = "notificare-calcul"
      p.innerHTML = html
      document.body.appendChild(p)
      setTimeout(function () {
        let p1 = document.getElementById("notificare-calcul")
        if (p1) p1.remove()
      }, 2000)
    } else {
      p.innerHTML = html
    }
  }

  window.pinArticol = function (idProdus, btn) {
    let prod = document.getElementById(idProdus);

    if (pinned.includes(idProdus)) {
      pinned.splice(pinned.indexOf(idProdus), 1);
      if (btn) btn.classList.replace("btn-info", "btn-outline-info");
      if (prod) prod.style.boxShadow = "";
    } else {
      pinned.push(idProdus);
      if (btn) btn.classList.replace("btn-outline-info", "btn-info");
      if (prod) prod.style.boxShadow = "0 0 1rem var(--accent-cyan)";
    }

    aplicaFiltrare();
  }

  window.removeTempArticol = function (idProdus) {
    let index = produseDeAfisat.findIndex(p => p.id === idProdus);
    if (index !== -1) {
      produseDeAfisat.splice(index, 1);

      if (produseDeAfisat.length === 0) {
        afiseazaPagina(1);
      } else {
        let nrPaginiMici = Math.ceil(produseDeAfisat.length / PRODUSE_PER_PAGINA);
        if (paginaCurenta > nrPaginiMici) paginaCurenta = nrPaginiMici;
        afiseazaPagina(paginaCurenta);
      }
    }
  }

  window.removeSessionArticol = function (idProdus) {
    if (!removedSession.includes(idProdus)) {
      removedSession.push(idProdus);
      sessionStorage.setItem("removedSession", JSON.stringify(removedSession));

      aplicaFiltrare();
    }
  }


  document.getElementById("btn-filtreaza").onclick = aplicaFiltrare
  document.getElementById("btn-sort-asc").onclick = function () { sorteaza(1) }
  document.getElementById("btn-sort-desc").onclick = function () { sorteaza(-1) }
  document.getElementById("btn-salveaza-filtre").onclick = function () { salveazaFiltre() }
  
  document.getElementById("btn-calculeaza").onclick = function () {
    if (!valideazaInputuri()) return

    let produse = document.getElementsByClassName("produs")
    let suma = 0
    let count = 0
    let minim = Infinity
    let maxim = -Infinity

    for (let prod of produse) {
      if (prod.style.display !== "none") {
        let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
        suma += pret
        count++
        if (pret < minim) minim = pret
        if (pret > maxim) maxim = pret
      }
    }

    if (count === 0) {
      afiseazaNotificare("Nu exista produse afisate pentru calcul.")
      return
    }

    let media = suma / count
    let mesaj = "<strong>Statistici preturi (" + count + " produse):</strong><br>" +
      '<i class="bi bi-calculator"></i> Suma: ' + suma.toFixed(2) + " RON<br>" +
      '<i class="bi bi-bar-chart"></i> Media: ' + media.toFixed(2) + " RON<br>" +
      '<i class="bi bi-arrow-down-short"></i> Minim: ' + minim.toFixed(2) + " RON<br>" +
      '<i class="bi bi-arrow-up-short"></i> Maxim: ' + maxim.toFixed(2) + " RON"

    afiseazaNotificare(mesaj)
  }

  document.getElementById("btn-reseteaza").onclick = function () {
    if (!confirm("Sunteti sigur ca doriti sa resetati toate filtrele?")) return

    document.getElementById("filtru-nume").value = ""
    document.getElementById("filtru-nume").classList.remove("is-invalid")

    let inputRange = document.getElementById("filtru-pret")
    inputRange.value = inputRange.max
    document.getElementById("range-valoare").innerHTML = inputRange.max

    document.getElementById("filtru-expediere").value = ""

    document.getElementById("joc-oricare").checked = true

    document.getElementById("filtru-categorie").selectedIndex = 0

    let selectSubcat = document.getElementById("filtru-subcategorie")
    for (let opt of selectSubcat.options) {
      opt.selected = opt.value !== ""
    }

    let checkboxPersonaje = document.getElementsByName("filtru-personaj")
    for (let cb of checkboxPersonaje) {
      cb.checked = true
    }

    document.getElementById("filtru-textarea").value = ""
    document.getElementById("filtru-textarea").classList.remove("is-invalid")

    let msg = document.getElementById("mesaj-lipsa-produse")
    if (msg) msg.remove()

    let produse = document.getElementsByClassName("produs")
    let vProduse = Array.from(produse)
    vProduse.sort(function (a, b) {
      let idA = parseInt(a.id.replace("ent", ""))
      let idB = parseInt(b.id.replace("ent", ""))
      return idA - idB
    })
    for (let prod of vProduse) {
      prod.parentElement.appendChild(prod)
    }

    aplicaFiltrare()
  }

  // Nume
  function valideazaText() {
    let val = document.getElementById("filtru-nume").value.trim()
    if (val !== "" && /^\d+$/.test(val)) {
      document.getElementById("filtru-nume").classList.add("is-invalid")
      return false
    }
    document.getElementById("filtru-nume").classList.remove("is-invalid")
    return true
  }
  document.getElementById("filtru-nume").oninput = function () {
    if (valideazaText()) {
      document.getElementById("filtru-nume").classList.remove("is-invalid")
    }
    aplicaFiltrare()
  }

  // Pret
  document.getElementById("filtru-pret").onchange = function () {
    let val = this.value.trim()
    document.getElementById("range-valoare").innerHTML = val
  }
  document.getElementById("filtru-pret").oninput = function () {
    let val = this.value.trim()
    document.getElementById("range-valoare").innerHTML = val
    aplicaFiltrare()
  }

  // Expediere
  document.getElementById("filtru-expediere").onchange = aplicaFiltrare

  // Joc
  let radioJocuri = document.getElementsByName("filtru-joc")
  for (let radio of radioJocuri) {
    radio.onchange = aplicaFiltrare
  }

  // Categorie
  document.getElementById("filtru-categorie").onchange = aplicaFiltrare

  // Subcategorie
  document.getElementById("filtru-subcategorie").onchange = aplicaFiltrare

  // Personaje
  let checkPersonaje = document.getElementsByName("filtru-personaj")
  for (let check of checkPersonaje) {
    check.onchange = aplicaFiltrare
  }

  // Textarea
  function valideazaTextarea() {
    let val = document.getElementById("filtru-textarea").value.trim()
    if (val === "") return true
    let cuvinte = val.split(",").map(function (c) { return c.trim() }).filter(function (c) { return c.length > 0 })
    if (cuvinte.length === 0) {
      document.getElementById("filtru-textarea").classList.add("is-invalid")
      return false
    }
    document.getElementById("filtru-textarea").classList.remove("is-invalid")
    return true
  }
  document.getElementById("filtru-textarea").oninput = function () {
    if (valideazaTextarea()) {
      document.getElementById("filtru-textarea").classList.remove("is-invalid")
    }
    aplicaFiltrare()
  }


  if (restaureazaFiltre()) {
    aplicaFiltrare();
  } else {
    produseDeAfisat = Array.from(document.getElementsByClassName("produs"));
    nr_pagini = Math.ceil(produseDeAfisat.length / PRODUSE_PER_PAGINA);
    afiseazaPagina(1);
  }
}