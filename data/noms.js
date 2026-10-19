/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: data/noms.js
 * ROL: Els noms que poden sortir als problemes (cap altre nom propi).
 *      genere: 'f' o 'm' (per a l'article: la Laia, en Pau; davant de vocal, l’Arnau).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.ESQUEMES_NOMS = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    // prettier-ignore
    return [
        { nom: 'Laia', genere: 'f' }, { nom: 'Pau', genere: 'm' }, { nom: 'Nora', genere: 'f' },
        { nom: 'Iu', genere: 'm' }, { nom: 'Martí', genere: 'm' }, { nom: 'Aina', genere: 'f' },
        { nom: 'Arnau', genere: 'm' }, { nom: 'Júlia', genere: 'f' }, { nom: 'Biel', genere: 'm' },
        { nom: 'Clara', genere: 'f' }, { nom: 'Pol', genere: 'm' }, { nom: 'Ona', genere: 'f' },
        { nom: 'Joel', genere: 'm' }, { nom: 'Fàtima', genere: 'f' }, { nom: 'Omar', genere: 'm' },
        { nom: 'Sara', genere: 'f' },
    ];
});
