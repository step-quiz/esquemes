/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: data/lexic.js
 * ROL: El lèxic controlat: totes les paraules que poden sortir als enunciats i a
 *      les respostes (a part dels noms de data/noms.js i dels nombres).
 * ARQUITECTURA: Dades. tests/plantilles.test.js falla si una plantilla fa servir
 *      una paraula que no és aquí: abans d'afegir-la, cal mirar si n'hi ha una
 *      de més fàcil o una que ja surti en altres problemes (mateix criteri que el
 *      lèxic de step-quiz/a, docs/LEXIC.md). Els verbs, només en present.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.ESQUEMES_LEXIC = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    // prettier-ignore
    var noms = [
        'alumnes', 'amic', 'amics', 'animals', 'anys', 'biblioteca', 'bitllet', 'bitllets', 'bossa', 'bosses', 'bus',
        'capsa', 'capses', 'caramels', 'carrer', 'casa', 'cinema', 'cistella', 'classe', 'cotxe', 'cotxes', 'cromos',
        'dilluns', 'dimarts', 'entrada', 'entrades', 'euros', 'futbol', 'galetes', 'gat', 'gelat', 'gelats', 'globus',
        'gos', 'gossos', 'llapis', 'llibre', 'llibres', 'llibreta', 'llibretes', 'matí', 'nenes', 'nens', 'ous',
        'pàgines', 'parada', 'parc', 'partida', 'pastís', 'pastissos', 'persones', 'pes', 'pila', 'piles', 'pisos',
        'plat', 'plats', 'pomes', 'preu', 'principi', 'punts', 'quilo', 'quilos', 'rodes', 'tarda', 'taula', 'taules',
        'torre', 'total', 'tren', 'vagó', 'vegades',
    ];
    // Verbs (present)
    // prettier-ignore
    var verbs = [
        'arriben', 'baixen', 'calen', 'compra', 'comprar', 'costa', 'costen', 'és', 'entren', 'fa', 'fer', 'gasta',
        'guanya', 'ha', 'juga', 'llegeix', 'menja', 'omple', 'paga', 'perd', 'pesa', 'posa', 'posen', 'pot', 'pugen',
        'rep', 'reparteix', 'seuen', 'són', 'té', 'tenen',
    ];
    // Adjectius i quantitats
    // prettier-ignore
    var adjectius = [
        'blaus', 'car', 'grans', 'iguals', 'mateix', 'mateixes', 'mateixos', 'petits', 'primer', 'segon', 'seus',
        'última', 'verdes', 'vermelles', 'vermells', 'junts', 'totes',
    ];
    // Paraules gramaticals i d'enllaç
    // prettier-ignore
    var altres = [
        'a', 'abans', 'al', 'aquest', 'ara', 'cada', 'd’', 'de', 'del', 'després', 'el', 'els', 'en', 'entre', 'es',
        'hi', 'i', 'l’', 'la', 'les', 'menys', 'més', 'per', 'quantes', 'quants', 'que', 'també', 'un', 'una', 'unes',
        'uns',
    ];
    return noms.concat(verbs, adjectius, altres);
});
