/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/motor/generador.js
 * ROL: Fa problemes concrets a partir de les plantilles (data/plantilles.js):
 *      tria els noms i els nombres amb l'atzar amb llavor, comprova les
 *      condicions i escriu el text amb els nombres com a fitxes.
 * ARQUITECTURA: Pur, sense DOM. Dues dades de cada esquema són lliures (a i b
 *      de l'equació a op b = c) i la tercera en surt. Tots els nombres són
 *      enters ≥ 2 (així les unitats sempre van en plural) i com a molt el màxim
 *      del nivell (N1 20, N2 50, N3–N4 100; perfil dil: 20).
 *      Marques de les plantilles:
 *        [[rol]]  un nombre (fitxa)          {Nom} {nom} {de_nom}  el primer nom
 *        {Nom2} {nom2} {de_nom2}  el segon nom (sempre diferent del primer)
 * DEPENDÈNCIES: js/motor/esquemes.js (Node: require; navegador: window.Esquemes)
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var E = typeof module === 'object' && module.exports ? require('./esquemes.js') : arrel.Esquemes;
    var api = fabrica(E);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Generador = api;
})(typeof self !== 'undefined' ? self : this, function (E) {
    'use strict';

    var MAXIM = { 1: 20, 2: 50, 3: 100, 4: 100 };
    var FACTOR = { 1: 5, 2: 9, 3: 10, 4: 10 }; // factor màxim de les multiplicacions
    var MAXIM_DIL = 20;

    function maxim(nivell, perfil) {
        var m = MAXIM[nivell] || 100;
        return perfil === 'dil' ? Math.min(m, MAXIM_DIL) : m;
    }

    // ── Condicions: «a < b», «total <= 20», «part2 > part1» ───────────────
    function compleix(cond, v) {
        var m = /^\s*(\w+)\s*(<=|>=|<|>|==|!=)\s*(\w+)\s*$/.exec(cond);
        if (!m) throw new Error('condició no entesa: ' + cond);
        var x = /^\d+$/.test(m[1]) ? +m[1] : v[m[1]],
            y = /^\d+$/.test(m[3]) ? +m[3] : v[m[3]];
        if (x === undefined || y === undefined) throw new Error('condició amb un rol desconegut: ' + cond);
        return { '<': x < y, '<=': x <= y, '>': x > y, '>=': x >= y, '==': x === y, '!=': x !== y }[m[2]];
    }

    /**
     * Els nombres d'una plantilla: { rol: valor } (o null si no se'n troben en 1.000 intents).
     * @param {object} p      la plantilla
     * @param {object} atzar  de js/motor/atzar.js
     * @param {string} perfil '' o 'dil'
     */
    function valors(p, atzar, perfil) {
        var max = maxim(p.nivell, perfil),
            f = FACTOR[p.nivell] || 10;
        var eq = E.ESQUEMES[p.esquema].equacio(p.signe);
        var rangs = p.rangs || {};
        var rang = function (rol, lo, hi) {
            var r = rangs[rol];
            return r ? [Math.max(lo, r[0]), Math.min(hi, r[1])] : [lo, hi];
        };
        for (var intent = 0; intent < 1000; intent++) {
            var ra, rb;
            if (eq.op === '+') {
                ra = rang(eq.a, 2, max - 2);
                rb = rang(eq.b, 2, max - 2);
            } else if (eq.op === '−') {
                ra = rang(eq.a, 4, max);
                rb = rang(eq.b, 2, max - 2);
            } else {
                ra = rang(eq.a, 2, Math.min(f, Math.floor(max / 2)));
                rb = rang(eq.b, 2, Math.min(f, Math.floor(max / 2)));
            }
            if (ra[0] > ra[1] || rb[0] > rb[1]) return null;
            var v = {};
            v[eq.a] = atzar.enter(ra[0], ra[1]);
            v[eq.b] = atzar.enter(rb[0], rb[1]);
            v[eq.c] = E.calcula(v[eq.a], eq.op, v[eq.b]);
            var ok = [eq.a, eq.b, eq.c].every(function (r) {
                return Number.isInteger(v[r]) && v[r] >= 2 && v[r] <= max;
            });
            if (ok && rangs[eq.c]) ok = v[eq.c] >= rangs[eq.c][0] && v[eq.c] <= rangs[eq.c][1];
            if (ok && p.restriccions)
                ok = p.restriccions.every(function (c) {
                    return compleix(c, v);
                });
            if (ok) return v;
        }
        return null;
    }

    // ── Noms ────────────────────────────────────────────────────────────────
    var VOCAL = /^[AEIOUÀÈÉÍÏÒÓÚÜH]/i;
    function article(n) {
        return VOCAL.test(n.nom) ? 'l’' : n.genere === 'f' ? 'la ' : 'en ';
    }
    function formes(n) {
        var a = article(n);
        var nom = a + n.nom;
        var de = a === 'en ' ? 'd’en ' + n.nom : 'de ' + nom;
        return { nom: nom, Nom: nom.charAt(0).toUpperCase() + nom.slice(1), de_nom: de };
    }

    /**
     * Escriu un text de plantilla.
     * @returns {Array<{ t: 'text', v } | { t: 'xip', rol, v }>}
     */
    function escriu(text, v, noms) {
        var f1 = formes(noms[0]),
            f2 = formes(noms[1] || noms[0]);
        var subst = {
            '{Nom}': f1.Nom,
            '{nom}': f1.nom,
            '{de_nom}': f1.de_nom,
            '{Nom2}': f2.Nom,
            '{nom2}': f2.nom,
            '{de_nom2}': f2.de_nom,
        };
        var s = text.replace(/\{(Nom2?|nom2?|de_nom2?)\}/g, function (m) {
            return subst[m];
        });
        var out = [],
            re = /\[\[(\w+)\]\]/g,
            ultim = 0,
            m;
        while ((m = re.exec(s))) {
            if (m.index > ultim) out.push({ t: 'text', v: s.slice(ultim, m.index) });
            if (!(m[1] in v)) throw new Error('rol sense valor: ' + m[1]);
            out.push({ t: 'xip', rol: m[1], v: v[m[1]] });
            ultim = re.lastIndex;
        }
        if (ultim < s.length) out.push({ t: 'text', v: s.slice(ultim) });
        return out;
    }
    var plana = function (seg) {
        return seg
            .map(function (s) {
                return String(s.v);
            })
            .join('');
    };

    /**
     * Un problema concret.
     * @returns {{ plantilla, valors, noms, text: segments, frase: segments, resposta, solucio: { op, x, y } }}
     */
    function problema(p, atzar, o) {
        o = o || {};
        var v = valors(p, atzar, o.perfil);
        if (!v) return null;
        var noms = atzar.barreja(o.noms).slice(0, 2);
        var sol = E.solucio(p.esquema, p.signe, p.incognita);
        return {
            plantilla: p,
            valors: v,
            noms: noms,
            text: escriu(p.text, v, noms),
            frase: escriu(p.frase, v, noms),
            resposta: v[p.incognita],
            solucio: { op: sol.op, x: v[sol.x], y: v[sol.y] },
        };
    }

    /**
     * Una sèrie de n problemes sense repetits. Els esquemes van per torns (en un ordre a l'atzar), així
     * un esquema amb més plantilles no surt més vegades; dins de cada esquema, plantilles diferents
     * mentre n'hi hagi.
     * @param {object[]} plantilles  ja filtrades (esquemes i nivell)
     * @param {object}   o           { n, llavor, perfil, noms, Atzar }
     */
    function serie(plantilles, o) {
        var at = o.Atzar.crea(o.llavor);
        var vistos = {},
            out = [],
            bosses = {},
            torn = [];
        var esquemes = [];
        plantilles.forEach(function (p) {
            if (esquemes.indexOf(p.esquema) < 0) esquemes.push(p.esquema);
        });
        for (var intent = 0; out.length < o.n && intent < o.n * 50; intent++) {
            if (!torn.length) torn = at.barreja(esquemes);
            var e = torn.pop();
            if (!bosses[e] || !bosses[e].length)
                bosses[e] = at.barreja(
                    plantilles.filter(function (p) {
                        return p.esquema === e;
                    })
                );
            var p = bosses[e].pop();
            var pr = problema(p, at, { perfil: o.perfil, noms: o.noms });
            if (!pr) continue;
            var clau = p.id + '|' + JSON.stringify(pr.valors);
            if (vistos[clau]) continue;
            vistos[clau] = true;
            out.push(pr);
        }
        return out;
    }

    return {
        MAXIM: MAXIM,
        FACTOR: FACTOR,
        MAXIM_DIL: MAXIM_DIL,
        maxim: maxim,
        compleix: compleix,
        valors: valors,
        formes: formes,
        escriu: escriu,
        plana: plana,
        problema: problema,
        serie: serie,
    };
});
