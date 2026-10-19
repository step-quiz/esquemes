/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: data/paraules-clau.js
 * ROL: Les «paraules clau» i l'operació que fan pensar a qui busca paraules en
 *      lloc d'entendre el problema. Una plantilla té trampaParaulaClau: true si
 *      i només si el seu text en conté alguna amb una operació diferent de la
 *      que cal (tests/plantilles.test.js ho comprova).
 * ARQUITECTURA: Dades. Les paraules poden tenir més d'un mot («en total»).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.ESQUEMES_PARAULES_CLAU = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    // prettier-ignore
    return [
        { paraula: 'guanya', op: '+' }, { paraula: 'rep', op: '+' }, { paraula: 'pugen', op: '+' },
        { paraula: 'entren', op: '+' }, { paraula: 'arriben', op: '+' }, { paraula: 'més', op: '+' },
        { paraula: 'junts', op: '+' }, { paraula: 'en total', op: '+' }, { paraula: 'també', op: '+' },
        { paraula: 'perd', op: '−' }, { paraula: 'gasta', op: '−' }, { paraula: 'baixen', op: '−' },
        { paraula: 'menys', op: '−' }, { paraula: 'es menja', op: '−' }, { paraula: 'queden', op: '−' },
        { paraula: 'vegades', op: '·' }, { paraula: 'cada', op: '·' },
        { paraula: 'reparteix', op: ':' }, { paraula: 'entre', op: ':' },
    ];
});
