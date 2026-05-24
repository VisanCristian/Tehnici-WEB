const { Client, Pool } = require("pg");

/**
 * Clasa pentru gestionarea accesului la baza de date PostgreSQL folosind pattern-ul Singleton.
 */
class AccessBD {
    static #instanta = null;
    static #initializat = false;

    /**
     * Constructorul clasei AccessBD. Arunca eroare daca este apelat direct (trebuie folosit getInstanta).
     * @throws {Error} Arunca eroare daca instanta a fost deja creata sau daca nu este apelat prin getInstanta().
     */
    constructor() {
        if (AccessBD.#instanta) {
            throw new Error("Deja a fost instantiat");
        } else if (!AccessBD.#initializat) {
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }

    /**
     * Initializeaza o conexiune locala la baza de date PostgreSQL.
     */
    initLocal() {
        this.client = new Client({
            database: "tw_proiect",
            user: "admin",
            password: "123456",
            host: "localhost",
            port: 5432,
        });
        this.client.connect();
    }

    /**
     * Obtine clientul conexiunii la baza de date.
     * @returns {Client} Clientul pg curent.
     * @throws {Error} Daca clasa nu a fost instantiata anterior prin getInstanta().
     */
    getClient() {
        if (!AccessBD.#instanta) {
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    /**
     * Returneaza instanta Singleton a clasei AccessBD (o creeaza daca nu exista).
     * @param {Object} [options] - Optiuni de initializare.
     * @param {string} [options.init="local"] - Tipul de initializare ("local").
     * @returns {AccessBD} Instanta curenta a clasei.
     */
    static getInstanta({ init = "local" } = {}) {
        console.log(this);
        if (!this.#instanta) {
            this.#initializat = true;
            this.#instanta = new AccessBD();

            try {
                switch (init) {
                    case "local": this.#instanta.initLocal();
                }
            } catch (e) {
                console.error("Eroare la initializarea bazei de date!");
            }
        }
        return this.#instanta;
    }

    /**
     * Executa un query de tip SELECT.
     * @param {Object} [optiuni] - Configuratia de selectie.
     * @param {string} [optiuni.tabel=""] - Numele tabelului de interogat.
     * @param {string[]} [optiuni.campuri=[]] - Lista cu campurile ce trebuie selectate.
     * @param {string[]} [optiuni.conditiiAnd=[]] - Lista de conditii SQL conectate prin "AND" pentru clauza WHERE.
     * @param {Function} callback - Functia callback apelata la finalizarea query-ului.
     * @param {Array} [parametriiQuery=[]] - Parametrii pentru un query parametrizat.
     */
    select({ tabel = "", campuri = [], conditiiAnd = [] } = {}, callback, parametriiQuery = []) {
        let conditiiWhere = "";
        if (conditiiAnd.length > 0) {
            conditiiWhere = `where ${conditiiAnd.join(" and ")}`;
        }
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditiiWhere}`;
        console.error(comanda);
        this.client.query(comanda, parametriiQuery, callback);
    }

    /**
     * Executa asincron un query de tip SELECT si il returneaza (ca un Promise).
     * @param {Object} [optiuni] - Configuratia de selectie.
     * @param {string} [optiuni.tabel=""] - Numele tabelului de interogat.
     * @param {string[]} [optiuni.campuri=[]] - Lista cu campurile ce trebuie selectate.
     * @param {string[]} [optiuni.conditiiAnd=[]] - Lista de conditii SQL conectate prin "AND" pentru clauza WHERE.
     * @returns {Promise<Object|null>} Returneaza rezultatul query-ului sau null in caz de eroare.
     */
    async selectAsync({ tabel = "", campuri = [], conditiiAnd = [] } = {}) {
        let conditiiWhere = "";
        if (conditiiAnd.length > 0) {
            conditiiWhere = `where ${conditiiAnd.join(" and ")}`;
        }
        let comanda = `select ${campuri.join(",")} from ${tabel} ${conditiiWhere}`;

        try {
            let rez = await this.client.query(comanda);
            return rez;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Executa un query de tip INSERT.
     * @param {Object} [optiuni] - Configuratia pentru insert.
     * @param {string} [optiuni.tabel=""] - Numele tabelului.
     * @param {Object} [optiuni.campuri={}] - Perechi cheie-valoare pentru coloana-valoare ce vor fi inserate.
     * @param {Function} [callback] - Callback apelat dupa interogare (nota: parametrul 'campuri' suprascrie al doilea argument aici)
     */
    insert({ tabel = "", campuri = {} } = {}, callback) {
        let comanda = `insert into ${tabel} (${Object.keys(campuri).join(",")}) values (
            ${Object.values(campuri).map((x) => `'${x}'`).join(",")}
        )`;
        console.log(comanda);
        this.client.query(comanda, callback);
    }

    /**
     * Executa un query de tip UPDATE.
     * @param {Object} [optiuni] - Configuratia pentru update.
     * @param {string} [optiuni.tabel=""] - Numele tabelului.
     * @param {Object} [optiuni.campuri={}] - Perechi cheie-valoare pentru datele ce se actualizeaza.
     * @param {string[]} [optiuni.conditiiAnd=[]] - Conditii pentru clauza WHERE, unite prin "AND".
     * @param {Function} callback - Functia callback apelata la finalizarea query-ului.
     * @param {Array} parametriiQuery - Parametri aditionali trimisi clientului pg (optional).
     */
    update({ tabel = "", campuri = {}, conditiiAnd = [] } = {}, callback, parametriiQuery) {

        let campuriActualizate = [];
        for (let prop in campuri) {
            campuriActualizate.push(`${prop} = '${campuri[prop]}'`);
        }
        let conditiiWhere = "";
        if (conditiiAnd.length > 0) {
            conditiiWhere = `where ${conditiiAnd.join(" and ")}`;
        }

        let comanda = `update ${tabel} set ${campuriActualizate.join(",")} ${conditiiWhere}`;
        console.log(comanda);
        this.client.query(comanda, parametriiQuery, callback);
    }

    /**
     * Executa un query parametrizat de tip UPDATE pentru prevenirea SQL injection.
     * @param {Object} [optiuni] - Configuratia pentru update.
     * @param {string} [optiuni.tabel=""] - Numele tabelului.
     * @param {string[]} [optiuni.campuri=[]] - O lista de chei ce trebuie actualizate.
     * @param {Array} [optiuni.valori=[]] - Valorile asociate cheilor mentionate in `campuri`.
     * @param {string[]} [optiuni.conditiiAnd=[]] - Conditii pentru clauza WHERE, unite prin "AND".
     * @param {Function} callback - Functia callback apelata la finalizarea query-ului.
     * @throws {Error} Daca numarul de elemente din campuri difera de numarul elementelor din valori.
     */
    updateParametrizat({ tabel = "", campuri = [], valori = [], conditiiAnd = [] } = {}, callback) {
        if (campuri.length != valori.length)
            throw new Error("Numarul de campuri difera de numarul de valori");
        let campuriActualizate = [];
        for (let i = 0; i < campuri.length; i++)
            campuriActualizate.push(`${campuri[i]} = $${i + 1}`);

        let conditiiWhere = "";
        if (conditiiAnd.length > 0)
            conditiiWhere = `where ${conditiiAnd.join(" and ")}`;

        let comanda = `update ${tabel} set ${campuriActualizate.join(",")} ${conditiiWhere}`;
        this.client.query(comanda, valori, callback);
    }

    /**
     * Executa un query de tip DELETE.
     * @param {Object} [optiuni] - Configuratia pentru delete.
     * @param {string} [optiuni.tabel=""] - Numele tabelului de unde se sterg inregistrari.
     * @param {string[]} [optiuni.conditiiAnd=[]] - Conditiile de selectie ale inregistrarilor ce urmeaza a fi sterse (unite prin "AND").
     * @param {Function} callback - Functia callback ce se executa la sfarsitul query-ului.
     */
    delete({ tabel = "", conditiiAnd = [] } = {}, callback) {
        let conditiiWhere = "";
        if (conditiiAnd.length > 0) {
            conditiiWhere = `where ${conditiiAnd.join(" and ")}`;
        }
        let comanda = `delete from ${tabel} ${conditiiWhere}`;
        console.log(comanda);
        this.client.query(comanda, callback);
    }
}

module.exports = AccessBD;