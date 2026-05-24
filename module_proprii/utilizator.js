const AccesBD = require('./accessbd.js');
const parole = require('./parole.js');

const { RolFactory } = require('./roluri.js');
const crypto = require("crypto");
const nodemailer = require("nodemailer");


/**
 * Clasa ce reprezinta un Utilizator din sistem, oferind validari si functii
 * pentru gestionarea contului.
 */
class Utilizator {
    static tipConexiune = "local";
    static tabel = "utilizatori"
    static parolaCriptare = "tehniciweb";
    static emailServer = "proiect.tw23@gmail.com";
    static lungimeCod = 64;
    static numeDomeniu = "localhost:8080";
    #eroare;

    /**
     * Constructor pentru clasa Utilizator. Seteaza atributele si verifica datele.
     * @param {Object} [date] - Datele utilizatorului.
     * @param {number} [date.id] - ID-ul utilizatorului.
     * @param {string} [date.username] - Numele de utilizator.
     * @param {string} [date.nume] - Numele.
     * @param {string} [date.prenume] - Prenumele.
     * @param {string} [date.email] - Adresa de email.
     * @param {string} [date.parola] - Parola (criptata sau necriptata, in functie de context).
     * @param {string|Object} [date.rol] - Rolul utilizatorului.
     * @param {string} [date.culoare_chat="black"] - Culoarea textului de pe chat.
     * @param {string} [date.poza] - Calea catre poza de profil.
     */
    constructor({ id, username, nume, prenume, email, parola, rol, culoare_chat = "black", poza } = {}) {
        this.id = id;

        //optional sa facem asta in constructor
        try {
            if (this.checkUsername(username))
                this.username = username;
            else throw new Error("Username incorect");

        }
        catch (e) { this.#eroare = e.message }

        for (let prop in arguments[0]) {
            this[prop] = arguments[0][prop]
        }

        if (this.rol)
            this.rol = this.rol.cod ? RolFactory.creeazaRol(this.rol.cod) : RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare = "";
    }

    /**
     * Verifica daca un nume este valid (incepe cu majuscula, e urmat de litere mici).
     * @param {string} nume - Numele de verificat.
     * @returns {boolean} True daca este valid, False altfel.
     */
    checkName(nume) {
        return nume != "" && nume.match(new RegExp("^[A-Z][a-z]+$"));
    }

    /**
     * Seteaza numele utilizatorului.
     * @param {string} nume - Noul nume.
     * @throws {Error} Daca numele nu este valid.
     */
    set setareNume(nume) {
        if (this.checkName(nume)) this.nume = nume
        else {
            throw new Error("Nume gresit")
        }
    }

    /**
     * Seteaza username-ul (folosit la inregistrare si modificare profil).
     * @param {string} username - Noul username.
     * @throws {Error} Daca username-ul este incorect.
     */
    set setareUsername(username) {
        if (this.checkUsername(username)) this.username = username
        else {
            throw new Error("Username gresit")
        }
    }

    /**
     * Verifica validitatea unui username.
     * @param {string} username - Numele de utilizator.
     * @returns {boolean} True daca valid, altfel False.
     */
    checkUsername(username) {
        return username != "" && username.match(new RegExp("^[A-Za-z0-9#_./]+$"));
    }

    /**
     * Cripteaza o parola data folosind scryptSync.
     * @param {string} parola - Parola in clar.
     * @returns {string} Parola criptata (hex).
     */
    static criptareParola(parola) {
        return crypto.scryptSync(parola, Utilizator.parolaCriptare, Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Salveaza utilizatorul in baza de date si trimite un email de confirmare
     * impreuna cu tokenul asociat.
     */
    salvareUtilizator() {
        let parolaCriptata = Utilizator.criptareParola(this.parola);
        let utiliz = this;
        let token = parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({
            tabel: Utilizator.tabel,
            campuri: {
                username: this.username,
                nume: this.nume,
                prenume: this.prenume,
                parola: parolaCriptata,
                email: this.email,
                culoare_chat: this.culoare_chat,
                cod: token,
                poza: this.poza
            }
        }, function (err, rez) {
            if (err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes", "Username-ul tau este " + utiliz.username,
                    `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
                )
        });
    }
    //xjxwhotvuuturmqm


    /**
     * Trimite un email catre utilizator.
     * @param {string} subiect - Subiectul email-ului.
     * @param {string} mesajText - Continutul plain-text al email-ului.
     * @param {string} mesajHtml - Continutul HTML al email-ului.
     * @param {Array} [atasamente=[]] - Fisiere atasate.
     * @returns {Promise<void>}
     */
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente = []) {
        var transp = nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth: {//date login 
                user: Utilizator.emailServer,
                pass: "olmskoetkuprxzta"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        //genereaza html
        await transp.sendMail({
            from: Utilizator.emailServer,
            to: this.email, //TO DO
            subject: subiect,//"Te-ai inregistrat cu succes",
            text: mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }

    /**
     * Returneaza asincron un utilizator dupa username (din BD).
     * @param {string} username - Username-ul de cautat.
     * @returns {Promise<Utilizator|null>} Instanta utilizatorului gasit sau null.
     */
    static async getUtilizDupaUsernameAsync(username) {
        if (!username) return null;
        try {
            let rezSelect = await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {
                    tabel: "utilizatori",
                    campuri: ['*'],
                    conditiiAnd: [`username='${username}'`]
                });
            if (rezSelect.rowCount != 0) {
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }

    }
    /**
     * Returneaza un utilizator dupa username folosind un callback.
     * @param {string} username - Numele de utilizator.
     * @param {Object} obparam - Obiect custom pentru transferul datelor, de ex res din Express.
     * @param {Function} proceseazaUtiliz - Callback-ul apelat.
     */
    static getUtilizDupaUsername(username, obparam, proceseazaUtiliz) {
        if (!username) return null;
        let eroare = null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select(
            {
                tabel: "utilizatori",
                campuri: ['*'],
                conditiiAnd: [`username='${username}'`]
            }
            , function (err, rezSelect) {
                if (err) {
                    console.error("Utilizator:", err);
                    //throw new Error()
                    eroare = -2;
                }
                else if (rezSelect.rowCount == 0) {
                    eroare = -1;
                }
                //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
                let u = new Utilizator(rezSelect.rows[0])
                proceseazaUtiliz(u, obparam, eroare);
            });
    }

    /**
     * Verifica daca utilizatorul are un anumit drept pe baza rolului sau.
     * @param {symbol} drept - Dreptul de verificat.
     * @returns {boolean} True daca are dreptul, False in caz contrar.
     */
    areDreptul(drept) {
        return this.rol.areDreptul(drept);
    }
}
module.exports = { Utilizator: Utilizator }