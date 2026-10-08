"""Pixel gold crown (the glory symbol) -> favicon.ico/png/svg, apple-touch-icon,
and the web-manifest icons. Original drawing; run: python3 tools/gen_icons.py"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TEAL = (0, 128, 128, 255)

# 16x16. o outline, G gold, L highlight, D shade, R ruby, B sapphire, W glint
CROWN = [
    "................",
    ".oo....oo....oo.",
    "oRRo..oRRo..oRRo",
    "oWRo..oWRo..oWRo",
    ".oGo.oLGGDo.oGo.",
    ".oGGoLGGGGDoGDo.",
    ".oLGGGGGGGGGGDo.",
    ".oLGGGGGGGGGGDo.",
    ".oLGRGGBBGGRGDo.",
    ".oLGGGGBBGGGGDo.",
    ".oLGGGGGGGGGGDo.",
    ".oDDDDDDDDDDDDo.",
    ".oLLLLLLLLLLLLo.",
    ".oDDDDDDDDDDDDo.",
    ".oooooooooooooo.",
    "................",
]
PAL = {
    "o": "#3a2400", "G": "#f2c230", "L": "#ffe680", "D": "#c48a12",
    "R": "#d6303a", "B": "#3a7bd5", "W": "#ffd0d0",
}


def rgba(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (255,)


def crown(scale=1, size=None, bg=None):
    n = len(CROWN)
    side = size or n * scale
    img = Image.new("RGBA", (side, side), bg or (0, 0, 0, 0))
    off = (side - n * scale) // 2
    for y, row in enumerate(CROWN):
        for x, ch in enumerate(row):
            if ch in PAL:
                for dy in range(scale):
                    for dx in range(scale):
                        img.putpixel((off + x * scale + dx, off + y * scale + dy), rgba(PAL[ch]))
    return img


def svg():
    rects = []
    for y, row in enumerate(CROWN):
        x = 0
        while x < len(row):
            ch = row[x]
            if ch not in PAL:
                x += 1
                continue
            w = 1
            while x + w < len(row) and row[x + w] == ch:
                w += 1
            rects.append(f'<rect x="{x}" y="{y}" width="{w}" height="1" fill="{PAL[ch]}"/>')
            x += w
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">'
            + "".join(rects) + "</svg>\n")


def main():
    (ROOT / "favicon.svg").write_text(svg())
    crown(2).save(ROOT / "favicon-32x32.png")
    crown(1).save(ROOT / "favicon-16x16.png")
    # .ico holds 16/32/48, each an exact integer upscale so pixels stay crisp
    crown(3).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
                  append_images=[crown(1), crown(2)])
    # iOS fills transparency with black, so home-screen/iMessage icons get the desktop teal
    crown(9, 180, TEAL).convert("RGB").save(ROOT / "apple-touch-icon.png")
    crown(10, 192, TEAL).convert("RGB").save(ROOT / "assets/og/icon-192.png")
    crown(28, 512, TEAL).convert("RGB").save(ROOT / "assets/og/icon-512.png")
    # handy for the OG card generator
    (ROOT / "assets/og/crown.svg").write_text(svg())


if __name__ == "__main__":
    main()
