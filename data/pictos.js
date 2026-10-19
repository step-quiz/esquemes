/**
 * ============================================================================
 * PROJECTE: esquemes (Step Quiz, vanilla JS)
 * FITXER: data/pictos.js
 * ROL: Els pictogrames de les paraules: id → { emoji, paraules }.
 *      Si el perfil els activa, l'emoji surt just després de cada paraula de la
 *      llista (només la primera vegada a cada frase).
 * ARQUITECTURA: Dades. Ara són emojis del sistema (decisió de l'usuari,
 *      19/10/2026). Per passar a ARASAAC: afegir «fitxer: 'img/arasaac/…png'» a
 *      cada entrada i l'atribució al peu (especificació §5.4).
 * DEPENDÈNCIES: cap
 * ============================================================================
 */
(function (arrel, fabrica) {
    'use strict';
    var api = fabrica();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else arrel.ESQUEMES_PICTOS = api;
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    // prettier-ignore
    return {
        cromo: { emoji: '🃏', paraules: ['cromos'] },
        llapis: { emoji: '✏️', paraules: ['llapis'] },
        caramel: { emoji: '🍬', paraules: ['caramels'] },
        globus: { emoji: '🎈', paraules: ['globus'] },
        alumne: { emoji: '🧒', paraules: ['alumnes'] },
        nen: { emoji: '👦', paraules: ['nens'] },
        nena: { emoji: '👧', paraules: ['nenes'] },
        persona: { emoji: '🧍', paraules: ['persones'] },
        bus: { emoji: '🚌', paraules: ['bus'] },
        euro: { emoji: '💶', paraules: ['euros'] },
        llibre: { emoji: '📚', paraules: ['llibres', 'llibre'] },
        poma: { emoji: '🍎', paraules: ['pomes'] },
        gos: { emoji: '🐕', paraules: ['gos', 'gossos'] },
        gat: { emoji: '🐈', paraules: ['gat'] },
        pagina: { emoji: '📄', paraules: ['pàgines'] },
        any: { emoji: '🎂', paraules: ['anys'] },
        torre: { emoji: '🏢', paraules: ['torre'] },
        casa: { emoji: '🏠', paraules: ['casa'] },
        punt: { emoji: '⭐', paraules: ['punts'] },
        bossa: { emoji: '🛍️', paraules: ['bosses', 'bossa'] },
        capsa: { emoji: '📦', paraules: ['capses', 'capsa'] },
        taula: { emoji: '🪑', paraules: ['taules', 'taula'] },
        cotxe: { emoji: '🚗', paraules: ['cotxes', 'cotxe'] },
        plat: { emoji: '🍽️', paraules: ['plats', 'plat'] },
        galeta: { emoji: '🍪', paraules: ['galetes'] },
        llibreta: { emoji: '📒', paraules: ['llibretes', 'llibreta'] },
        entrada: { emoji: '🎟️', paraules: ['entrades', 'entrada'] },
        pastis: { emoji: '🍰', paraules: ['pastissos', 'pastís'] },
        ou: { emoji: '🥚', paraules: ['ous'] },
        bitllet: { emoji: '🎫', paraules: ['bitllets', 'bitllet'] },
        gelat: { emoji: '🍦', paraules: ['gelats', 'gelat'] },
        tren: { emoji: '🚆', paraules: ['tren'] },
        amic: { emoji: '🧑‍🤝‍🧑', paraules: ['amics'] },
        quilo: { emoji: '⚖️', paraules: ['quilos'] },
        pis: { emoji: '🏢', paraules: ['pisos'] },
    };
});
