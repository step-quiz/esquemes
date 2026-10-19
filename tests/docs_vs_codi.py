#!/usr/bin/env python3
"""
PROJECTE: esquemes (Step Quiz, vanilla JS)
FITXER: tests/docs_vs_codi.py
ROL: Que el README diu el mateix que el codi:
  - les rutes entre `cometes` del README existeixen;
  - els sis esquemes (nom i valor de l'adreça) són els de js/motor/esquemes.js;
  - els nivells i els màxims són els de js/motor/generador.js;
  - el nombre de plantilles i els mínims per esquema i nivell són els de data/plantilles.js;
  - els cinc passos, els perfils i les normes de lectura fàcil són els del codi.
ÚS: python3 tests/docs_vs_codi.py   (només biblioteca estàndard)
"""
import pathlib
import re
import sys
from collections import Counter

ARREL = pathlib.Path(__file__).resolve().parent.parent
llegeix = lambda rel: (ARREL / rel).read_text(encoding='utf-8')
errors = []


def comprova(cond, msg):
    if not cond:
        errors.append(msg)


readme = llegeix('README.md')

# 1. Rutes citades
for ruta in re.findall(r'`([^`\s#]+\.(?:js|css|html|py|yml|md))(?:\?[^`]*)?`', readme):
    if ruta.startswith('.github/'):
        continue  # els workflows es creen des del web de GitHub
    comprova((ARREL / ruta).exists(), f'README.md cita `{ruta}`, que no existeix')

# 2. Esquemes
esq = llegeix('js/motor/esquemes.js')
ids = re.findall(r"^        (\w+): \{\n            nom: '([^']+)'", esq, re.M)
comprova(len(ids) == 6, f'js/motor/esquemes.js: esperava 6 esquemes i n’he trobat {len(ids)}')
for clau, nom in ids:
    nom = nom.replace('’', "'")
    comprova(f'| {nom} | `{clau}` |' in readme.replace('’', "'"), f'README.md: la taula d’esquemes no té «{nom}» (`{clau}`)')

# 3. Nivells i màxims
gen = llegeix('js/motor/generador.js')
maxim = dict(re.findall(r'(\d): (\d+)', re.search(r'var MAXIM = \{([^}]*)\}', gen).group(1)))
for n in range(1, 5):
    fila = re.search(rf'^\| N{n} \|.*\| fins a (\d+) \|$', readme, re.M)
    comprova(fila is not None, f'README.md: la taula de nivells no té N{n}')
    if fila:
        comprova(fila.group(1) == maxim[str(n)], f'README.md: N{n} va fins a {maxim[str(n)]}, no {fila.group(1)}')
comprova('| N5 |' not in readme, 'README.md: N5 no és a la v1')
dil = re.search(r'MAXIM_DIL = (\d+)', gen).group(1)
comprova(f'Nombres fins a {dil} a tots els nivells' in readme, f'README.md: el perfil dil va fins a {dil}')

# 4. Plantilles
plant = llegeix('data/plantilles.js')
crides = re.findall(r"P\(\s*'[^']+',\s*'(\w+)',\s*(\d)", plant)
comprova(f'**{len(crides)} plantilles**' in readme, f'README.md: hi ha {len(crides)} plantilles')
per = Counter(crides)
min13 = min(per[(e, str(n))] for e, _ in ids for n in (1, 2, 3))
min4 = min(per[(e, '4')] for e, _ in ids)
comprova(f'com a mínim {min13} per esquema a N1, N2 i N3' in readme, f'README.md: el mínim a N1–N3 és {min13}')
comprova(f'{min4} per esquema a N4' in readme, f'README.md: a N4 n’hi ha {min4} per esquema')

# 5. Passos, perfils, lectura fàcil
textos = llegeix('js/ui/textos.js')
passos = re.findall(r"'([^']+)'", re.search(r'passos: \[([^\]]*)\]', textos).group(1))
for i, p in enumerate(passos, 1):
    comprova(f'{i}. **{p}' in readme, f'README.md: el pas {i} és «{p}»')
app = llegeix('js/ui/app.js')
perfils = re.findall(r"'(\w+)'", re.search(r'var PERFIL = \[([^\]]*)\]', app).group(1))
for p in perfils:
    comprova(f'| `{p}` |' in readme, f'README.md: la taula de perfils no té `{p}`')
lect = llegeix('js/motor/lectura.js')
mp = re.search(r'MAX_PARAULES = (\d+)', lect).group(1)
mf = re.search(r'MAX_FRASES_N12 = (\d+)', lect).group(1)
comprova(f'com a molt {mp} paraules per frase' in readme, f'README.md: el màxim és {mp} paraules per frase')
comprova(f'com a molt {mf} frases' in readme, f'README.md: a N1–N2, com a molt {mf} frases')

if errors:
    print(f'✗ esquemes: {len(errors)} discrepàncies entre la documentació i el codi:')
    for e in errors:
        print('  - ' + e)
    sys.exit(1)
print('✓ esquemes: la documentació quadra amb el codi.')
