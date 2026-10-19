/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: js/ui/textos.js
 * ROL: Tots els textos de la pàgina de l'alumne (problemes.html), en lectura
 *      fàcil: frases curtes, en present, sempre les mateixes paraules.
 * ARQUITECTURA: Dades (window.EsquemesTextos); també es carrega amb Node (tests).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.EsquemesTextos = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    return {
        titol: 'Problemes amb esquema',
        problema: (i, n) => `Problema ${i} de ${n}`,
        passos: ['Llegeix', 'Quin tipus?', 'Omple el diagrama', 'Quina operació?', 'Respon'],
        instruccions: [
            'Llegeix el problema a poc a poc.',
            'Tria el tipus de problema.',
            'Posa cada nombre al seu lloc. Posa el ? on va el que no saps.',
            'Tria l’operació i escriu-la.',
            'Calcula i completa la resposta.',
        ],
        // Perfil tea: què passarà ara (sempre el mateix lloc)
        araPassa: [
            'Ara llegeixes el problema. Després tries el tipus.',
            'Ara tries el tipus. Després omples el diagrama.',
            'Ara omples el diagrama. Després tries l’operació.',
            'Ara tries l’operació. Després calcules.',
            'Ara calcules i respons. Després ve un altre problema.',
        ],
        jaLlegit: 'Ja l’he llegit →',
        comprova: 'Comprova',
        seguent: 'Problema següent →',
        acabar: 'Acaba',
        tornaAComencar: 'Torna a començar',
        mesProblemes: 'Fes 5 problemes més',

        // Pas 2
        tipusMal: (triat, pTriat) => `Has triat ${triat}. ${pTriat} Aquí no.`,
        tipusPensa: (nom, pregunta) => `Pensa en ${nom}: ${pregunta}`,
        tipusBe: nom => `Sí: és ${nom}.`,

        // Pas 3
        triaFitxa: 'Toca un nombre (o el ?) i després toca el seu lloc al diagrama.',
        casellaMal: nom => `La casella «${nom}» no és correcta.`,
        casellaBuida: nom => `Falta omplir la casella «${nom}».`,
        diagramaBe: 'El diagrama és correcte.',
        interrogant: '?',

        // Pas 4
        equacio: 'El diagrama diu:',
        triaOp: 'Quina operació fas per trobar el ?',
        escriuOp: 'Escriu els nombres de l’operació.',
        opMal: {
            resultat: 'El ? és el resultat. Fes la mateixa operació del diagrama.',
            part: 'El ? és una part. Per trobar una part, resta: total menys l’altra part.',
            factor: 'El ? és una de les dues parts de la multiplicació. Per trobar-lo, divideix.',
            inici: 'El ? és el principi. Al principi hi ha més: suma.',
            tret: 'El ? és el que es treu. Resta: principi menys final.',
        },
        nombresMal: 'Fes servir els dos nombres del diagrama.',
        ordreMal: op =>
            op === '−' ? 'A la resta, primer va el nombre gran.' : 'A la divisió, primer va el nombre gran.',
        operacioBe: 'L’operació és correcta.',

        // Pas 5
        calcula: 'Calcula:',
        completa: 'Completa la resposta:',
        calculMal: (x, op, y, v) => `Revisa el càlcul: ${x} ${op} ${y} no fa ${v}.`,
        fraseMal: 'Escriu a la resposta el resultat del càlcul.',
        escriuNombre: 'Escriu un nombre.',
        be: 'Molt bé! Has resolt el problema.',

        // Final
        final: (n, primera) => `Has fet ${n} problemes. ${primera} a la primera.`,
        senseCodi: 'Aquesta activitat no dona codi.',

        // Accessibilitat
        casella: (nom, v) => `Casella ${nom}: ${v === null ? 'buida' : v}`,
        fitxa: v => `Nombre ${v}`,
        fitxaInterrogant: 'El que no saps',
        temporitzador: 'Temps',
    };
});
