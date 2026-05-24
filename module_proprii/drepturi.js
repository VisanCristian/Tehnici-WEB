/**
 * Obiect ce defineste simbolurile pentru drepturile aplicatiei, folosite la verificarea
 * permisiunilor utilizatorilor in functie de rol.
 * @type {Object<string, symbol>}
 */
const Drepturi = {
    vizualizareUtilizatori: Symbol("vizualizareUtilizatori"),
    stergereUtilizatori: Symbol("stergereUtilizatori"),
    cumparareProduse: Symbol("cumparareProduse"),
    adaugareProduse: Symbol("adaugareProduse"),
    stergereProduse: Symbol("stergereProduse"),
    modificareProduse: Symbol("modificareProduse"),
    adaugareRoluri: Symbol("adaugareRoluri"),
    stergereRoluri: Symbol("stergereRoluri"),
    modificareRoluri: Symbol("modificareRoluri"),
    adaugareGalerie: Symbol("adaugareGalerie")
}

module.exports = Drepturi;