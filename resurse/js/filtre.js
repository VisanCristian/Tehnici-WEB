window.onload = function () {

    document.getElementById("filtru-pret").onchange = function () {
        let val = this.value.trim()
        document.getElementById("range-valoare").innerHTML = val
    }

    document.getElementById("filtru-textarea").oninput = function () {
        if (valideazaTextarea()) {
            document.getElementById("filtru-textarea").classList.remove("is-invalid")
        }
    }

    document.getElementById("filtru-nume").oninput = function () {
        if (valideazaText()) {
            document.getElementById("filtru-nume").classList.remove("is-invalid")
        }
    }

    function valideazaText() {
        let val = document.getElementById("filtru-nume").value.trim()
        if (val !== "" && /^\d+$/.test(val)) {
            document.getElementById("filtru-nume").classList.add("is-invalid")
            return false
        }
        document.getElementById("filtru-nume").classList.remove("is-invalid")
        return true
    }

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

    function valideazaInputuri() {
        let valid = true
        if (!valideazaText()) valid = false
        if (!valideazaTextarea()) valid = false
        return valid
    }

    document.getElementById("btn-filtreaza").onclick = function () {
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
        for (let opt of selectSubcat.selectedOptions) {
            if (opt.value !== "") subcatSelectate.push(opt.value)
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

        for (let prod of produse) {
            prod.style.display = "none"

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
            let cond6 = subcatSelectate.length === 0 || subcatSelectate.indexOf(subcategorie) !== -1

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
                prod.style.display = "flex"
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
            prod.style.display = "flex"
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

    document.getElementById("btn-sort-asc").onclick = function () { sorteaza(1) }
    document.getElementById("btn-sort-desc").onclick = function () { sorteaza(-1) }

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

}

