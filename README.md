# Problemes amb esquema

Problemes d'enunciat (sumar, restar, multiplicar, dividir) resolts amb **diagrames de barres**. Abans de calcular, l'alumne diu **de quin tipus** és el problema i posa els nombres al diagrama; l'operació en surt. Pensat per a l'alumnat d'ESO amb TEA, DIL o TDAH i per a qui resol els problemes buscant paraules clau («més» → sumar), l'estratègia que falla just quan el text diu «més» i cal restar.

Web: https://esquemes.step-quiz.net (generador d'enllaços per al professorat) · `problemes.html` (la pàgina de l'alumne)

## Els sis esquemes

| Esquema | Valor a l'adreça | Estructura | Exemple |
|---|---|---|---|
| Canvi | `canvi` | inici ± canvi = final | La Laia té 12 cromos. Guanya 5 cromos. Quants cromos té ara? |
| Combinació | `combinacio` | part + part = total | A la classe hi ha 12 nens i 13 nenes. Quants alumnes hi ha? |
| Comparació | `comparacio` | petit + diferència = gran | En Pau té 17 cromos. La Laia té 12 cromos. Quants cromos més té en Pau? |
| Grups iguals | `grups` | grups · mida = total | Hi ha 4 bosses. A cada bossa hi ha 5 caramels. Quants caramels hi ha? |
| Comparació de vegades | `vegades` | petit · vegades = gran | Un gat pesa 4 quilos. Un gos pesa 3 vegades el pes del gat. Quants quilos pesa el gos? |
| Proporció | `proporcio` | preu d'1 · quantitat = total (taula de dues files) | Una llibreta costa 3 euros. La Nora compra 4 llibretes. Quants euros paga? |

Cada esquema té el seu diagrama: barres per als cinc primers i una taula per a la Proporció.

## Nivells

| Nivell | El que no saps | Nombres |
|---|---|---|
| N1 | El resultat (`12 + 5 = ?`) | fins a 20 |
| N2 | El canvi o una part (`12 + ? = 17`) | fins a 50 |
| N3 | El principi (`? + 5 = 17`) | fins a 100 |
| N4 | Paraules que enganyen: el text diu «més» i cal restar | fins a 100 |

Hi ha **127 plantilles**: com a mínim 6 per esquema a N1, N2 i N3, i 3 per esquema a N4. Els noms i els nombres canvien a cada problema. Els problemes de dos passos (N5) no són a la v1.

## Els cinc passos (sempre iguals i al mateix lloc)

1. **Llegeix.** L'enunciat, amb els nombres en fitxes.
2. **Quin tipus?** Una targeta per esquema, amb una icona i un diagrama petit. Si s'equivoca, li diu la pregunta que distingeix els dos tipus («Canvia alguna quantitat amb el temps?»).
3. **Omple el diagrama.** Posa cada nombre i el «?» al seu lloc: tocar la fitxa i després la casella, arrossegar, o teclat (Tab, Retorn; Esc deixa la fitxa; Retrocés o Supr buiden la casella). Diu quina casella està malament.
4. **Quina operació?** Del diagrama surt l'operació (`+ − · :`); l'alumne la tria i l'escriu.
5. **Respon.** Calcula i completa la frase de la resposta, amb les unitats («La Laia té ___ cromos.»).

Al final: «Has fet 10 problemes. 7 a la primera.» No dona cap codi de verificació.

## Perfils

| Perfil | Què canvia |
|---|---|
| `tea` | Cap animació; a cada pas, una línia «Ara… Després…» que diu què passarà; la pantalla no canvia de forma |
| `tdah` | Tandes de 5 problemes; un pas a la vegada; temporitzador opcional (un disc que es buida, sense nombres ni so) |
| `dil` | Nombres fins a 20 a tots els nivells; com a molt 2 targetes a «Quin tipus?»; imatges al costat de les paraules |
| (cap) | ESO |

Les imatges són emojis del sistema (no cal cap descàrrega ni cap atribució).

## Adreces

`problemes.html?esquemes=canvi,combinacio&nivell=2&perfil=tea&n=10&fixed=A`

| Paràmetre | Valors | Per defecte |
|---|---|---|
| `esquemes` | els sis valors de la taula, separats per comes | tots sis |
| `nivell` | `1` a `4` | `1` |
| `perfil` | `tea`, `tdah`, `dil` | cap |
| `n` | `5` a `20` (amb `tdah`, sempre 5) | `10` |
| `fixed` | `A`, `B`, `C`: tota la classe té els mateixos problemes | a l'atzar |
| `pictos` | `1` (imatges) o `0` | `1` amb `dil`, `0` amb la resta |
| `temporitzador` | `1` a `10` minuts per problema | sense |

Els valors estranys s'ignoren. El generador (`index.html`) fa aquests enllaços.

## Lectura fàcil

Els enunciats segueixen unes normes que comprova un test (`js/motor/lectura.js`):

- com a molt 15 paraules per frase;
- a N1 i N2, com a molt 3 frases i cap subordinada (`que`, `perquè`, `si`, `quan`, `mentre`…);
- en present, sense passiva ni doble negació, amb els nombres en xifres;
- només els noms de la llista (`data/noms.js`) i les paraules del lèxic controlat (`data/lexic.js`).

## Com provar-ho a l'ordinador

No cal instal·lar res: obre `index.html` o `problemes.html` amb doble clic. No fa cap petició a internet ni desa res.

## Com està fet

HTML, CSS i JavaScript sense compilació, amb scripts clàssics perquè funcioni amb doble clic.

```
index.html               generador d'enllaços per al professorat
problemes.html           la pàgina de l'alumne
css/tokens.css           colors (clar i fosc)
css/esquemes.css         estils (perfils, mòbil, impressió)
data/plantilles.js       les plantilles dels problemes
data/noms.js             els noms de les persones
data/pictos.js           les imatges (emojis) de cada paraula
data/paraules-clau.js    paraules que fan pensar en una operació («més», «menys»…)
data/lexic.js            el lèxic controlat
js/motor/atzar.js        atzar amb llavor (el de prova1eso)
js/motor/esquemes.js     els sis esquemes: equacions, posició de la incògnita, operació
js/motor/generador.js    fa els problemes a partir de les plantilles; sèries sense repetits
js/motor/lectura.js      normes de lectura fàcil i paraules trampa
js/ui/textos.js          tots els textos de la pàgina de l'alumne
js/ui/diagrames.js       els diagrames de barres i les taules
js/ui/app.js             el controlador dels cinc passos
js/ui/enllacos.js        el generador d'enllaços
tools/versio.py          posa al dia els ?v= dels CSS i JS
```

## Tests

```
node tests/run-all.js
```

| Fitxer | Què comprova |
|---|---|
| `tests/plantilles.test.js` | Cada plantilla: 200 problemes amb llavor compleixen l'equació de l'esquema (recalculada a part), resposta entera i positiva, les condicions; sèries sense repetits i amb els esquemes repartits; lectura fàcil i lèxic; que `trampaParaulaClau` diu la veritat; quantes plantilles hi ha per esquema i nivell |
| `tests/repo.test.js` | Que tot fitxer citat existeix, l'ordre dels scripts, cap adreça externa, cap mòdul ES ni `fetch` (doble clic), cap `Math.random`, textos curts |
| `tools/versio.py --comprova` | Que cap `?v=` és vell |
| `tests/docs_vs_codi.py` | Que aquest README diu el mateix que el codi (esquemes, nivells, plantilles, passos, perfils) |

GitHub els passa a cada pujada a `main` (`.github/workflows/tests.yml`).

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
