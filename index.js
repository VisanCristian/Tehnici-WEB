const express = require("express");
const path = require("path");
const fs = require("fs");
const sass = require("sass");
const sharp = require("sharp");
const pg = require("pg");
app = express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

// Baza de date - conectare
client = new pg.Client({
    database: "tw_proiect",
    user: "admin",
    password: "123456",
    host: "localhost",
    port: 5432,

});
client.connect();

client.query("select * from produse where id > 3;", function (err, rez) {
    if (err)
        console.log("eroare la select", err);
    else
        rez.rows.forEach(el => {
            console.log(el);
        });
});

obGlobal = {
    obErori: null,
    obImagini: null,
    obProduse: null,
    categoriiNav: [],
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup"),
};

let vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"];
for (let vector of vect_foldere) {
    let caleFolder = path.join(__dirname, vector);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}


app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.get("/favicon.ico", function (req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"));
});

function initErori() {
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    let erori = obGlobal.obErori = JSON.parse(continut);
    let eroare_default = erori.eroare_default;
    eroare_default.imagine = path.join(erori.cale_baza, eroare_default.imagine);
    for (let eroare of erori.info_erori) {
        eroare.imagine = path.join(erori.cale_baza, eroare.imagine);
    }
}

function initImagini() {
    var continut = fs.readFileSync(path.join(__dirname, "resurse/json/galerie.json")).toString("utf-8");
    obGlobal.obImagini = JSON.parse(continut);

    // resize cu sharp

    let vImagini = obGlobal.obImagini.imagini;
    let caleGalerie = obGlobal.obImagini.cale_galerie;
    let caleAbs = path.join(__dirname, caleGalerie);
    let caleAbsMediu = path.join(caleAbs, "mediu");
    if (!fs.existsSync(caleAbsMediu)) {
        fs.mkdirSync(caleAbsMediu);
    }

    for (let img of vImagini) {
        let [numeFis, ext] = img.fisier_imagine.split(".");
        let caleImgAbs = path.join(caleAbs, img.fisier_imagine);
        let caleImgMediuAbs = path.join(caleAbsMediu, numeFis + "_mediu" + ".webp");
        sharp(caleImgAbs).resize(300).toFile(caleImgMediuAbs);
        img.fisier_imagine_mediu = path.join("/", caleGalerie, "mediu", numeFis + "_mediu" + ".webp");
        img.fisier_imagine = path.join("/", caleGalerie, img.fisier_imagine);
    }
    console.log("Obiect imagini", obGlobal.obImagini);
}

function initProduse() {
    client.query("select * from produse", function (err, res) {
        if (err) {
            console.log("Eroare la select", err);
        } else {
            obGlobal.obProduse = res.rows;
        }
    });
}

function initCategoriiNav() {
    let caleSql = path.join(__dirname, "resurse/sql/db.sql");
    let continut = fs.readFileSync(caleSql).toString("utf-8");

    // Extragem valorile din CREATE TYPE categorie_tip AS ENUM (...)
    let regex = /CREATE\s+TYPE\s+categorie_tip\s+AS\s+ENUM\s*\(([^)]+)\)/i;
    let match = continut.match(regex);
    if (match) {
        let valori = match[1];
        // Extragem fiecare valoare din ghilimele simple
        let categorii = [];
        let regexVal = /'([^']+)'/g;
        let m;
        while ((m = regexVal.exec(valori)) !== null) {
            categorii.push(m[1]);
        }
        obGlobal.categoriiNav = categorii;
        console.log("Categorii navigare (din enum SQL):", obGlobal.categoriiNav);
    } else {
        console.error("Nu s-a gasit enum-ul categorie_tip in db.sql");
    }
}

