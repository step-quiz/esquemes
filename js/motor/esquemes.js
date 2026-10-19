/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/motor/esquemes.js
 * ROL: Els sis esquemes de problemes: quins papers (rols) hi ha, quina equació
 *      els lliga, quina operació cal per trobar cada incògnita i com es diuen.
 * ARQUITECTURA: Pur, sense DOM. Totes les equacions tenen la forma
 *          A op B = C        amb op ∈ { '+', '−', '·' }
 *      (rols: a, b, c). L'operació per trobar la incògnita surt de la seva
 *      posició: el resultat C → l'operació de l'equació; una part d'una suma →
 *      resta; un factor → divisió; a A − B = C, A → suma i B → resta.
 *      Les comprovacions dels tests recalculen l'equació pel seu compte.
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Esquemes = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // a op b = c
    var ESQUEMES = {
        canvi: {
            nom: 'Canvi',
            icona: '🔄',
            pregunta: 'Canvia alguna quantitat amb el temps?',
            rols: ['inici', 'canvi', 'final'],
            // l'operació depèn del signe de la plantilla: + (guanya) o − (perd)
            equacio: function (signe) {
                return { a: 'inici', op: signe === '-' ? '−' : '+', b: 'canvi', c: 'final' };
            },
            etiquetes: { inici: 'Al principi', canvi: 'Canvi', final: 'Al final' },
        },
        combinacio: {
            nom: 'Combinació',
            icona: '🧩',
            pregunta: 'S’ajunten dos grups en un total?',
            rols: ['part1', 'part2', 'total'],
            equacio: function () {
                return { a: 'part1', op: '+', b: 'part2', c: 'total' };
            },
            etiquetes: { part1: 'Una part', part2: 'L’altra part', total: 'Total' },
            intercanviables: ['part1', 'part2'],
        },
        comparacio: {
            nom: 'Comparació',
            icona: '⚖️',
            pregunta: 'Es compara qui en té més?',
            rols: ['petit', 'diferencia', 'gran'],
            equacio: function () {
                return { a: 'petit', op: '+', b: 'diferencia', c: 'gran' };
            },
            etiquetes: { gran: 'El gran', petit: 'El petit', diferencia: 'Diferència' },
        },
        grups: {
            nom: 'Grups iguals',
            icona: '📦',
            pregunta: 'Hi ha grups iguals?',
            rols: ['grups', 'mida', 'total'],
            equacio: function () {
                return { a: 'grups', op: '·', b: 'mida', c: 'total' };
            },
            etiquetes: { grups: 'Grups', mida: 'A cada grup', total: 'Total' },
        },
        vegades: {
            nom: 'Comparació de vegades',
            icona: '✖️',
            pregunta: 'Es compara quantes vegades més?',
            rols: ['petit', 'k', 'gran'],
            equacio: function () {
                return { a: 'petit', op: '·', b: 'k', c: 'gran' };
            },
            etiquetes: { petit: 'El petit', k: 'Vegades', gran: 'El gran' },
        },
        proporcio: {
            nom: 'Proporció',
            icona: '📊',
            pregunta: 'Saps quant val 1 i en tens uns quants?',
            rols: ['unitat', 'quantitat', 'total'],
            equacio: function () {
                return { a: 'unitat', op: '·', b: 'quantitat', c: 'total' };
            },
            etiquetes: { unitat: 'Per a 1', quantitat: 'Quantitat', total: 'Total' },
        },
    };
    var IDS = Object.keys(ESQUEMES);

    /** Aplica una operació a dos enters (null si no dona un enter). */
    function calcula(x, op, y) {
        if (op === '+') return x + y;
        if (op === '−') return x - y;
        if (op === '·') return x * y;
        if (op === ':') return y !== 0 && x % y === 0 ? x / y : null;
        return null;
    }

    /**
     * Com es troba la incògnita: { op, x, y } amb incògnita = x op y (rols, en ordre).
     * Exemples: ? + 5 = 17 → { op: '−', x: 'c', y: 'b' }.
     */
    function solucio(esquema, signe, incognita) {
        var e = ESQUEMES[esquema].equacio(signe);
        var pos = e.a === incognita ? 'a' : e.b === incognita ? 'b' : e.c === incognita ? 'c' : null;
        if (!pos) throw new Error('solucio: ' + incognita + ' no és un rol de ' + esquema);
        if (pos === 'c') return { op: e.op, x: e.a, y: e.b };
        if (e.op === '+') return { op: '−', x: e.c, y: pos === 'a' ? e.b : e.a };
        if (e.op === '·') return { op: ':', x: e.c, y: pos === 'a' ? e.b : e.a };
        // a − b = c
        return pos === 'a' ? { op: '+', x: e.c, y: e.b } : { op: '−', x: e.a, y: e.c };
    }

    /** La posició de la incògnita a l'equació: 'resultat', 'part' (de suma), 'factor', 'inici' o 'tret' (de resta). */
    function posicio(esquema, signe, incognita) {
        var e = ESQUEMES[esquema].equacio(signe);
        if (e.c === incognita) return 'resultat';
        if (e.op === '+') return 'part';
        if (e.op === '·') return 'factor';
        return e.a === incognita ? 'inici' : 'tret';
    }

    /** L'operació és commutativa? (aleshores l'ordre dels nombres no importa) */
    var commutativa = function (op) {
        return op === '+' || op === '·';
    };

    return {
        ESQUEMES: ESQUEMES,
        IDS: IDS,
        calcula: calcula,
        solucio: solucio,
        posicio: posicio,
        commutativa: commutativa,
    };
});
