/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/ui/enllacos.js
 * ROL: El generador d'enllaços per al professorat (index.html): tria esquemes,
 *      nivell, perfil, nombre de problemes, sessió fixa, imatges i temporitzador,
 *      i fa l'enllaç a problemes.html (el patró d'operacions/index.html).
 * ARQUITECTURA: Script clàssic. L'enllaç és el de step-quiz si la pàgina s'obre
 *      amb doble clic (file://), i el del mateix lloc si s'obre des d'un servidor.
 * DEPENDÈNCIES: js/motor/esquemes.js (noms, preguntes i exemples dels esquemes)
 * ============================================================================
 */
(function () {
    'use strict';
    var E = window.Esquemes;
    var $ = function (id) {
        return document.getElementById(id);
    };
    var esc = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    };
    var PER_DEFECTE = ['canvi', 'combinacio', 'comparacio'];
    var EXEMPLES = {
        canvi: 'La Laia té 12 cromos. Guanya 5 cromos. Quants cromos té ara?',
        combinacio: 'A la classe hi ha 12 nens i 13 nenes. Quants alumnes hi ha?',
        comparacio: 'En Pau té 17 cromos. La Laia té 12 cromos. Quants cromos més té en Pau?',
        grups: 'Hi ha 4 bosses. A cada bossa hi ha 5 caramels. Quants caramels hi ha?',
        vegades: 'Un gat pesa 4 quilos. Un gos pesa 3 vegades el pes del gat. Quants quilos pesa el gos?',
        proporcio: 'Una llibreta costa 3 euros. La Nora compra 4 llibretes. Quants euros paga?',
    };

    var base =
        location.protocol === 'http:' || location.protocol === 'https:'
            ? location.href.replace(/[^/]*([?#].*)?$/, '')
            : 'https://esquemes.step-quiz.net/';

    $('opcions-esquemes').innerHTML = E.IDS.map(function (id) {
        var e = E.ESQUEMES[id];
        return (
            '<label class="opcio"><input type="checkbox" value="' +
            id +
            '"' +
            (PER_DEFECTE.indexOf(id) >= 0 ? ' checked' : '') +
            '> ' +
            '<span aria-hidden="true">' +
            e.icona +
            '</span> ' +
            esc(e.nom) +
            '</label>'
        );
    }).join('');
    $('explica').innerHTML = E.IDS.map(function (id) {
        var e = E.ESQUEMES[id];
        return (
            '<dt>' +
            e.icona +
            ' ' +
            esc(e.nom) +
            '</dt><dd>' +
            esc(e.pregunta) +
            ' Exemple: «' +
            esc(EXEMPLES[id]) +
            '»</dd>'
        );
    }).join('');

    function enllac() {
        var q = new URLSearchParams();
        var esq = [].slice.call(document.querySelectorAll('#opcions-esquemes input:checked')).map(function (i) {
            return i.value;
        });
        if (esq.length) q.set('esquemes', esq.join(','));
        q.set('nivell', $('nivell').value);
        if ($('perfil').value) q.set('perfil', $('perfil').value);
        if ($('perfil').value !== 'tdah') q.set('n', $('n').value);
        if ($('fixed').value) q.set('fixed', $('fixed').value);
        if ($('pictos').value) q.set('pictos', $('pictos').value);
        if ($('temporitzador').value) q.set('temporitzador', $('temporitzador').value);
        return base + 'problemes.html?' + q.toString().replace(/%2C/g, ',');
    }
    function pinta() {
        var cap = !document.querySelector('#opcions-esquemes input:checked');
        $('enllac').textContent = cap ? 'Tria almenys un tipus de problema.' : enllac();
        $('btn-copia').disabled = cap;
        $('btn-obre').disabled = cap;
        $('n').disabled = $('perfil').value === 'tdah';
    }
    document.querySelectorAll('input, select').forEach(function (el) {
        el.addEventListener('change', pinta);
    });
    $('btn-copia').addEventListener('click', function () {
        var t = $('enllac').textContent;
        var fet = function (ok) {
            $('estat-copia').textContent = ok ? 'Copiat ✓' : 'Selecciona l’enllaç i copia’l (Ctrl+C).';
        };
        try {
            navigator.clipboard.writeText(t).then(
                function () {
                    fet(true);
                },
                function () {
                    fet(false);
                }
            );
        } catch (e) {
            fet(false);
        }
    });
    $('btn-obre').addEventListener('click', function () {
        // Amb doble clic, s'obre la còpia local; des del web, el web
        var l = enllac();
        window.open(
            base.indexOf('https://esquemes.step-quiz.net/') === 0 && location.protocol === 'file:'
                ? l.replace(base, '')
                : l,
            '_blank'
        );
    });
    pinta();
})();
