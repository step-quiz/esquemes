/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: tests/plantilles.test.js
 * ROL: Validació de les plantilles (especificació §11.7):
 *   - forma: esquema, nivell, rols vàlids, incògnita, marques del text i de la frase;
 *   - 200 problemes per plantilla: l'equació es compleix (recalculada aquí, sense
 *     el motor), la resposta és un enter ≥ 2, les condicions i el màxim del nivell;
 *   - sèries sense repetits;
 *   - lectura fàcil (js/motor/lectura.js) i lèxic controlat (data/lexic.js);
 *   - trampaParaulaClau és true si i només si hi ha una paraula trampa;
 *   - com a mínim 6 plantilles per esquema i nivell (N1–N3) i alguna de N4.
 * ÚS: node tests/plantilles.test.js
 * ============================================================================
 */
'use strict';
const { suite, ok, eq, finish } = require('./harness');
const PL = require('../data/plantilles.js');
const NOMS = require('../data/noms.js');
const CLAU = require('../data/paraules-clau.js');
const PICTOS = require('../data/pictos.js');
const LEXIC = require('../data/lexic.js');
const E = require('../js/motor/esquemes.js');
const G = require('../js/motor/generador.js');
const L = require('../js/motor/lectura.js');
const Atzar = require('../js/motor/atzar.js');

// L'equació de cada esquema, escrita aquí de nou (independent del motor)
const EQUACIO = {
    canvi: (v, p) => (p.signe === '-' ? v.inici - v.canvi === v.final : v.inici + v.canvi === v.final),
    combinacio: v => v.part1 + v.part2 === v.total,
    comparacio: v => v.petit + v.diferencia === v.gran,
    grups: v => v.grups * v.mida === v.total,
    vegades: v => v.petit * v.k === v.gran,
    proporcio: v => v.unitat * v.quantitat === v.total,
};
// L'operació que cal per trobar la incògnita, també escrita a mà
const OPERACIO = {
    canvi: { final: s => (s === '-' ? '−' : '+'), canvi: () => '−', inici: s => (s === '-' ? '+' : '−') },
    combinacio: { total: () => '+', part1: () => '−', part2: () => '−' },
    comparacio: { diferencia: () => '−', gran: () => '+', petit: () => '−' },
    grups: { total: () => '·', mida: () => ':', grups: () => ':' },
    vegades: { gran: () => '·', k: () => ':', petit: () => ':' },
    proporcio: { total: () => '·', unitat: () => ':', quantitat: () => ':' },
};
const MAXIM = { 1: 20, 2: 50, 3: 100, 4: 100 };
const lexic = new Set(LEXIC.map(p => p.toLowerCase()));
const propis = new Set(NOMS.map(n => n.nom));