function checkFiles() {
    let caleErori = path.join(__dirname, "resurse/json/erori.json");
    if (!fs.existsSync(caleErori)) {
        console.error("CRITICAL: Fisierul 'resurse/json/erori.json' lipseste. Creati fisierul inainte de a reporni serverul.");
        process.exit(1);
    }

    let continut = fs.readFileSync(caleErori).toString("utf-8");
    let erori = JSON.parse(continut);

    if (erori.info_erori == undefined) {
        console.error(
            "INFO: Proprietatea 'info_erori' lipseste din 'resurse/json/erori.json'.\n" +
            '  → Adaugati: "info_erori": [{ "identificator": "...", "status": "...", "titlu": "...", "text:": "...", "imagine": "..."}]'
        );
    }

    if (erori.cale_baza == undefined) {
        console.error(
            "INFO: Proprietatea 'cale_baza' lipseste din 'resurse/json/erori.json'.\n" +
            '  → Adaugati: "cale_baza": "resurse/imagini/erori"'
        );
    }

    if (erori.eroare_default == undefined) {
        console.error(
            "INFO: Proprietatea 'eroare_default' lipseste din 'resurse/json/erori.json'.\n" +
            '  → Adaugati: "eroare_default": { "titlu": "...", "text": "...", "imagine": "..." }'
        );
    } else {
        if (erori.eroare_default.titlu == undefined) {
            console.error(
                "INFO: Proprietatea 'eroare_default.titlu' lipseste din 'resurse/json/erori.json'.\n" +
                '  → Adaugati: "titlu": "A aparut o eroare"'
            );
        }
        if (erori.eroare_default.text == undefined) {
            console.error(
                "INFO: Proprietatea 'eroare_default.text' lipseste din 'resurse/json/erori.json'.\n" +
                '  → Adaugati: "text": "A aparut o eroare neasteptata. Va rugam reincercati."'
            );
        }
        if (erori.eroare_default.imagine == undefined) {
            console.error(
                "INFO: Proprietatea 'eroare_default.imagine' lipseste din 'resurse/json/erori.json'.\n" +
                '  → Adaugati: "imagine": "eroare_default.png"'
            );
        }
    }

    let cale_baza = path.join(__dirname, erori.cale_baza);
    if (!fs.existsSync(cale_baza)) {
        console.error(
            `INFO: Directorul '${erori.cale_baza}' specificat in 'resurse/json/erori.json' nu exista.\n` +
            `  → Creati directorul '${erori.cale_baza}' sau corectati valoarea proprietatii 'cale_baza'.`
        );
    }

    for (let eroare of erori.info_erori) {
        let caleImagine = path.join(cale_baza, eroare.imagine);
        if (!fs.existsSync(caleImagine)) {
            console.error(
                `INFO: Imaginea '${eroare.imagine}' pentru eroarea '${eroare.identificator}' nu a fost gasita.\n` +
                `  → Adaugati imaginea in '${erori.cale_baza}' sau corectati valoarea 'imagine' in 'resurse/json/erori.json'.`
            );
        }
    }

    let grupe = {};
    for (let eroare of erori.info_erori) {
        let id = eroare.identificator;
        if (!grupe[id]) {
            grupe[id] = [];
        }
        grupe[id].push(eroare);
    }

    for (let id in grupe) {
        if (grupe[id].length > 1) {
            console.error(
                `INFO: Identificatorul '${id}' apare de ${grupe[id].length} ori in 'info_erori' din 'resurse/json/erori.json'.\n` +
                `  → Pastrati doar o singura intrare cu identificatorul '${id}'.`
            );
            for (let eroare of grupe[id]) {
                let { identificator, ...restProprietati } = eroare;
                console.error(`  → `, restProprietati);
            }
        }
    }
}

function compileazaScss(caleScss, caleCss) {
    if (!caleCss) {
        let numeFisExt = path.basename(caleScss)
        let numeFis = numeFisExt.split(".")[0];
        caleCss = numeFis + ".css";
    }
    if (!path.isAbsolute(caleScss))
        caleScss = path.join(obGlobal.folderScss, caleScss);
    if (!path.isAbsolute(caleCss))
        caleCss = path.join(obGlobal.folderCss, caleCss);

    let caleBackup = path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup))
        fs.mkdirSync(caleBackup, { recursive: true });

    let numeFisCss = path.basename(caleCss);
    if (fs.existsSync(caleCss))
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css", numeFisCss));

    rez = sass.compile(caleScss, { sourceMap: true });
    fs.writeFileSync(caleCss, rez.css);

}

