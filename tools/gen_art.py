"""Generate the site's pixel-art textures from scratch (no game assets).

Outputs:
  assets/img/landscape.png  blocky landscape, blurred in CSS behind every screen
  assets/img/stone.png      tiling stone texture for buttons

Run: python3 tools/gen_art.py   (needs Pillow)
"""
import random
from pathlib import Path
from PIL import Image

OUT = Path(__file__).resolve().parent.parent / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)
rng = random.Random(2027)


def jitter(rgb, amt):
    return tuple(max(0, min(255, c + rng.randint(-amt, amt))) for c in rgb)


def landscape(w=240, h=150):
    im = Image.new("RGB", (w, h))
    px = im.load()
    # sky: banded, lighter toward the horizon
    top, bottom = (92, 138, 214), (176, 205, 240)
    for y in range(h):
        t = min(1, y / (h * 0.62))
        band = round(t * 7) / 7
        c = tuple(int(top[i] + (bottom[i] - top[i]) * band) for i in range(3))
        for x in range(w):
            px[x, y] = c
    # sun, square
    for y in range(10, 26):
        for x in range(150, 166):
            px[x, y] = (255, 250, 214)
    # clouds: flat blocky slabs
    for cx, cy, cw, ch in [(8, 18, 34, 5), (60, 30, 22, 4), (110, 12, 40, 6),
                           (190, 26, 30, 5), (170, 48, 26, 3), (20, 54, 20, 3)]:
        for y in range(cy, cy + ch):
            for x in range(cx, min(w, cx + cw)):
                px[x, y] = (240, 244, 250)
        for x in range(cx + 4, min(w, cx + cw - 3)):
            px[x, cy - 1] = (240, 244, 250)
    # far hills
    horizon = int(h * 0.52)
    height = 0
    for x in range(w):
        if x % 6 == 0:
            height = max(0, min(10, height + rng.choice([-2, -1, 0, 1, 2])))
        for y in range(horizon - height, h):
            px[x, y] = jitter((70, 112, 74), 6)
    # river cutting across the lower left
    for y in range(horizon + 6, h):
        t = (y - horizon) / (h - horizon)
        x0 = int(-10 + t * 30)
        x1 = int(30 + t * 70)
        for x in range(max(0, x0), min(w, x1)):
            px[x, y] = jitter((52, 76, 190), 8)
    # dirt bank next to the river
    for y in range(horizon + 4, horizon + 22):
        for x in range(0, 60):
            if px[x, y][2] < 150 and rng.random() < 0.8:
                px[x, y] = jitter((120, 86, 58), 10)
    # near grass field
    for y in range(horizon + 10, h):
        for x in range(w):
            if px[x, y][2] > 150:
                continue
            shade = 0.75 + 0.35 * (y - horizon) / (h - horizon)
            base = (int(78 * shade), int(126 * shade), int(52 * shade))
            px[x, y] = jitter(base, 10)
    # oak trees: trunk + leaf blob (right side, and a couple on the left)
    for tx, ty, s in [(204, horizon - 30, 36), (236, horizon - 16, 22), (172, horizon - 6, 12),
                      (10, horizon - 10, 16), (40, horizon - 4, 10), (120, horizon - 1, 6)]:
        for y in range(ty + s // 2, ty + s + 8):
            for x in range(tx - 1, tx + 2):
                if 0 <= x < w and 0 <= y < h:
                    px[x, y] = (84, 62, 38)
        for y in range(ty - s // 2, ty + s // 2 + 2):
            for x in range(tx - s // 2 - 2, tx + s // 2 + 3):
                if 0 <= x < w and 0 <= y < h and rng.random() < 0.93:
                    px[x, y] = jitter((38, 78, 34), 9)
    # tall grass tufts in the foreground
    for _ in range(500):
        x = rng.randrange(w)
        y = rng.randrange(horizon + 20, h)
        if px[x, y][2] > 150:
            continue
        for k in range(rng.randint(2, 5)):
            if y - k >= 0:
                px[x, y - k] = jitter((96, 150, 64), 12)
    return im.resize((w * 2, h * 2), Image.NEAREST)


def stone(size=16):
    im = Image.new("RGB", (size, size))
    px = im.load()
    for y in range(size):
        for x in range(size):
            v = rng.choice([118, 122, 126, 130, 112, 138, 106])
            px[x, y] = (v, v, v)
    # a few darker pebbles
    for _ in range(7):
        x, y = rng.randrange(size), rng.randrange(size)
        px[x, y] = (92, 92, 92)
        px[(x + 1) % size, y] = (98, 98, 98)
    return im


landscape().save(OUT / "landscape.png", optimize=True)
stone().save(OUT / "stone.png", optimize=True)
print("wrote", [p.name for p in OUT.iterdir()])
