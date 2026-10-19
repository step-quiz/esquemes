/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/motor/lectura.js
 * ROL: Les normes de lectura fàcil dels enunciats (especificació §11.6) i la
 *      detecció de les «paraules trampa» (una paraula clau que fa pensar en
 *      una operació diferent de la que cal).
 * ARQUITECTURA: Pur, sense DOM. El fan servir els tests (tests/plantilles.test.js)
 *      sobre cada plantilla. Normes:
 *        - com a molt 15 paraules per frase (tots els nivells);
 *        - N1–N2: com a molt 3 frases i cap paraula de subordinada (LLIGAMS);
 *        - present i sense passiva (formes prohibides de TEMPS i PASSIVA);
 *        - sense doble negació; nombres amb xifres (cap nombre en lletres);
 *        - cap nom propi fora dels de la llista (a les plantilles, cap majúscula
 *          a mig de frase que no sigui una marca {Nom});
 *        - totes les paraules, al lèxic controlat (data/lexic.js).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Lectura = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var MAX_PARAULES = 15,
        MAX_FRASES_N12 = 3;
    // Paraules que obren una subordinada (configurable)
    var LLIGAMS = ['que', 'perquè', 'si', 'quan', 'mentre', 'on', 'com', 'encara', 'malgrat', 'doncs', 'ja'];
    var NOMBRES_LLETRA = [
        'dos',
        'dues',
        'tres',
        'quatre',
        'cinc',
        'sis',
        'set',
        'vuit',
        'nou',
        'deu',
        'onze',
        'dotze',
        'tretze',
        'catorze',
        'quinze',
        'setze',
        'disset',
        'divuit',
        'dinou',
        'vint',
        'trenta',
        'quaranta',
        'cinquanta',
        'cent',
        'mil',
        'doble',
        'triple',
        'meitat',
        'terç',
        'quart',
    ];
    var TEMPS =
        /\b(tenia|tenies|tenien|teníem|era|eren|havia|havien|estava|estaven|feia|feien|anava|anaven|tindrà|tindran|serà|seran|tindria|seria)\b|\b(vaig|vas|va|vam|vau|van)\s+[a-zàèéíïòóúüç·]+(ar|er|ir|re)\b/i;
    var PASSIVA =
        /\b(és|són|ha estat|han estat|va ser|van ser)\s+[a-zàèéíïòóúüç·]+(at|ats|ada|ades|it|its|ida|ides|ut|uts|uda|udes)\b/i;
    var NEGACIO = /\bno\b[^.?!]*\b(cap|res|ningú|mai|tampoc|gens)\b/i;

    var LLETRA = 'a-zàèéíïòóúüç·A-ZÀÈÉÍÏÒÓÚÜÇ';
    var RE_PARAULA = new RegExp('[' + LLETRA + ']+’|[' + LLETRA + ']+|\\d+', 'g');

    /** Separa en frases (acaben en . ? o !). */
    function frases(text) {
        return String(text)
            .split(/(?<=[.?!])\s+/)
            .map(function (f) {
                return f.trim();
            })
            .filter(Boolean);
    }
    /** Les paraules d'un text: «l’Arnau» → «l’», «Arnau». Els apòstrofs rectes es tracten com a tipogràfics. */
    function paraules(text) {
        return String(text).replace(/'/g, '’').match(RE_PARAULA) || [];
    }
    /** Les paraules que compten per a la llargada (un article apostrofat no és una paraula a part). */
    function compta(frase) {
        return paraules(frase).filter(function (p) {
            return !/’$/.test(p);
        }).length;
    }

    /**
     * Revisa un text ja escrit (noms i nombres posats).
     * @param {string} text
     * @param {number} nivell
     * @param {Set<string>} lexic  paraules permeses, en minúscula (si no es passa, no es mira)
     * @param {Set<string>} propis noms propis permesos
     * @returns {Array<{ regla, detall }>}
     */
    function revisa(text, nivell, lexic, propis) {
        var errors = [];
        var fr = frases(text);
        if (nivell <= 2 && fr.length > MAX_FRASES_N12)
            errors.push({ regla: 'frases', detall: fr.length + ' frases (màxim ' + MAX_FRASES_N12 + ')' });
        fr.forEach(function (f) {
            var n = compta(f);
            if (n > MAX_PARAULES) errors.push({ regla: 'llarga', detall: n + ' paraules: «' + f + '»' });
            if (TEMPS.test(f)) errors.push({ regla: 'temps', detall: '«' + f + '»' });
            if (PASSIVA.test(f)) errors.push({ regla: 'passiva', detall: '«' + f + '»' });
            if (NEGACIO.test(f) || (f.match(/\bno\b/gi) || []).length > 1)
                errors.push({ regla: 'negacio', detall: '«' + f + '»' });
        });
        paraules(text).forEach(function (p) {
            var b = p.toLowerCase();
            if (/^\d+$/.test(b)) return;
            if (NOMBRES_LLETRA.indexOf(b) >= 0) errors.push({ regla: 'xifres', detall: p });
            if (nivell <= 2 && LLIGAMS.indexOf(b) >= 0) errors.push({ regla: 'subordinada', detall: p });
            if (propis && propis.has(p)) return;
            if (lexic && !lexic.has(b)) errors.push({ regla: 'lexic', detall: p });
        });
        return errors;
    }

    /** A la plantilla (amb marques), cap majúscula a mig de frase: els noms només poden venir de {Nom}. */
    function majusculesAMig(textPlantilla) {
        var sense = textPlantilla.replace(/\{(Nom2?|nom2?|de_nom2?)\}/g, 'X');
        var out = [];
        frases(sense).forEach(function (f) {
            paraules(f)
                .slice(1)
                .forEach(function (p) {
                    if (p !== 'X' && /^[A-ZÀÈÉÍÒÓÚÇ]/.test(p)) out.push(p);
                });
        });
        return out;
    }

    /**
     * Les paraules clau del text que fan pensar en una operació diferent de la que cal.
     * @param {string} text    el text pla
     * @param {string} op      l'operació correcta ('+', '−', '·', ':')
     * @param {Array<{ paraula, op }>} taula
     */
    function trampes(text, op, taula) {
        var t =
            ' ' +
            String(text)
                .toLowerCase()
                .replace(/[.,?!:;«»]/g, ' ')
                .replace(/\s+/g, ' ') +
            ' ';
        return taula.filter(function (k) {
            return k.op !== op && t.indexOf(' ' + k.paraula + ' ') >= 0;
        });
    }

    return {
        MAX_PARAULES: MAX_PARAULES,
        MAX_FRASES_N12: MAX_FRASES_N12,
        LLIGAMS: LLIGAMS,
        frases: frases,
        paraules: paraules,
        compta: compta,
        revisa: revisa,
        majusculesAMig: majusculesAMig,
        trampes: trampes,
    };
});
