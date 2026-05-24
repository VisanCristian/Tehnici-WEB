const Drepturi = require('./drepturi.js');

/**
 * Clasa de baza pentru un Rol.
 */
class Rol {
    /**
     * Obtine tipul rolului.
     * @returns {string} Tipul rolului (generic).
     */
    static get tip() {
        return "generic";
    }

    /**
     * Obtine drepturile asociate acestui rol.
     * @returns {symbol[]} Un array de simboluri reprezentand drepturile.
     */
    static get drepturi () {
        return [];
    }

    /**
     * Constructor pentru clasa Rol. Seteaza codul rolului.
     */
    constructor () {
        this.cod = this.constructor.tip;
    }

    /**
     * Verifica daca rolul are un anumit drept.
     * @param {symbol} drept - Dreptul de verificat.
     * @returns {boolean} True daca are dreptul, altfel False.
     */
    areDreptul(drept) {
        return this.constructor.drepturi.includes(drept);
    }
}

/**
 * Clasa pentru rolul de Administrator.
 * @extends Rol
 */
class RolAdmin extends Rol {
    static get tip() {
        return "admin";
    }

    constructor() {
        super();
    }

    /**
     * Verifica daca administratorul are un anumit drept (are toate drepturile).
     * @returns {boolean} Mereu True.
     */
    areDreptul() {
        return true;
    }
}

/**
 * Clasa pentru rolul de Moderator.
 * @extends Rol
 */
class RolModerator extends Rol {
    static get tip() {
        return "moderator";
    }

    static get drepturi() {
        return [
            Drepturi.vizualizareUtilizatori,
            Drepturi.stergereUtilizatori,
        ];
    }

    constructor () {
        super();
    }
}

/**
 * Clasa pentru rolul de Client comun.
 * @extends Rol
 */
class RolClient extends Rol {
    static get tip() {
        return "comun";
    }

    static get drepturi() {
        return [
            Drepturi.cumparareProduse,
            Drepturi.adaugareGalerie,
        ]
    }

    constructor() {
        super();
    }
}

/**
 * Clasa Factory pentru crearea instatelor de roluri in functie de tip.
 */
class RolFactory {
    /**
     * Creeaza un rol pe baza tipului specificat.
     * @param {string} tip - Tipul rolului.
     * @returns {Rol} O instanta a rolului specificat.
     */
    static creeazaRol(tip) {
        switch(tip) {
            case RolAdmin.tip : return new RolAdmin();
            case RolModerator.tip : return new RolModerator();
            case RolClient.tip : return new RolClient();
        }
    }
}

module.exports = {
    RolFactory: RolFactory,
    RolAdmin: RolAdmin,
}
