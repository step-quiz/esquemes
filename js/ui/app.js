/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/ui/app.js
 * ROL: Controlador de la pàgina de l'alumne (problemes.html): els cinc passos,
 *      sempre iguals i al mateix lloc (Llegeix → Quin tipus? → Omple el
 *      diagrama → Quina operació? → Respon), els perfils i el temporitzador.
 * ARQUITECTURA:
 * - La matemàtica i els textos dels problemes són als motors purs (js/motor/*)
 *   i a les dades (data/*). Aquí hi ha l'estat de la pàgina i els missatges.
 * - Un pas a la vegada; a dalt, sempre a la mateixa posició, els cinc punts dels
 *   passos i l'enunciat. Com a molt dos missatges a la vegada.
 * - Fitxes: tocar i tocar (fitxa → casella), arrossegar, o teclat (Tab, Retorn,
 *   Esc per deixar-la, Retrocés o Supr per buidar una casella).
 * - Paràmetres (problemes.html?…): esquemes=canvi,combinacio · nivell=1–4 ·
 *   perfil=tea|tdah|dil · n=5–20 · fixed=A|B|C · pictos=0|1 · temporitzador=1–10
 *   (minuts per problema). Els valors estranys s'ignoren. Sense codi de verificació.
 * DEPENDÈNCIES (ordre a problemes.html): data/*.js, js/motor/atzar.js,
 *      esquemes.js, generador.js, js/ui/textos.js, diagrames.js, aquest fitxer.
 * ============================================================================
 */
(function () {
    'use strict';
    var E = window.Esquemes,
        G = window.Generador,
        D = window.Diagrames,
        Atzar = window.Atzar,
        T = window.EsquemesTextos;
    var PLANTILLES = window.ESQUEMES_PLANTILLES,
        NOMS = window.ESQUEMES_NOMS,
        PICTOS = window.ESQUEMES_PICTOS;
    var $ = function (id) {
        return document.getElementById(id);
    };
    var esc = function (s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    // ── Configuració (adreça) ───────────────────────────────────────────────
    var q;
    try {
        q = new URLSearchParams(location.search);
    } catch (e) {
        q = new URLSearchParams('');
    }
    var enter = function (k, lo, hi, def) {
        var v = Number(q.get(k));
        return q.has(k) && Number.isInteger(v) && v >= lo && v <= hi ? v : def;
    };
    var PERFIL = ['tea', 'tdah', 'dil'].indexOf(q.get('perfil')) >= 0 ? q.get('perfil') : '';
    var NIVELL = enter('nivell', 1, 4, 1);
    var ESQ = String(q.get('esquemes') || '')
        .split(',')
        .filter(function (e, i, a) {
            return E.IDS.indexOf(e) >= 0 && a.indexOf(e) === i;
        });
    if (!ESQ.length) ESQ = E.IDS.slice();
    var N = PERFIL === 'tdah' ? 5 : enter('n', 5, 20, 10);
    var FIXED =
        ['A', 'B', 'C'].indexOf(String(q.get('fixed') || '').toUpperCase()) >= 0 ? q.get('fixed').toUpperCase() : '';
    var PICTOS_ON = q.has('pictos') ? q.get('pictos') === '1' : PERFIL === 'dil';
    var MINUTS = enter('temporitzador', 1, 10, 0);

    function llavorNova() {
        try {
            var a = new Uint32Array(2);
            crypto.getRandomValues(a);
            return a[0].toString(36) + a[1].toString(36);
        } catch (e) {
            return String(Date.now());
        }
    }
    var tanda = 0;
    function llavor() {
        return FIXED ? FIXED + '|' + NIVELL + '|' + ESQ.join(',') + '|' + PERFIL + '|' + tanda : llavorNova();
    }
    var plantilles = PLANTILLES.filter(function (p) {
        return ESQ.indexOf(p.esquema) >= 0 && p.nivell === NIVELL;
    });

    var els = {
        comptador: $('comptador'),
        passos: $('passos'),
        araPassa: $('ara-passa'),
        enunciat: $('enunciat'),
        resum: $('resum'),
        titol: $('pas-titol'),
        instruccio: $('pas-instruccio'),
        cos: $('pas-cos'),
        feedback: $('feedback'),
        accions: $('accions'),
        rellotge: $('rellotge'),
        arrossega: $('arrossega'),
    };

    // ── Estat ───────────────────────────────────────────────────────────────
    var serie = [],
        idx = 0,
        primera = 0,
        pr = null,
        st = null;

    function comencaTanda() {
        serie = G.serie(plantilles, { n: N, llavor: llavor(), perfil: PERFIL, noms: NOMS, Atzar: Atzar });
        idx = 0;
        primera = 0;
        comencaProblema();
    }
    function comencaProblema() {
        pr = serie[idx];
        var at = Atzar.crea(pr.plantilla.id + '|' + idx + '|' + tanda);
        // Fitxes: els nombres de l'enunciat, en ordre, i el ?
        var xips = [];
        pr.text.forEach(function (s) {
            if (s.t === 'xip') xips.push({ id: 'x' + xips.length, valor: s.v });
        });
        xips.push({ id: 'q', valor: '?' });
        // Targetes del pas 2: les dels esquemes triats (perfil dil: la bona i una altra)
        var cartes = ESQ.slice();
        if (PERFIL === 'dil' && cartes.length > 2) {
            var altres = at.barreja(
                cartes.filter(function (e) {
                    return e !== pr.plantilla.esquema;
                })
            );
            cartes = at.barreja([pr.plantilla.esquema, altres[0]]);
        }
        st = { pas: 1, errors: 0, xips: xips, caselles: {}, triat: null, op: null, cartes: cartes, resum: [] };
        E.ESQUEMES[pr.plantilla.esquema].rols.forEach(function (r) {
            st.caselles[r] = null;
        });
        els.comptador.textContent = T.problema(idx + 1, serie.length);
        pintaEnunciat();
        iniciaRellotge();
        pinta();
    }

    // ── Enunciat (amb fitxes i, si cal, pictogrames) ────────────────────────
    function ambPictos(text, ids, usats) {
        // Un emoji després de la paraula, només la primera vegada a cada frase
        var paraules = {};
        (ids || []).forEach(function (id) {
            (PICTOS[id] ? PICTOS[id].paraules : []).forEach(function (w) {
                paraules[w] = id;
            });
        });
        return text
            .split(/([A-Za-zÀ-ÿ·’]+|[.?!])/)
            .map(function (tros) {
                if (/^[.?!]$/.test(tros)) {
                    usats.clear();
                    return esc(tros);
                }
                var id = paraules[tros.toLowerCase()];
                if (!PICTOS_ON || !id || usats.has(id)) return esc(tros);
                usats.add(id);
                return esc(tros) + ' <span class="picto" aria-hidden="true">' + PICTOS[id].emoji + '</span>';
            })
            .join('');
    }
    function pintaEnunciat() {
        var n = 0,
            usats = new Set();
        els.enunciat.innerHTML =
            '<p class="text-problema">' +
            pr.text
                .map(function (s) {
                    if (s.t === 'text') return ambPictos(s.v, pr.plantilla.pictos, usats);
                    var id = 'x' + n++;
                    return (
                        '<button type="button" class="xip xip-text" data-xip="' +
                        id +
                        '" aria-label="' +
                        esc(T.fitxa(s.v)) +
                        '">' +
                        s.v +
                        '</button>'
                    );
                })
                .join('') +
            '</p>';
        els.enunciat.querySelectorAll('.xip').forEach(function (b) {
            b.addEventListener('click', function () {
                if (st.pas === 3 && !arrossegat) triaXip(b.dataset.xip);
            });
            ferArrossegable(b);
        });
    }

    // ── Pintar el pas actual ───────────────────────────────────────────────
    function pinta() {
        els.passos.querySelectorAll('li').forEach(function (li, i) {
            li.classList.toggle('fet', i + 1 < st.pas);
            li.classList.toggle('actual', i + 1 === st.pas);
            if (i + 1 === st.pas) li.setAttribute('aria-current', 'step');
            else li.removeAttribute('aria-current');
        });
        els.titol.textContent = st.pas + '. ' + T.passos[st.pas - 1];
        els.instruccio.textContent = T.instruccions[st.pas - 1];
        if (PERFIL === 'tea') els.araPassa.textContent = T.araPassa[st.pas - 1];
        els.resum.innerHTML = st.resum
            .map(function (r) {
                return '<span class="insignia">' + r + '</span>';
            })
            .join('');
        els.enunciat.classList.toggle('actiu', st.pas === 3);
        neteja();
        accions();
        [pas1, pas2, pas3, pas4, pas5][st.pas - 1]();
    }
    function avanca() {
        st.pas++;
        pinta();
        els.titol.focus({ preventScroll: true });
    }
    function missatges(llista, tipus) {
        els.feedback.innerHTML = llista
            .slice(0, 2)
            .map(function (m) {
                var icona = tipus === 'be' ? '✓' : tipus === 'info' ? 'ℹ' : '✗';
                return (
                    '<p class="fb fb-' +
                    (tipus || 'error') +
                    '"><span class="fb-icona" aria-hidden="true">' +
                    icona +
                    '</span> ' +
                    esc(m) +
                    '</p>'
                );
            })
            .join('');
    }
    function neteja() {
        els.feedback.innerHTML = '';
    }
    function accions() {
        els.accions.innerHTML = '';
    }
    function boto(text, fn, principal) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn' + (principal ? ' btn-principal' : '');
        b.textContent = text;
        b.addEventListener('click', fn);
        els.accions.appendChild(b);
        return b;
    }

    // ── Pas 1: Llegeix ─────────────────────────────────────────────────────
    function pas1() {
        els.cos.innerHTML = '';
        boto(T.jaLlegit, avanca, true);
    }

    // ── Pas 2: Quin tipus? ─────────────────────────────────────────────────
    function pas2() {
        els.cos.innerHTML =
            '<div class="cartes" role="group" aria-label="' +
            esc(T.passos[1]) +
            '">' +
            st.cartes
                .map(function (id) {
                    var e = E.ESQUEMES[id];
                    return (
                        '<button type="button" class="carta" data-esquema="' +
                        id +
                        '"><span class="carta-icona" aria-hidden="true">' +
                        e.icona +
                        '</span>' +
                        '<span class="carta-nom">' +
                        esc(e.nom) +
                        '</span>' +
                        D.mini(id) +
                        '</button>'
                    );
                })
                .join('') +
            '</div>';
        els.cos.querySelectorAll('.carta').forEach(function (b) {
            b.addEventListener('click', function () {
                var id = b.dataset.esquema,
                    bo = pr.plantilla.esquema;
                if (id !== bo) {
                    st.errors++;
                    b.classList.add('mal');
                    b.disabled = true;
                    var a = E.ESQUEMES[id],
                        c = E.ESQUEMES[bo];
                    missatges([T.tipusMal(a.nom, a.pregunta), T.tipusPensa(c.nom, c.pregunta)]);
                    return;
                }
                st.resum.push(esc(E.ESQUEMES[bo].icona + ' ' + E.ESQUEMES[bo].nom));
                avanca();
            });
        });
    }

    // ── Pas 3: Omple el diagrama ───────────────────────────────────────────
    var seleccionat = null;
    function pas3() {
        seleccionat = null;
        els.cos.innerHTML =
            D.diagrama(pr.plantilla.esquema, { signe: pr.plantilla.signe, taula: pr.plantilla.taula }) +
            '<div class="piscina" role="group" aria-label="Nombres">' +
            st.xips
                .map(function (x) {
                    return (
                        '<button type="button" class="xip' +
                        (x.id === 'q' ? ' xip-q' : '') +
                        '" data-xip="' +
                        x.id +
                        '" aria-label="' +
                        esc(x.id === 'q' ? T.fitxaInterrogant : T.fitxa(x.valor)) +
                        '">' +
                        x.valor +
                        '</button>'
                    );
                })
                .join('') +
            '</div><p class="nota">' +
            esc(T.triaFitxa) +
            '</p>';
        els.cos.querySelectorAll('.piscina .xip').forEach(function (b) {
            b.addEventListener('click', function () {
                if (!arrossegat) triaXip(b.dataset.xip);
            });
            ferArrossegable(b);
        });
        els.cos.querySelectorAll('.casella').forEach(function (b) {
            b.addEventListener('click', function () {
                tocaCasella(b.dataset.rol);
            });
            b.addEventListener('keydown', function (e) {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                    st.caselles[b.dataset.rol] = null;
                    pintaCaselles();
                    e.preventDefault();
                }
            });
        });
        pintaCaselles();
        boto(T.comprova, comprovaDiagrama, true);
    }
    function valorXip(id) {
        var x = st.xips.find(function (k) {
            return k.id === id;
        });
        return x ? x.valor : null;
    }
    function triaXip(id) {
        seleccionat = seleccionat === id ? null : id;
        pintaCaselles();
    }
    function tocaCasella(rol) {
        if (seleccionat) {
            posa(seleccionat, rol);
            seleccionat = null;
        } else if (st.caselles[rol]) {
            st.caselles[rol] = null; // tocar una casella plena sense fitxa la buida
        }
        pintaCaselles();
    }
    function posa(id, rol) {
        Object.keys(st.caselles).forEach(function (r) {
            if (st.caselles[r] === id) st.caselles[r] = null;
        });
        st.caselles[rol] = id;
        neteja();
    }
    function pintaCaselles() {
        var usats = {};
        Object.keys(st.caselles).forEach(function (r) {
            var id = st.caselles[r];
            if (id) usats[id] = true;
            var v = id ? valorXip(id) : null;
            document.querySelectorAll('[data-valor="' + r + '"], [data-copia="' + r + '"]').forEach(function (el) {
                el.textContent = v === null ? '' : v;
            });
            var cas = document.querySelector('.casella[data-rol="' + r + '"]');
            if (cas) {
                cas.classList.toggle('plena', !!id);
                cas.classList.remove('mal');
                cas.setAttribute('aria-label', T.casella(E.ESQUEMES[pr.plantilla.esquema].etiquetes[r], v));
            }
        });
        document.querySelectorAll('.xip').forEach(function (b) {
            b.classList.toggle('usat', !!usats[b.dataset.xip]);
            b.classList.toggle('seleccionat', b.dataset.xip === seleccionat);
            b.setAttribute('aria-pressed', String(b.dataset.xip === seleccionat));
        });
    }
    function comprovaDiagrama() {
        var p = pr.plantilla,
            e = E.ESQUEMES[p.esquema];
        var espera = function (r) {
            return r === p.incognita ? '?' : pr.valors[r];
        };
        var posat = function (r) {
            return st.caselles[r] ? valorXip(st.caselles[r]) : null;
        };
        var mal = [];
        var inter = e.intercanviables || [];
        e.rols.forEach(function (r) {
            if (posat(r) === null) {
                mal.push({ r: r, m: T.casellaBuida(e.etiquetes[r]) });
                return;
            }
            var ok = posat(r) === espera(r);
            if (!ok && inter.indexOf(r) >= 0) {
                var a = inter[0],
                    b = inter[1];
                ok = posat(a) === espera(b) && posat(b) === espera(a); // les dues parts, a l'inrevés
            }
            if (!ok) mal.push({ r: r, m: T.casellaMal(e.etiquetes[r]) });
        });
        if (mal.length) {
            st.errors++;
            mal.forEach(function (x) {
                var c = document.querySelector('.casella[data-rol="' + x.r + '"]');
                if (c) c.classList.add('mal');
            });
            missatges(
                mal.map(function (x) {
                    return x.m;
                })
            );
            return;
        }
        avanca();
    }

    // Arrossegar una fitxa fins a una casella
    var arrossegat = false;
    function ferArrossegable(b) {
        var inici = null;
        b.addEventListener('pointerdown', function (ev) {
            if (st.pas !== 3 || ev.button !== 0) return;
            inici = { x: ev.clientX, y: ev.clientY, id: b.dataset.xip, mogut: false };
            arrossegat = false;
            try {
                b.setPointerCapture(ev.pointerId);
            } catch (e) {
                /* navegadors antics */
            }
        });
        b.addEventListener('pointermove', function (ev) {
            if (!inici) return;
            if (!inici.mogut && Math.hypot(ev.clientX - inici.x, ev.clientY - inici.y) > 8) {
                inici.mogut = true;
                els.arrossega.textContent = valorXip(inici.id);
                els.arrossega.hidden = false;
            }
            if (inici.mogut) {
                els.arrossega.style.left = ev.clientX + 'px';
                els.arrossega.style.top = ev.clientY + 'px';
            }
        });
        var acaba = function (ev, cancel) {
            if (!inici) return;
            var d = inici;
            inici = null;
            els.arrossega.hidden = true;
            if (!d.mogut || cancel) return;
            arrossegat = true;
            setTimeout(function () {
                arrossegat = false;
            }, 0);
            var el = document.elementFromPoint(ev.clientX, ev.clientY);
            var cas = el && el.closest('.casella');
            if (cas) {
                posa(d.id, cas.dataset.rol);
                seleccionat = null;
                pintaCaselles();
            }
        };
        b.addEventListener('pointerup', function (ev) {
            acaba(ev, false);
        });
        b.addEventListener('pointercancel', function (ev) {
            acaba(ev, true);
        });
    }

    // ── Pas 4: Quina operació? ─────────────────────────────────────────────
    function textEquacio() {
        var p = pr.plantilla,
            eq = E.ESQUEMES[p.esquema].equacio(p.signe);
        var v = function (r) {
            return r === p.incognita ? '?' : pr.valors[r];
        };
        return v(eq.a) + ' ' + eq.op + ' ' + v(eq.b) + ' = ' + v(eq.c);
    }
    function pas4() {
        st.op = null;
        els.cos.innerHTML =
            '<p class="nota">' +
            esc(T.equacio) +
            '</p><p class="equacio">' +
            esc(textEquacio()) +
            '</p>' +
            '<p class="pregunta">' +
            esc(T.triaOp) +
            '</p><div class="ops" role="group" aria-label="Operacions">' +
            ['+', '−', '·', ':']
                .map(function (o) {
                    var nom = { '+': 'suma', '−': 'resta', '·': 'multiplicació', ':': 'divisió' }[o];
                    return (
                        '<button type="button" class="op" data-op="' +
                        o +
                        '" aria-label="' +
                        nom +
                        '">' +
                        o +
                        '</button>'
                    );
                })
                .join('') +
            '</div><div id="calcul" class="calcul" hidden></div>';
        els.cos.querySelectorAll('.op').forEach(function (b) {
            b.addEventListener('click', function () {
                triaOp(b.dataset.op, b);
            });
        });
    }
    function triaOp(o, b) {
        var p = pr.plantilla;
        if (o !== pr.solucio.op) {
            st.errors++;
            b.classList.add('mal');
            b.disabled = true;
            missatges([T.opMal[E.posicio(p.esquema, p.signe, p.incognita)]]);
            return;
        }
        st.op = o;
        neteja();
        els.cos.querySelectorAll('.op').forEach(function (x) {
            x.disabled = true;
            x.classList.toggle('triat', x === b);
        });
        var c = $('calcul');
        c.hidden = false;
        c.innerHTML =
            '<p class="nota">' +
            esc(T.escriuOp) +
            '</p><p class="fila-calcul">' +
            '<input id="in-x" class="num" inputmode="numeric" autocomplete="off" aria-label="Primer nombre"> <span class="op-gran">' +
            o +
            '</span> ' +
            '<input id="in-y" class="num" inputmode="numeric" autocomplete="off" aria-label="Segon nombre"> <span>= ?</span></p>';
        accions();
        boto(T.comprova, comprovaOperacio, true);
        $('in-x').focus();
        enterComprova(c);
    }
    function llegeixNombre(id) {
        var v = String($(id).value || '').trim();
        return /^\d+$/.test(v) ? parseInt(v, 10) : null;
    }
    function comprovaOperacio() {
        var x = llegeixNombre('in-x'),
            y = llegeixNombre('in-y'),
            s = pr.solucio;
        if (x === null || y === null) {
            missatges([T.escriuNombre], 'info');
            return;
        }
        var mateixos = (x === s.x && y === s.y) || (x === s.y && y === s.x);
        if (!mateixos) {
            st.errors++;
            missatges([T.nombresMal]);
            return;
        }
        if (!E.commutativa(s.op) && x !== s.x) {
            st.errors++;
            missatges([T.ordreMal(s.op)]);
            return;
        }
        st.resum.push(esc(x + ' ' + s.op + ' ' + y));
        avanca();
    }

    // ── Pas 5: Respon ──────────────────────────────────────────────────────
    function pas5() {
        var s = pr.solucio;
        var frase = G.plana(pr.frase).split('___');
        els.cos.innerHTML =
            '<p class="nota">' +
            esc(T.calcula) +
            '</p><p class="fila-calcul"><span>' +
            s.x +
            ' ' +
            s.op +
            ' ' +
            s.y +
            ' =</span> ' +
            '<input id="in-res" class="num" inputmode="numeric" autocomplete="off" aria-label="Resultat"></p>' +
            '<p class="nota">' +
            esc(T.completa) +
            '</p><p class="frase">' +
            esc(frase[0]) +
            '<input id="in-frase" class="num" inputmode="numeric" autocomplete="off" aria-label="Nombre de la resposta">' +
            esc(frase[1]) +
            '</p>';
        boto(T.comprova, comprovaResposta, true);
        $('in-res').focus();
        enterComprova(els.cos);
    }
    function comprovaResposta() {
        var r = llegeixNombre('in-res'),
            f = llegeixNombre('in-frase'),
            s = pr.solucio;
        if (r === null || f === null) {
            missatges([T.escriuNombre], 'info');
            return;
        }
        var m = [];
        if (r !== pr.resposta) m.push(T.calculMal(s.x, s.op, s.y, r));
        else if (f !== pr.resposta) m.push(T.fraseMal);
        if (m.length) {
            st.errors++;
            missatges(m);
            return;
        }
        if (!st.errors) primera++;
        aturaRellotge();
        missatges([T.be], 'be');
        els.cos.querySelectorAll('input').forEach(function (i) {
            i.disabled = true;
        });
        accions();
        if (idx < serie.length - 1)
            boto(
                T.seguent,
                function () {
                    idx++;
                    comencaProblema();
                    els.titol.focus({ preventScroll: true });
                },
                true
            ).focus();
        else boto(T.acabar, finalTanda, true).focus();
    }
    function enterComprova(cont) {
        cont.querySelectorAll('input').forEach(function (i) {
            i.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter') return;
                var b = els.accions.querySelector('.btn-principal');
                if (b) b.click();
            });
        });
    }

    // ── Final de la tanda ──────────────────────────────────────────────────
    function finalTanda() {
        aturaRellotge();
        els.passos.querySelectorAll('li').forEach(function (li) {
            li.classList.add('fet');
            li.classList.remove('actual');
        });
        els.enunciat.innerHTML = '';
        els.resum.innerHTML = '';
        els.titol.textContent = T.final(serie.length, primera);
        els.instruccio.textContent = T.senseCodi;
        els.araPassa.textContent = '';
        els.cos.innerHTML = '';
        neteja();
        accions();
        if (PERFIL === 'tdah')
            boto(
                T.mesProblemes,
                function () {
                    tanda++;
                    comencaTanda();
                },
                true
            );
        boto(
            T.tornaAComencar,
            function () {
                tanda = 0;
                comencaTanda();
            },
            PERFIL !== 'tdah'
        );
    }

    // ── Temporitzador (opcional): un disc que es buida, sense nombres ni so ─
    var rellotgeInterval = null;
    function iniciaRellotge() {
        aturaRellotge();
        if (!MINUTS) return;
        els.rellotge.removeAttribute('hidden'); // és un SVG: la propietat .hidden no hi funciona
        var t0 = Date.now(),
            total = MINUTS * 60000;
        var cercle = els.rellotge.querySelector('.disc');
        var pinta = function () {
            var queda = Math.max(0, 1 - (Date.now() - t0) / total);
            cercle.setAttribute('stroke-dashoffset', String((1 - queda) * 100));
            if (!queda) aturaRellotge();
        };
        pinta();
        rellotgeInterval = setInterval(pinta, 1000);
    }
    function aturaRellotge() {
        if (rellotgeInterval) clearInterval(rellotgeInterval);
        rellotgeInterval = null;
    }

    // ── Teclat ─────────────────────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && seleccionat) {
            seleccionat = null;
            pintaCaselles();
        }
    });

    // ── Arrencada ──────────────────────────────────────────────────────────
    els.passos.innerHTML = T.passos
        .map(function (t, i) {
            return (
                '<li><span class="punt" aria-hidden="true">' +
                (i + 1) +
                '</span> <span class="nom-pas">' +
                esc(t) +
                '</span></li>'
            );
        })
        .join('');
    if (PERFIL) document.body.classList.add('perfil-' + PERFIL);
    els.araPassa.hidden = PERFIL !== 'tea';
    if (!MINUTS) els.rellotge.setAttribute('hidden', '');
    comencaTanda();
})();
