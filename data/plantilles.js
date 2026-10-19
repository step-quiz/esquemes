/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: data/plantilles.js
 * ROL: Les plantilles dels problemes: 6 esquemes × nivells N1–N4.
 * ARQUITECTURA: Dades (window.ESQUEMES_PLANTILLES; també es carrega amb Node).
 *   Cada plantilla: { id, esquema, nivell, incognita, text, frase, pictos,
 *                     signe?, rangs?, restriccions?, taula?, trampaParaulaClau }
 *   - text: l'enunciat. [[rol]] és un nombre (fitxa); el rol de la incògnita no hi surt.
 *           {Nom} {nom} {de_nom} {Nom2} {nom2} {de_nom2}: els noms (data/noms.js).
 *   - frase: la resposta amb «___» al lloc del nombre.
 *   - signe (Canvi): '+' (guanya, arriben…) o '-' (perd, gasta…).
 *   - rangs: { rol: [mínim, màxim] } (si no, els del nivell: js/motor/generador.js).
 *   - restriccions: ['part2 > part1', …].
 *   - taula (Proporció): els noms de les dues files de la taula.
 *   - trampaParaulaClau: el text té una paraula clau (data/paraules-clau.js) que
 *     fa pensar en una altra operació. A N4 sempre és true.
 *   Nivells: N1 incògnita al resultat (≤ 20) · N2 incògnita al canvi o a una part
 *   (≤ 50) · N3 incògnita a l'inici (≤ 100) · N4 llenguatge enganyós (≤ 100).
 *   Lectura fàcil: tests/plantilles.test.js (js/motor/lectura.js + data/lexic.js).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.ESQUEMES_PLANTILLES = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    function P(id, esquema, nivell, incognita, trampa, text, frase, pictos, x) {
        var p = {
            id: id,
            esquema: esquema,
            nivell: nivell,
            incognita: incognita,
            text: text,
            frase: frase,
            pictos: pictos,
            trampaParaulaClau: trampa,
        };
        if (x)
            Object.keys(x).forEach(function (k) {
                p[k] = x[k];
            });
        return p;
    }
    var MES = { signe: '+' },
        MENYS = { signe: '-' };
    var RODES = { rangs: { mida: [4, 4] } };
    var T = function (a, b) {
        return { taula: [a, b] };
    };

    // prettier-ignore
    return [
        // ═════ CANVI ═══════════════════════════════════════════════════════
        // N1: incògnita al final
        P('canvi-1-01', 'canvi', 1, 'final', false, '{Nom} té [[inici]] cromos. Guanya [[canvi]] cromos. Quants cromos té ara?', 'Ara {nom} té ___ cromos.', ['cromo'], MES),
        P('canvi-1-02', 'canvi', 1, 'final', false, '{Nom} té [[inici]] llapis. Compra [[canvi]] llapis. Quants llapis té ara?', 'Ara {nom} té ___ llapis.', ['llapis'], MES),
        P('canvi-1-03', 'canvi', 1, 'final', false, '{Nom} té [[inici]] caramels. Es menja [[canvi]] caramels. Quants caramels té ara?', 'Ara {nom} té ___ caramels.', ['caramel'], MENYS),
        P('canvi-1-04', 'canvi', 1, 'final', false, '{Nom} té [[inici]] globus. Perd [[canvi]] globus. Quants globus té ara?', 'Ara {nom} té ___ globus.', ['globus'], MENYS),
        P('canvi-1-05', 'canvi', 1, 'final', false, 'A la classe hi ha [[inici]] alumnes. Entren [[canvi]] alumnes. Quants alumnes hi ha ara?', 'Ara hi ha ___ alumnes a la classe.', ['alumne'], MES),
        P('canvi-1-06', 'canvi', 1, 'final', false, 'Al bus hi ha [[inici]] persones. Baixen [[canvi]] persones. Quantes persones hi ha ara?', 'Ara hi ha ___ persones al bus.', ['bus', 'persona'], MENYS),
        P('canvi-1-07', 'canvi', 1, 'final', false, '{Nom} té [[inici]] euros. Rep [[canvi]] euros. Quants euros té ara?', 'Ara {nom} té ___ euros.', ['euro'], MES),
        // N2: incògnita al canvi
        P('canvi-2-01', 'canvi', 2, 'canvi', true, '{Nom} té [[inici]] cromos. Guanya uns cromos i ara té [[final]] cromos. Quants cromos guanya?', '{Nom} guanya ___ cromos.', ['cromo'], MES),
        P('canvi-2-02', 'canvi', 2, 'canvi', false, '{Nom} té [[inici]] caramels. Es menja uns caramels i ara té [[final]] caramels. Quants caramels es menja?', '{Nom} es menja ___ caramels.', ['caramel'], MENYS),
        P('canvi-2-03', 'canvi', 2, 'canvi', true, 'Al bus hi ha [[inici]] persones. Pugen unes persones i ara hi ha [[final]] persones. Quantes persones pugen?', 'Pugen ___ persones.', ['bus', 'persona'], MES),
        P('canvi-2-04', 'canvi', 2, 'canvi', false, '{Nom} té [[inici]] euros. Gasta uns euros i ara té [[final]] euros. Quants euros gasta?', '{Nom} gasta ___ euros.', ['euro'], MENYS),
        P('canvi-2-05', 'canvi', 2, 'canvi', true, 'A la biblioteca hi ha [[inici]] llibres. Arriben uns llibres i ara hi ha [[final]] llibres. Quants llibres arriben?', 'Arriben ___ llibres.', ['llibre'], MES),
        P('canvi-2-06', 'canvi', 2, 'canvi', false, '{Nom} té [[inici]] globus. Perd uns globus i ara té [[final]] globus. Quants globus perd?', '{Nom} perd ___ globus.', ['globus'], MENYS),
        // N3: incògnita a l'inici
        P('canvi-3-01', 'canvi', 3, 'inici', true, 'Al matí {nom} té uns cromos. A la tarda guanya [[canvi]] cromos. Ara té [[final]] cromos. Quants cromos té al matí?', 'Al matí {nom} té ___ cromos.', ['cromo'], MES),
        P('canvi-3-02', 'canvi', 3, 'inici', true, 'Al matí {nom} té uns euros. A la tarda gasta [[canvi]] euros. Ara té [[final]] euros. Quants euros té al matí?', 'Al matí {nom} té ___ euros.', ['euro'], MENYS),
        P('canvi-3-03', 'canvi', 3, 'inici', true, 'Al principi hi ha unes persones al bus. Pugen [[canvi]] persones. Ara hi ha [[final]] persones. Quantes persones hi ha al principi?', 'Al principi hi ha ___ persones al bus.', ['bus', 'persona'], MES),
        P('canvi-3-04', 'canvi', 3, 'inici', true, 'Al principi {nom} té uns caramels. Es menja [[canvi]] caramels. Ara té [[final]] caramels. Quants caramels té al principi?', 'Al principi {nom} té ___ caramels.', ['caramel'], MENYS),
        P('canvi-3-05', 'canvi', 3, 'inici', true, 'Al principi la biblioteca té uns llibres. Arriben [[canvi]] llibres. Ara té [[final]] llibres. Quants llibres té al principi?', 'Al principi la biblioteca té ___ llibres.', ['llibre'], MES),
        P('canvi-3-06', 'canvi', 3, 'inici', true, 'Al principi {nom} té uns globus. Perd [[canvi]] globus. Ara té [[final]] globus. Quants globus té al principi?', 'Al principi {nom} té ___ globus.', ['globus'], MENYS),
        // N4: llenguatge enganyós
        P('canvi-4-01', 'canvi', 4, 'inici', true, '{Nom} juga una partida i guanya [[canvi]] cromos. Després de la partida té [[final]] cromos. Quants cromos té abans de la partida?', 'Abans de la partida {nom} té ___ cromos.', ['cromo'], MES),
        P('canvi-4-02', 'canvi', 4, 'inici', true, 'Ara {nom} té [[final]] euros. Aquest matí gasta [[canvi]] euros en un llibre. Quants euros té abans de comprar el llibre?', 'Abans de comprar el llibre, {nom} té ___ euros.', ['euro', 'llibre'], MENYS),
        P('canvi-4-03', 'canvi', 4, 'inici', true, 'A l’última parada pugen [[canvi]] persones al bus. Ara hi ha [[final]] persones al bus. Quantes persones hi ha abans de la parada?', 'Abans de la parada hi ha ___ persones al bus.', ['bus', 'persona'], MES),

        // ═════ COMBINACIÓ ══════════════════════════════════════════════════
        P('combinacio-1-01', 'combinacio', 1, 'total', false, '{Nom} té [[part1]] cromos de futbol i [[part2]] cromos d’animals. Quants cromos té en total?', '{Nom} té ___ cromos en total.', ['cromo']),
        P('combinacio-1-02', 'combinacio', 1, 'total', false, 'A la classe hi ha [[part1]] nens i [[part2]] nenes. Quants alumnes hi ha a la classe?', 'A la classe hi ha ___ alumnes.', ['nen', 'nena', 'alumne']),
        P('combinacio-1-03', 'combinacio', 1, 'total', false, 'En una cistella hi ha [[part1]] pomes vermelles i [[part2]] pomes verdes. Quantes pomes hi ha?', 'Hi ha ___ pomes a la cistella.', ['poma']),
        P('combinacio-1-04', 'combinacio', 1, 'total', false, '{Nom} té [[part1]] llapis blaus. També té [[part2]] llapis vermells. Quants llapis té?', '{Nom} té ___ llapis.', ['llapis']),
        P('combinacio-1-05', 'combinacio', 1, 'total', false, 'Al parc hi ha [[part1]] gossos grans i [[part2]] gossos petits. Quants gossos hi ha al parc?', 'Al parc hi ha ___ gossos.', ['gos']),
        P('combinacio-1-06', 'combinacio', 1, 'total', false, '{Nom} llegeix [[part1]] pàgines el dilluns i [[part2]] pàgines el dimarts. Quantes pàgines llegeix?', '{Nom} llegeix ___ pàgines.', ['pagina']),
        P('combinacio-2-01', 'combinacio', 2, 'part2', false, '{Nom} té [[total]] cromos de futbol i d’animals. [[part1]] cromos són de futbol. Quants cromos són d’animals?', '___ cromos són d’animals.', ['cromo']),
        P('combinacio-2-02', 'combinacio', 2, 'part2', false, 'A la classe hi ha [[total]] alumnes. Hi ha [[part1]] nens. Quantes nenes hi ha?', 'Hi ha ___ nenes.', ['alumne', 'nen', 'nena']),
        P('combinacio-2-03', 'combinacio', 2, 'part2', false, 'En una cistella hi ha [[total]] pomes vermelles i verdes. Hi ha [[part1]] pomes vermelles. Quantes pomes verdes hi ha?', 'Hi ha ___ pomes verdes.', ['poma']),
        P('combinacio-2-04', 'combinacio', 2, 'part2', false, '{Nom} té [[total]] llapis blaus i vermells. Té [[part1]] llapis blaus. Quants llapis vermells té?', '{Nom} té ___ llapis vermells.', ['llapis']),
        P('combinacio-2-05', 'combinacio', 2, 'part2', false, 'Al parc hi ha [[total]] gossos grans i petits. Hi ha [[part1]] gossos grans. Quants gossos petits hi ha?', 'Hi ha ___ gossos petits.', ['gos']),
        P('combinacio-2-06', 'combinacio', 2, 'part2', false, '{Nom} llegeix [[total]] pàgines el dilluns i el dimarts. El dilluns llegeix [[part1]] pàgines. Quantes pàgines llegeix el dimarts?', 'El dimarts {nom} llegeix ___ pàgines.', ['pagina']),
        P('combinacio-3-01', 'combinacio', 3, 'part1', true, '{Nom} té uns cromos de futbol i [[part2]] cromos d’animals. En total té [[total]] cromos. Quants cromos de futbol té?', '{Nom} té ___ cromos de futbol.', ['cromo']),
        P('combinacio-3-02', 'combinacio', 3, 'part1', true, 'Al primer vagó d’un tren hi ha unes persones. Al segon vagó hi ha [[part2]] persones. En total hi ha [[total]] persones. Quantes persones hi ha al primer vagó?', 'Al primer vagó hi ha ___ persones.', ['tren', 'persona']),
        P('combinacio-3-03', 'combinacio', 3, 'part1', true, 'En una cistella hi ha unes pomes vermelles i [[part2]] pomes verdes. En total hi ha [[total]] pomes. Quantes pomes vermelles hi ha?', 'Hi ha ___ pomes vermelles.', ['poma']),
        P('combinacio-3-04', 'combinacio', 3, 'part1', true, '{Nom} té uns llapis blaus i [[part2]] llapis vermells. En total té [[total]] llapis. Quants llapis blaus té?', '{Nom} té ___ llapis blaus.', ['llapis']),
        P('combinacio-3-05', 'combinacio', 3, 'part1', true, 'Al parc hi ha uns gossos grans i [[part2]] gossos petits. En total hi ha [[total]] gossos. Quants gossos grans hi ha?', 'Hi ha ___ gossos grans.', ['gos']),
        P('combinacio-3-06', 'combinacio', 3, 'part1', true, '{Nom} llegeix unes pàgines el dilluns i [[part2]] pàgines el dimarts. En total llegeix [[total]] pàgines. Quantes pàgines llegeix el dilluns?', 'El dilluns {nom} llegeix ___ pàgines.', ['pagina']),
        P('combinacio-4-01', 'combinacio', 4, 'part2', true, 'Entre {nom} i {nom2} tenen [[total]] euros. {Nom} té [[part1]] euros. Quants euros té {nom2}?', '{Nom2} té ___ euros.', ['euro']),
        P('combinacio-4-02', 'combinacio', 4, 'part2', true, 'A la classe hi ha [[part1]] nens. Hi ha més nenes que nens. En total hi ha [[total]] alumnes. Quantes nenes hi ha?', 'Hi ha ___ nenes.', ['nen', 'nena', 'alumne'], { restriccions: ['part2 > part1'] }),
        P('combinacio-4-03', 'combinacio', 4, 'part1', true, '{Nom} i {nom2} posen junts els seus cromos. Junts tenen [[total]] cromos. {Nom2} té [[part2]] cromos. Quants cromos té {nom}?', '{Nom} té ___ cromos.', ['cromo']),

        // ═════ COMPARACIÓ ══════════════════════════════════════════════════
        P('comparacio-1-01', 'comparacio', 1, 'diferencia', true, '{Nom} té [[gran]] cromos. {Nom2} té [[petit]] cromos. Quants cromos més té {nom}?', '{Nom} té ___ cromos més.', ['cromo']),
        P('comparacio-1-02', 'comparacio', 1, 'diferencia', false, 'Un gos pesa [[gran]] quilos. Un gat pesa [[petit]] quilos. Quants quilos menys pesa el gat?', 'El gat pesa ___ quilos menys.', ['gos', 'gat', 'quilo']),
        P('comparacio-1-03', 'comparacio', 1, 'diferencia', true, '{Nom} té [[gran]] anys. {Nom2} té [[petit]] anys. Quants anys més té {nom}?', '{Nom} té ___ anys més.', ['any']),
        P('comparacio-1-04', 'comparacio', 1, 'diferencia', false, 'Una torre té [[gran]] pisos. Una casa té [[petit]] pisos. Quants pisos menys té la casa?', 'La casa té ___ pisos menys.', ['torre', 'casa', 'pis']),
        P('comparacio-1-05', 'comparacio', 1, 'diferencia', true, '{Nom} fa [[gran]] punts. {Nom2} fa [[petit]] punts. Quants punts més fa {nom}?', '{Nom} fa ___ punts més.', ['punt']),
        P('comparacio-1-06', 'comparacio', 1, 'diferencia', false, 'Un llibre costa [[gran]] euros. Una llibreta costa [[petit]] euros. Quants euros menys costa la llibreta?', 'La llibreta costa ___ euros menys.', ['llibre', 'llibreta', 'euro']),
        P('comparacio-2-01', 'comparacio', 2, 'gran', false, '{Nom2} té [[petit]] cromos. {Nom} té [[diferencia]] cromos més. Quants cromos té {nom}?', '{Nom} té ___ cromos.', ['cromo']),
        P('comparacio-2-02', 'comparacio', 2, 'gran', false, 'Un gat pesa [[petit]] quilos. Un gos pesa [[diferencia]] quilos més. Quants quilos pesa el gos?', 'El gos pesa ___ quilos.', ['gat', 'gos', 'quilo']),
        P('comparacio-2-03', 'comparacio', 2, 'gran', false, '{Nom2} té [[petit]] anys. {Nom} té [[diferencia]] anys més. Quants anys té {nom}?', '{Nom} té ___ anys.', ['any']),
        P('comparacio-2-04', 'comparacio', 2, 'gran', false, 'Una casa té [[petit]] pisos. Una torre té [[diferencia]] pisos més. Quants pisos té la torre?', 'La torre té ___ pisos.', ['casa', 'torre', 'pis']),
        P('comparacio-2-05', 'comparacio', 2, 'gran', false, '{Nom2} fa [[petit]] punts. {Nom} fa [[diferencia]] punts més. Quants punts fa {nom}?', '{Nom} fa ___ punts.', ['punt']),
        P('comparacio-2-06', 'comparacio', 2, 'gran', false, 'Una llibreta costa [[petit]] euros. Un llibre costa [[diferencia]] euros més. Quants euros costa el llibre?', 'El llibre costa ___ euros.', ['llibreta', 'llibre', 'euro']),
        P('comparacio-3-01', 'comparacio', 3, 'petit', false, '{Nom} té [[gran]] cromos. {Nom2} té [[diferencia]] cromos menys. Quants cromos té {nom2}?', '{Nom2} té ___ cromos.', ['cromo']),
        P('comparacio-3-02', 'comparacio', 3, 'petit', false, 'Un gos pesa [[gran]] quilos. Un gat pesa [[diferencia]] quilos menys. Quants quilos pesa el gat?', 'El gat pesa ___ quilos.', ['gos', 'gat', 'quilo']),
        P('comparacio-3-03', 'comparacio', 3, 'petit', false, '{Nom} té [[gran]] anys. {Nom2} té [[diferencia]] anys menys. Quants anys té {nom2}?', '{Nom2} té ___ anys.', ['any']),
        P('comparacio-3-04', 'comparacio', 3, 'petit', false, 'Una torre té [[gran]] pisos. Una casa té [[diferencia]] pisos menys. Quants pisos té la casa?', 'La casa té ___ pisos.', ['torre', 'casa', 'pis']),
        P('comparacio-3-05', 'comparacio', 3, 'petit', false, '{Nom} fa [[gran]] punts. {Nom2} fa [[diferencia]] punts menys. Quants punts fa {nom2}?', '{Nom2} fa ___ punts.', ['punt']),
        P('comparacio-3-06', 'comparacio', 3, 'petit', false, 'Un llibre costa [[gran]] euros. Una llibreta costa [[diferencia]] euros menys. Quants euros costa la llibreta?', 'La llibreta costa ___ euros.', ['llibre', 'llibreta', 'euro']),
        P('comparacio-4-01', 'comparacio', 4, 'petit', true, '{Nom} té [[gran]] cromos. Té [[diferencia]] cromos més que {nom2}. Quants cromos té {nom2}?', '{Nom2} té ___ cromos.', ['cromo']),
        P('comparacio-4-02', 'comparacio', 4, 'gran', true, '{Nom2} fa [[petit]] punts. Fa [[diferencia]] punts menys que {nom}. Quants punts fa {nom}?', '{Nom} fa ___ punts.', ['punt']),
        P('comparacio-4-03', 'comparacio', 4, 'petit', true, 'Un llibre costa [[gran]] euros. Costa [[diferencia]] euros més que una llibreta. Quants euros costa la llibreta?', 'La llibreta costa ___ euros.', ['llibre', 'llibreta', 'euro']),

        // ═════ GRUPS IGUALS ════════════════════════════════════════════════
        P('grups-1-01', 'grups', 1, 'total', false, 'Hi ha [[grups]] bosses. A cada bossa hi ha [[mida]] caramels. Quants caramels hi ha?', 'Hi ha ___ caramels.', ['bossa', 'caramel']),
        P('grups-1-02', 'grups', 1, 'total', false, '{Nom} compra [[grups]] capses. Cada capsa té [[mida]] llapis. Quants llapis compra?', '{Nom} compra ___ llapis.', ['capsa', 'llapis']),
        P('grups-1-03', 'grups', 1, 'total', false, 'A la classe hi ha [[grups]] taules. A cada taula seuen [[mida]] alumnes. Quants alumnes hi ha?', 'Hi ha ___ alumnes.', ['taula', 'alumne']),
        P('grups-1-04', 'grups', 1, 'total', false, 'Al carrer hi ha [[grups]] cotxes. Cada cotxe té [[mida]] rodes. Quantes rodes hi ha?', 'Hi ha ___ rodes.', ['cotxe'], RODES),
        P('grups-1-05', 'grups', 1, 'total', false, '{Nom} fa [[grups]] piles de llibres. Cada pila té [[mida]] llibres. Quants llibres hi ha?', 'Hi ha ___ llibres.', ['llibre']),
        P('grups-1-06', 'grups', 1, 'total', false, 'Hi ha [[grups]] plats. A cada plat hi ha [[mida]] galetes. Quantes galetes hi ha?', 'Hi ha ___ galetes.', ['plat', 'galeta']),
        P('grups-2-01', 'grups', 2, 'mida', true, '{Nom} reparteix [[total]] caramels en [[grups]] bosses. A cada bossa posa els mateixos caramels. Quants caramels posa a cada bossa?', 'A cada bossa posa ___ caramels.', ['caramel', 'bossa']),
        P('grups-2-02', 'grups', 2, 'mida', true, 'Hi ha [[total]] alumnes i [[grups]] taules. A cada taula seuen els mateixos alumnes. Quants alumnes seuen a cada taula?', 'A cada taula seuen ___ alumnes.', ['alumne', 'taula']),
        P('grups-2-03', 'grups', 2, 'mida', true, '{Nom} té [[total]] llapis i [[grups]] capses. Posa els mateixos llapis a cada capsa. Quants llapis posa a cada capsa?', 'A cada capsa posa ___ llapis.', ['llapis', 'capsa']),
        P('grups-2-04', 'grups', 2, 'mida', true, 'Hi ha [[total]] galetes i [[grups]] plats. A cada plat hi ha les mateixes galetes. Quantes galetes hi ha a cada plat?', 'A cada plat hi ha ___ galetes.', ['galeta', 'plat']),
        P('grups-2-05', 'grups', 2, 'mida', true, '{Nom} reparteix [[total]] cromos entre [[grups]] amics. Cada amic rep els mateixos cromos. Quants cromos rep cada amic?', 'Cada amic rep ___ cromos.', ['cromo', 'amic']),
        P('grups-2-06', 'grups', 2, 'mida', true, 'Hi ha [[total]] llibres en [[grups]] piles iguals. Quants llibres hi ha a cada pila?', 'A cada pila hi ha ___ llibres.', ['llibre']),
        P('grups-3-01', 'grups', 3, 'grups', true, 'Hi ha [[total]] caramels. {Nom} posa [[mida]] caramels a cada bossa. Quantes bosses omple?', '{Nom} omple ___ bosses.', ['caramel', 'bossa']),
        P('grups-3-02', 'grups', 3, 'grups', true, 'Hi ha [[total]] alumnes. A cada taula seuen [[mida]] alumnes. Quantes taules calen?', 'Calen ___ taules.', ['alumne', 'taula']),
        P('grups-3-03', 'grups', 3, 'grups', true, '{Nom} té [[total]] llapis. Posa [[mida]] llapis a cada capsa. Quantes capses omple?', '{Nom} omple ___ capses.', ['llapis', 'capsa']),
        P('grups-3-04', 'grups', 3, 'grups', true, 'Al carrer hi ha [[total]] rodes de cotxe. Cada cotxe té [[mida]] rodes. Quants cotxes hi ha?', 'Hi ha ___ cotxes.', ['cotxe'], RODES),
        P('grups-3-05', 'grups', 3, 'grups', true, '{Nom} té [[total]] galetes. Posa [[mida]] galetes a cada plat. Quants plats omple?', '{Nom} omple ___ plats.', ['galeta', 'plat']),
        P('grups-3-06', 'grups', 3, 'grups', true, 'Hi ha [[total]] llibres. Cada pila té [[mida]] llibres. Quantes piles hi ha?', 'Hi ha ___ piles.', ['llibre']),
        P('grups-4-01', 'grups', 4, 'grups', true, 'En total hi ha [[total]] caramels. A cada bossa hi ha [[mida]] caramels. Quantes bosses hi ha?', 'Hi ha ___ bosses.', ['caramel', 'bossa']),
        P('grups-4-02', 'grups', 4, 'mida', true, '{Nom} compra [[grups]] capses de llapis. En total compra [[total]] llapis. Quants llapis hi ha a cada capsa?', 'A cada capsa hi ha ___ llapis.', ['capsa', 'llapis']),
        P('grups-4-03', 'grups', 4, 'grups', true, 'Cada cotxe té [[mida]] rodes. En total hi ha [[total]] rodes. Quants cotxes hi ha?', 'Hi ha ___ cotxes.', ['cotxe'], RODES),

        // ═════ COMPARACIÓ DE VEGADES ═══════════════════════════════════════
        P('vegades-1-01', 'vegades', 1, 'gran', false, '{Nom2} té [[petit]] cromos. {Nom} té [[k]] vegades els cromos {de_nom2}. Quants cromos té {nom}?', '{Nom} té ___ cromos.', ['cromo']),
        P('vegades-1-02', 'vegades', 1, 'gran', false, 'Una llibreta costa [[petit]] euros. Un llibre costa [[k]] vegades el preu de la llibreta. Quants euros costa el llibre?', 'El llibre costa ___ euros.', ['llibreta', 'llibre', 'euro']),
        P('vegades-1-03', 'vegades', 1, 'gran', false, '{Nom2} fa [[petit]] punts. {Nom} fa [[k]] vegades els punts {de_nom2}. Quants punts fa {nom}?', '{Nom} fa ___ punts.', ['punt']),
        P('vegades-1-04', 'vegades', 1, 'gran', false, 'Un gat pesa [[petit]] quilos. Un gos pesa [[k]] vegades el pes del gat. Quants quilos pesa el gos?', 'El gos pesa ___ quilos.', ['gat', 'gos', 'quilo']),
        P('vegades-1-05', 'vegades', 1, 'gran', false, '{Nom2} llegeix [[petit]] pàgines. {Nom} llegeix [[k]] vegades les pàgines {de_nom2}. Quantes pàgines llegeix {nom}?', '{Nom} llegeix ___ pàgines.', ['pagina']),
        P('vegades-1-06', 'vegades', 1, 'gran', false, 'Una casa té [[petit]] pisos. Una torre té [[k]] vegades els pisos de la casa. Quants pisos té la torre?', 'La torre té ___ pisos.', ['casa', 'torre', 'pis']),
        P('vegades-2-01', 'vegades', 2, 'k', true, '{Nom} té [[gran]] cromos. {Nom2} té [[petit]] cromos. Quantes vegades més cromos té {nom}?', '{Nom} té ___ vegades més cromos.', ['cromo']),
        P('vegades-2-02', 'vegades', 2, 'k', true, 'Un llibre costa [[gran]] euros. Una llibreta costa [[petit]] euros. Quantes vegades més car és el llibre?', 'El llibre és ___ vegades més car.', ['llibre', 'llibreta', 'euro']),
        P('vegades-2-03', 'vegades', 2, 'k', true, '{Nom} fa [[gran]] punts. {Nom2} fa [[petit]] punts. Quantes vegades més punts fa {nom}?', '{Nom} fa ___ vegades més punts.', ['punt']),
        P('vegades-2-04', 'vegades', 2, 'k', true, 'Un gos pesa [[gran]] quilos. Un gat pesa [[petit]] quilos. Quantes vegades més pesa el gos?', 'El gos pesa ___ vegades més.', ['gos', 'gat', 'quilo']),
        P('vegades-2-05', 'vegades', 2, 'k', true, '{Nom} llegeix [[gran]] pàgines. {Nom2} llegeix [[petit]] pàgines. Quantes vegades més pàgines llegeix {nom}?', '{Nom} llegeix ___ vegades més pàgines.', ['pagina']),
        P('vegades-2-06', 'vegades', 2, 'k', true, 'Una torre té [[gran]] pisos. Una casa té [[petit]] pisos. Quantes vegades més pisos té la torre?', 'La torre té ___ vegades més pisos.', ['torre', 'casa', 'pis']),
        P('vegades-3-01', 'vegades', 3, 'petit', true, '{Nom} té [[gran]] cromos. Té [[k]] vegades els cromos {de_nom2}. Quants cromos té {nom2}?', '{Nom2} té ___ cromos.', ['cromo']),
        P('vegades-3-02', 'vegades', 3, 'petit', true, 'Un llibre costa [[gran]] euros. Costa [[k]] vegades el preu d’una llibreta. Quants euros costa la llibreta?', 'La llibreta costa ___ euros.', ['llibre', 'llibreta', 'euro']),
        P('vegades-3-03', 'vegades', 3, 'petit', true, '{Nom} fa [[gran]] punts. Fa [[k]] vegades els punts {de_nom2}. Quants punts fa {nom2}?', '{Nom2} fa ___ punts.', ['punt']),
        P('vegades-3-04', 'vegades', 3, 'petit', true, 'Un gos pesa [[gran]] quilos. Pesa [[k]] vegades el pes d’un gat. Quants quilos pesa el gat?', 'El gat pesa ___ quilos.', ['gos', 'gat', 'quilo']),
        P('vegades-3-05', 'vegades', 3, 'petit', true, '{Nom} llegeix [[gran]] pàgines. Llegeix [[k]] vegades les pàgines {de_nom2}. Quantes pàgines llegeix {nom2}?', '{Nom2} llegeix ___ pàgines.', ['pagina']),
        P('vegades-3-06', 'vegades', 3, 'petit', true, 'Una torre té [[gran]] pisos. Té [[k]] vegades els pisos d’una casa. Quants pisos té la casa?', 'La casa té ___ pisos.', ['torre', 'casa', 'pis']),
        P('vegades-4-01', 'vegades', 4, 'petit', true, '{Nom} té [[gran]] cromos. Té [[k]] vegades més cromos que {nom2}. Quants cromos té {nom2}?', '{Nom2} té ___ cromos.', ['cromo']),
        P('vegades-4-02', 'vegades', 4, 'petit', true, 'Un gos pesa [[gran]] quilos. Pesa [[k]] vegades més que un gat. Quants quilos pesa el gat?', 'El gat pesa ___ quilos.', ['gos', 'gat', 'quilo']),
        P('vegades-4-03', 'vegades', 4, 'petit', true, 'La torre té [[gran]] pisos. Té [[k]] vegades més pisos que la casa. Quants pisos té la casa?', 'La casa té ___ pisos.', ['torre', 'casa', 'pis']),

        // ═════ PROPORCIÓ ═══════════════════════════════════════════════════
        P('proporcio-1-01', 'proporcio', 1, 'total', false, 'Una llibreta costa [[unitat]] euros. {Nom} compra [[quantitat]] llibretes. Quants euros paga?', '{Nom} paga ___ euros.', ['llibreta', 'euro'], T('llibretes', 'euros')),
        P('proporcio-1-02', 'proporcio', 1, 'total', false, 'Una entrada de cinema costa [[unitat]] euros. {Nom} compra [[quantitat]] entrades. Quants euros paga?', '{Nom} paga ___ euros.', ['entrada', 'euro'], T('entrades', 'euros')),
        P('proporcio-1-03', 'proporcio', 1, 'total', false, 'Per fer un pastís calen [[unitat]] ous. {Nom} fa [[quantitat]] pastissos. Quants ous calen?', 'Calen ___ ous.', ['pastis', 'ou'], T('pastissos', 'ous')),
        P('proporcio-1-04', 'proporcio', 1, 'total', false, 'Un quilo de pomes costa [[unitat]] euros. {Nom} compra [[quantitat]] quilos de pomes. Quants euros paga?', '{Nom} paga ___ euros.', ['poma', 'euro'], T('quilos', 'euros')),
        P('proporcio-1-05', 'proporcio', 1, 'total', false, 'Un bitllet de bus costa [[unitat]] euros. {Nom} compra [[quantitat]] bitllets. Quants euros paga?', '{Nom} paga ___ euros.', ['bitllet', 'euro'], T('bitllets', 'euros')),
        P('proporcio-1-06', 'proporcio', 1, 'total', false, 'Un gelat costa [[unitat]] euros. {Nom} compra [[quantitat]] gelats. Quants euros paga?', '{Nom} paga ___ euros.', ['gelat', 'euro'], T('gelats', 'euros')),
        P('proporcio-2-01', 'proporcio', 2, 'unitat', false, '[[quantitat]] llibretes costen [[total]] euros. Totes costen el mateix. Quants euros costa una llibreta?', 'Una llibreta costa ___ euros.', ['llibreta', 'euro'], T('llibretes', 'euros')),
        P('proporcio-2-02', 'proporcio', 2, 'unitat', false, '[[quantitat]] entrades de cinema costen [[total]] euros. Quants euros costa una entrada?', 'Una entrada costa ___ euros.', ['entrada', 'euro'], T('entrades', 'euros')),
        P('proporcio-2-03', 'proporcio', 2, 'unitat', false, 'Per fer [[quantitat]] pastissos calen [[total]] ous. Quants ous calen per fer un pastís?', 'Per fer un pastís calen ___ ous.', ['pastis', 'ou'], T('pastissos', 'ous')),
        P('proporcio-2-04', 'proporcio', 2, 'unitat', false, '[[quantitat]] quilos de pomes costen [[total]] euros. Quants euros costa un quilo?', 'Un quilo costa ___ euros.', ['poma', 'euro'], T('quilos', 'euros')),
        P('proporcio-2-05', 'proporcio', 2, 'unitat', false, '[[quantitat]] bitllets de bus costen [[total]] euros. Quants euros costa un bitllet?', 'Un bitllet costa ___ euros.', ['bitllet', 'euro'], T('bitllets', 'euros')),
        P('proporcio-2-06', 'proporcio', 2, 'unitat', false, '[[quantitat]] gelats costen [[total]] euros. Quants euros costa un gelat?', 'Un gelat costa ___ euros.', ['gelat', 'euro'], T('gelats', 'euros')),
        P('proporcio-3-01', 'proporcio', 3, 'quantitat', false, 'Una llibreta costa [[unitat]] euros. {Nom} paga [[total]] euros per unes llibretes. Quantes llibretes compra?', '{Nom} compra ___ llibretes.', ['llibreta', 'euro'], T('llibretes', 'euros')),
        P('proporcio-3-02', 'proporcio', 3, 'quantitat', false, 'Una entrada de cinema costa [[unitat]] euros. {Nom} paga [[total]] euros. Quantes entrades compra?', '{Nom} compra ___ entrades.', ['entrada', 'euro'], T('entrades', 'euros')),
        P('proporcio-3-03', 'proporcio', 3, 'quantitat', false, 'Per fer un pastís calen [[unitat]] ous. {Nom} té [[total]] ous. Quants pastissos pot fer?', '{Nom} pot fer ___ pastissos.', ['pastis', 'ou'], T('pastissos', 'ous')),
        P('proporcio-3-04', 'proporcio', 3, 'quantitat', false, 'Un quilo de pomes costa [[unitat]] euros. {Nom} paga [[total]] euros. Quants quilos de pomes compra?', '{Nom} compra ___ quilos de pomes.', ['poma', 'euro'], T('quilos', 'euros')),
        P('proporcio-3-05', 'proporcio', 3, 'quantitat', false, 'Un bitllet de bus costa [[unitat]] euros. {Nom} paga [[total]] euros. Quants bitllets compra?', '{Nom} compra ___ bitllets.', ['bitllet', 'euro'], T('bitllets', 'euros')),
        P('proporcio-3-06', 'proporcio', 3, 'quantitat', false, 'Un gelat costa [[unitat]] euros. {Nom} paga [[total]] euros. Quants gelats compra?', '{Nom} compra ___ gelats.', ['gelat', 'euro'], T('gelats', 'euros')),
        P('proporcio-4-01', 'proporcio', 4, 'quantitat', true, 'Cada llibreta costa [[unitat]] euros. En total, {nom} paga [[total]] euros. Quantes llibretes compra?', '{Nom} compra ___ llibretes.', ['llibreta', 'euro'], T('llibretes', 'euros')),
        P('proporcio-4-02', 'proporcio', 4, 'unitat', true, '{Nom} compra [[quantitat]] gelats. En total paga [[total]] euros. Quants euros costa cada gelat?', 'Cada gelat costa ___ euros.', ['gelat', 'euro'], T('gelats', 'euros')),
        P('proporcio-4-03', 'proporcio', 4, 'quantitat', true, 'Per a cada pastís calen [[unitat]] ous. {Nom} té [[total]] ous en total. Quants pastissos pot fer?', '{Nom} pot fer ___ pastissos.', ['pastis', 'ou'], T('pastissos', 'ous')),
    ];
});
