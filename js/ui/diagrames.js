/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/ui/diagrames.js
 * ROL: L'HTML dels diagrames de barres (mètode de Singapur) de cada esquema,
 *      amb una casella (botó) per a cada rol, i els mini-diagrames (SVG) de les
 *      targetes del pas 2.
 * ARQUITECTURA: Funcions pures que tornen text HTML (es poden provar amb Node).
 *      Les barres no van a escala (així no diuen la resposta). Les mides són
 *      classes (f1…f5), no estils en línia (la CSP de _headers no els deixa).
 *        canvi +      [inici][+canvi] / [   final   ]
 *        canvi −      [   inici   ]   / [final][−canvi]
 *        combinació   [   total   ]   / [part][part]
 *        comparació   [    gran   ]   / [petit][dif.]
 *        grups        [   total   ]   / [mida][ ][ ]…[ ]  i  «Grups: _»
 *        vegades      [petit]         / [ ][ ][ ]…[ ] = gran  i  «Vegades: _»
 *        proporció    taula de 2 files: 1 → quantitat, unitat → total
 * DEPENDÈNCIES: js/motor/esquemes.js (etiquetes dels rols)
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var E = typeof module === 'object' && module.exports ? require('../motor/esquemes.js') : arrel.Esquemes;
    var api = fabrica(E);
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.Diagrames = api;
})(typeof self !== 'undefined' ? self : this, function (E) {
    'use strict';
    var esc = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    };

    /** Una casella: botó amb l'etiqueta del rol i el valor que s'hi ha posat. */
    function casella(esquema, rol, cls) {
        var et = E.ESQUEMES[esquema].etiquetes[rol];
        return (
            '<button type="button" class="casella ' +
            (cls || '') +
            '" data-rol="' +
            rol +
            '" aria-label="' +
            esc(et) +
            '">' +
            '<span class="casella-etiqueta">' +
            esc(et) +
            '</span><span class="casella-valor" data-valor="' +
            rol +
            '"></span></button>'
        );
    }
    // Una caixa que només repeteix el valor d'una casella (grups, vegades)
    function copia(rol, cls) {
        return (
            '<div class="barra ' +
            (cls || '') +
            '" aria-hidden="true"><span class="casella-valor copia" data-copia="' +
            rol +
            '"></span></div>'
        );
    }
    var fila = function (contingut, cls) {
        return '<div class="fila ' + (cls || '') + '">' + contingut + '</div>';
    };

    /**
     * El diagrama d'un esquema.
     * @param {string} esquema
     * @param {object} o  { signe, taula: [fila1, fila2] }
     */
    function diagrama(esquema, o) {
        o = o || {};
        var c = function (rol, cls) {
            return casella(esquema, rol, 'barra ' + (cls || ''));
        };
        var h;
        switch (esquema) {
            case 'canvi':
                h =
                    o.signe === '-'
                        ? fila(c('inici', 'f5')) + fila(c('final', 'f3') + c('canvi', 'f2 treu'))
                        : fila(c('inici', 'f3') + c('canvi', 'f2 afegeix')) + fila(c('final', 'f5'));
                break;
            case 'combinacio':
                h = fila(c('total', 'f5 total')) + fila(c('part1', 'f3') + c('part2', 'f2 altra'));
                break;
            case 'comparacio':
                h = fila(c('gran', 'f5')) + fila(c('petit', 'f3') + c('diferencia', 'f2 diferencia'));
                break;
            case 'grups':
                h =
                    fila(c('total', 'f5 total')) +
                    fila(
                        c('mida', 'f1') +
                            copia('mida', 'f1') +
                            copia('mida', 'f1') +
                            '<div class="punts" aria-hidden="true">…</div>' +
                            copia('mida', 'f1')
                    ) +
                    '<div class="peu-diagrama">' +
                    casella(esquema, 'grups', 'petita') +
                    '</div>';
                break;
            case 'vegades':
                h =
                    fila(c('petit', 'f1') + '<div class="buit f4"></div>') +
                    fila(
                        copia('petit', 'f1') +
                            copia('petit', 'f1') +
                            copia('petit', 'f1') +
                            '<div class="punts" aria-hidden="true">…</div>' +
                            copia('petit', 'f1'),
                        'grup-gran'
                    ) +
                    '<div class="peu-diagrama">' +
                    casella(esquema, 'k', 'petita') +
                    casella(esquema, 'gran', 'petita gran') +
                    '</div>';
                break;
            case 'proporcio': {
                var t = o.taula || ['', ''];
                h =
                    '<table class="taula-proporcio"><tbody>' +
                    '<tr><th scope="row">' +
                    esc(t[0]) +
                    '</th><td><span class="fix">1</span></td><td>' +
                    casella(esquema, 'quantitat') +
                    '</td></tr>' +
                    '<tr><th scope="row">' +
                    esc(t[1]) +
                    '</th><td>' +
                    casella(esquema, 'unitat') +
                    '</td><td>' +
                    casella(esquema, 'total') +
                    '</td></tr>' +
                    '</tbody></table>';
                break;
            }
            default:
                throw new Error('diagrama: esquema desconegut ' + esquema);
        }
        return '<div class="diagrama diagrama-' + esquema + '">' + h + '</div>';
    }

    /** Mini-diagrama SVG de la targeta del pas 2 (decoratiu). */
    function mini(esquema) {
        var r = function (x, y, w, cls) {
            return (
                '<rect class="' +
                (cls || 'm-barra') +
                '" x="' +
                x +
                '" y="' +
                y +
                '" width="' +
                w +
                '" height="14" rx="2"/>'
            );
        };
        var s;
        switch (esquema) {
            case 'canvi':
                s = r(2, 4, 44) + r(46, 4, 30, 'm-afegit') + r(2, 24, 74);
                break;
            case 'combinacio':
                s = r(2, 4, 74) + r(2, 24, 44) + r(47, 24, 29, 'm-afegit');
                break;
            case 'comparacio':
                s = r(2, 4, 74) + r(2, 24, 46) + r(48, 24, 28, 'm-buit');
                break;
            case 'grups':
                s = r(2, 4, 74) + r(2, 24, 17) + r(21, 24, 17) + r(40, 24, 17) + r(59, 24, 17);
                break;
            case 'vegades':
                s = r(2, 4, 17) + r(2, 24, 17) + r(21, 24, 17) + r(40, 24, 17);
                break;
            default:
                s =
                    '<line class="m-linia" x1="2" y1="21" x2="76" y2="21"/><line class="m-linia" x1="28" y1="2" x2="28" y2="40"/>' +
                    '<text class="m-text" x="40" y="15">1</text><text class="m-text" x="58" y="15">4</text>' +
                    '<text class="m-text" x="40" y="36">3</text><text class="m-text" x="56" y="36">12</text>';
        }
        return '<svg class="mini" viewBox="0 0 78 42" aria-hidden="true">' + s + '</svg>';
    }

    return { diagrama: diagrama, mini: mini };
});