suite('1. Forma de les plantilles');
{
    const mal = [],
        ids = new Set();
    for (const p of PL) {
        const err = m => mal.push(`${p.id}: ${m}`);
        if (ids.has(p.id)) err('id repetit');
        ids.add(p.id);
        if (!E.ESQUEMES[p.esquema]) err('esquema desconegut');
        if (![1, 2, 3, 4].includes(p.nivell)) err('nivell');
        if (p.id !== `${p.esquema}-${p.nivell}-${p.id.split('-').pop()}`) err('l’id no diu l’esquema i el nivell');
        const rols = E.ESQUEMES[p.esquema] ? E.ESQUEMES[p.esquema].rols : [];
        if (!rols.includes(p.incognita)) err(`incògnita ${p.incognita} no és un rol`);
        const marques = [...p.text.matchAll(/\[\[(\w+)\]\]/g)].map(m => m[1]);
        marques.forEach(r => {
            if (!rols.includes(r)) err(`[[${r}]] no és un rol de ${p.esquema}`);
        });
        const esperades = rols
            .filter(r => r !== p.incognita)
            .sort()
            .join();
        if ([...new Set(marques)].sort().join() !== esperades) err(`el text ha de tenir [[${esperades}]] i prou`);
        if (marques.length !== new Set(marques).size) err('un rol surt dues vegades');
        if ((p.frase.match(/___/g) || []).length !== 1) err('la frase ha de tenir un «___»');
        if (/\[\[/.test(p.frase)) err('la frase no pot tenir fitxes');
        if (p.esquema === 'canvi' && !['+', '-'].includes(p.signe)) err('Canvi necessita signe');
        if (p.esquema !== 'canvi' && p.signe) err('només Canvi té signe');
        if (p.esquema === 'proporcio' && !(Array.isArray(p.taula) && p.taula.length === 2))
            err('Proporció necessita taula');
        (p.pictos || []).forEach(id => {
            if (!PICTOS[id]) err(`pictograma ${id} desconegut`);
        });
        if (typeof p.trampaParaulaClau !== 'boolean') err('trampaParaulaClau ha de ser true o false');
        const maj = L.majusculesAMig(p.text + ' ' + p.frase);
        if (maj.length) err(`noms propis fora de la llista: ${maj.join(', ')}`);
    }
    ok(`${PL.length} plantilles amb la forma correcta`, !mal.length, mal.join(' · '));
}

suite('2. Quantes n’hi ha');
{
    for (const e of E.IDS) {
        for (const n of [1, 2, 3]) {
            const k = PL.filter(p => p.esquema === e && p.nivell === n).length;
            ok(`${e} N${n}: ${k} plantilles (6 o més)`, k >= 6);
        }
        const k4 = PL.filter(p => p.esquema === e && p.nivell === 4).length;
        ok(`${e} N4: ${k4} plantilles (alguna)`, k4 >= 1);
    }
}

suite('3. 200 problemes per plantilla');
{
    const mal = [];
    let n = 0;
    for (const p of PL) {
        for (const perfil of ['', 'dil']) {
            const at = Atzar.crea(p.id + perfil);
            for (let i = 0; i < 200; i++) {
                const pr = G.problema(p, at, { perfil, noms: NOMS });
                if (!pr) {
                    mal.push(`${p.id}${perfil ? ' (dil)' : ''}: no es pot generar`);
                    break;
                }
                n++;
                const v = pr.valors,
                    max = perfil === 'dil' ? 20 : MAXIM[p.nivell];
                const err = m => mal.push(`${p.id}: ${m} ${JSON.stringify(v)}`);
                if (!EQUACIO[p.esquema](v, p)) err('l’equació no es compleix');
                if (Object.values(v).some(x => !Number.isInteger(x) || x < 2 || x > max))
                    err(`un nombre fora de [2, ${max}]`);
                (p.restriccions || []).forEach(c => {
                    const [a, op, b] = c.split(/\s+/);
                    const x = v[a] ?? +a,
                        y = v[b] ?? +b;
                    const okc = { '<': x < y, '<=': x <= y, '>': x > y, '>=': x >= y }[op];
                    if (!okc) err(`no compleix ${c}`);
                });
                if (pr.resposta !== v[p.incognita]) err('la resposta no és la incògnita');
                // La solució del motor ha de fer servir l'operació esperada i donar la resposta
                const opEsp = OPERACIO[p.esquema][p.incognita](p.signe);
                if (pr.solucio.op !== opEsp) err(`operació ${pr.solucio.op} (esperada ${opEsp})`);
                if (E.calcula(pr.solucio.x, pr.solucio.op, pr.solucio.y) !== pr.resposta)
                    err('la solució no dona la resposta');
                if (pr.noms[0].nom === pr.noms[1].nom) err('dos noms iguals');
                if (/\{|\}|\[\[/.test(G.plana(pr.text) + G.plana(pr.frase))) err('marques sense substituir');
            }
        }
    }
    ok(
        `${n} problemes: equació, enters ≥ 2, màxims, condicions, operació i resposta`,
        !mal.length,
        mal.slice(0, 6).join(' · ')
    );
}

suite('4. Sèries sense repetits');
{
    const mal = [];
    for (const e of E.IDS)
        for (const n of [1, 2, 3, 4])
            for (const llavor of ['A', 'B', 'C', 'x1', 'x2']) {
                const pl = PL.filter(p => p.esquema === e && p.nivell === n);
                const s = G.serie(pl, { n: 10, llavor, noms: NOMS, Atzar });
                const claus = s.map(pr => pr.plantilla.id + JSON.stringify(pr.valors));
                if (s.length !== 10) mal.push(`${e} N${n} ${llavor}: ${s.length} problemes`);
                if (new Set(claus).size !== claus.length) mal.push(`${e} N${n} ${llavor}: repetits`);
            }
    ok('sèries de 10 per a cada esquema, nivell i llavor, sense repetits', !mal.length, mal.join(' · '));
    const a = G.serie(
        PL.filter(p => p.nivell === 1),
        { n: 10, llavor: 'A', noms: NOMS, Atzar }
    );
    const b = G.serie(
        PL.filter(p => p.nivell === 1),
        { n: 10, llavor: 'A', noms: NOMS, Atzar }
    );
    eq('la mateixa llavor dona la mateixa sèrie (sessió fixa)', JSON.stringify(a), JSON.stringify(b));
    const tots = G.serie(
        PL.filter(p => p.nivell === 2),
        { n: 12, llavor: 'z', noms: NOMS, Atzar }
    );
    const compte = {};
    tots.forEach(pr => (compte[pr.plantilla.esquema] = (compte[pr.plantilla.esquema] || 0) + 1));
    ok(
        'amb els sis esquemes, 12 problemes: 2 de cada',
        E.IDS.every(e => compte[e] === 2),
        JSON.stringify(compte)
    );
}

suite('5. Lectura fàcil i lèxic');
{
    const mal = [];
    for (const p of PL) {
        // Amb diversos noms (també els que s'apostrofen) i nombres de debò
        for (const noms of [
            [NOMS[0], NOMS[1]],
            [NOMS[6], NOMS[3]],
            [NOMS[14], NOMS[13]],
        ]) {
            const pr = G.problema(p, Atzar.crea(p.id), { noms });
            const text = G.plana(G.escriu(p.text, pr.valors, noms));
            const frase = G.plana(G.escriu(p.frase, pr.valors, noms)).replace('___', '7');
            L.revisa(text, p.nivell, lexic, propis).forEach(e => mal.push(`${p.id}: ${e.regla} ${e.detall}`));
            L.revisa(frase, 1, lexic, propis).forEach(e => mal.push(`${p.id} (frase): ${e.regla} ${e.detall}`));
        }
    }
    const unics = [...new Set(mal)];
    ok(
        'cap problema trenca les normes de lectura fàcil ni surt del lèxic',
        !unics.length,
        unics.slice(0, 12).join(' · ')
    );
}

suite('6. Paraules trampa');
{
    const mal = [];
    for (const p of PL) {
        const pr = G.problema(p, Atzar.crea(p.id), { noms: NOMS });
        const op = OPERACIO[p.esquema][p.incognita](p.signe);
        const t = L.trampes(G.plana(pr.text), op, CLAU);
        if (t.length > 0 !== p.trampaParaulaClau)
            mal.push(
                `${p.id}: trampaParaulaClau ${p.trampaParaulaClau}, però ${t.length ? '«' + t.map(k => k.paraula).join('», «') + '»' : 'no n’hi ha cap'}`
            );
        if (p.nivell === 4 && !p.trampaParaulaClau) mal.push(`${p.id}: a N4 sempre hi ha d’haver trampa`);
    }
    ok('trampaParaulaClau quadra amb el text, i a N4 sempre hi és', !mal.length, mal.join(' · '));
}

suite('7. Normes de lectura (casos fets a mà)');
{
    const R = (t, n = 1) => L.revisa(t, n).map(e => e.regla);
    ok('frase de 16 paraules', R('a b c d e f g h i j k l m n o p.').includes('llarga'));
    ok('4 frases a N1', R('A. B. C. D.').includes('frases'));
    ok('4 frases a N3 sí', !R('A. B. C. D.', 3).includes('frases'));
    ok('«que» a N1', R('Té més cromos que en Pau.').includes('subordinada'));
    ok('«que» a N3 sí', !R('Té més cromos que en Pau.', 3).includes('subordinada'));
    ok('passat', R('La Laia tenia 5 cromos.').includes('temps'));
    ok('passat perifràstic', R('La Laia va comprar 5 cromos.').includes('temps'));
    ok('passiva', R('Els cromos són repartits.').includes('passiva'));
    ok('nombre en lletres', R('Té tres cromos.').includes('xifres'));
    ok('doble negació', R('No té cap cromo.').includes('negacio'));
    eq('noms propis a la plantilla', L.majusculesAMig('{Nom} té 5 cromos de Barcelona.').join(), 'Barcelona');
    eq('l’article apostrofat no compta', L.compta('L’Arnau té 5 cromos d’en Pau.'), 6);
}

finish('PLANTILLES');