function afisareEroare(res, identificator, titlu, text, imagine) {
    let eroare = obGlobal.obErori.info_erori.find((elem) => elem.identificator == identificator);

    let errDefault = obGlobal.obErori.eroare_default;
    if (eroare?.status)
        res.status(eroare.identificator);
    res.render("pagini/eroare", {
        imagine: imagine || eroare?.imagine || errDefault.imagine,
        titlu: titlu || eroare?.titlu || errDefault.titlu,
        text: text || eroare?.text || errDefault.text,
        categoriiNav: obGlobal.categoriiNav,
    });
}



// Generare fisiere CSS din SCSS
vFisiere = fs.readdirSync(obGlobal.folderScss);
for (let numeFis of vFisiere) {
    if (path.extname(numeFis) == ".scss") {
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function (eveniment, numeFis) {
    if (eveniment == "change" || eveniment == "rename") {
        let caleCompleta = path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)) {
            compileazaScss(caleCompleta);
        }
    }
});


app.get(["/", "/index", "/home"], function (req, res) {
    res.render("pagini/index", {
        ip: req.ip,
        imagini: obGlobal.obImagini.imagini,
        categoriiNav: obGlobal.categoriiNav,
    });
});

app.get("/contact", function (req, res) {
    res.render("pagini/contact", {
        categoriiNav: obGlobal.categoriiNav,
    });
});

app.get("/produse", function (req, res) {
    client.query(`select * from produse`, function (err, rez) {
        if (err) {
            console.log("Eroare select: ", err);
            afisareEroare(res, 2);
        } else {
            let produse = rez.rows;

            let personajeSet = new Set();
            let jocuri = new Set();
            let categorii = new Set();
            let subcategorii = new Set();
            let expedieri = new Set();
            let pretMin = Infinity, pretMax = -Infinity;

            for (let p of produse) {
                if (p.personaje_asociate) {
                    for (let pers of p.personaje_asociate) {
                        if (pers) personajeSet.add(pers);
                    }
                }
                if (p.joc_sursa) jocuri.add(p.joc_sursa);
                if (p.categorie) categorii.add(p.categorie);
                if (p.subcategorie) subcategorii.add(p.subcategorie);
                if (p.expediere) expedieri.add(p.expediere);
                let pret = parseFloat(p.pret);
                if (pret < pretMin) pretMin = pret;
                if (pret > pretMax) pretMax = pret;
            }

            res.render("pagini/produse", {
                produse: produse,
                personaje: Array.from(personajeSet).sort(),
                jocuri: Array.from(jocuri).sort(),
                categorii: Array.from(categorii).sort(),
                subcategorii: Array.from(subcategorii).sort(),
                expedieri: Array.from(expedieri).sort(),
                pretMin: pretMin,
                pretMax: pretMax,
                categoriiNav: obGlobal.categoriiNav,
            });
        }
    });

});

app.get("/produse/produs/:id", function (req, res) {
    client.query(`select * from produse where id = ${req.params.id}`, function (err, rez) {
        if (err) {
            console.log("EROARE", err);
            afisareEroare(res, 2);
        } else {
            if (rez.rows.length == 0) {
                afisareEroare(res, 404, "Produs inexistent");
                return;
            }
            res.render("pagini/produs", {
                produs: rez.rows[0],
                categoriiNav: obGlobal.categoriiNav,
            });
        }
    });
});


app.get("/*pagina", function (req, res) {
    console.log("Cale pagina", req.url);
    console.log("Cale pagina oare css? :", req.url);
    console.log("extname:", path.extname(req.url));

    if (req.url.startsWith("/resurse") && path.extname(req.url) == "") {
        afisareEroare(res, 403);
        return;
    }

    if (path.extname(req.url) == ".ejs") {
        afisareEroare(res, 400);
        return;
    }

    try {
        res.render("pagini" + req.url, { categoriiNav: obGlobal.categoriiNav }, function (err, rezRandare) {
            if (err) {
                if (err.message.includes("Failed to lookup view")) {
                    afisareEroare(res, 404);
                } else {
                    afisareEroare(res);
                }
            } else {
                res.send(rezRandare);
                console.log("Rezultat randare", rezRandare);
            }
        });
    } catch (err) {
        if (err.message.includes("Cannot find module")) {
            afisareEroare(res, 404);
        } else {
            afisareEroare(res);
        }
    }
});


initErori();
initImagini();
initProduse();
initCategoriiNav();
checkFiles();




app.listen(8080);
console.log("Serverul a pornit!");
