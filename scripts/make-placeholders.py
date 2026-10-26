"""Generate atmospheric placeholder photos until the real As We Go photos are dropped in.

Usage: python3 scripts/make-placeholders.py
Every file in src/assets/photos/ is replaced 1:1 by a real photo with the same name.
"""
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "photos")
os.makedirs(OUT, exist_ok=True)
MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

PALETTES = {
    # sky_top, sky_horizon, hills, ground_far, ground_near, dust
    "dawn": ((52, 58, 66), (214, 188, 150), (70, 78, 62), (150, 82, 50), (96, 44, 28), (232, 205, 170)),
    "mist": ((150, 156, 160), (214, 214, 208), (120, 128, 118), (170, 150, 128), (98, 84, 70), (236, 234, 228)),
    "jungle": ((40, 58, 40), (150, 168, 112), (34, 56, 30), (140, 70, 40), (78, 36, 20), (210, 170, 120)),
    "golden": ((70, 50, 34), (236, 170, 90), (90, 64, 40), (176, 96, 52), (90, 44, 22), (250, 210, 150)),
    "night": ((8, 8, 10), (40, 34, 36), (16, 16, 18), (60, 30, 24), (20, 12, 10), (220, 60, 50)),
}


def lerp(a, b, t):
    return np.asarray(a, float) * (1 - t) + np.asarray(b, float) * t


def landscape(w, h, pal, seed, horizon=0.55):
    rng = np.random.default_rng(seed)
    sky_top, sky_hor, hills, g_far, g_near, dust = PALETTES[pal]
    y = np.linspace(0, 1, h)[:, None, None]
    img = np.zeros((h, w, 3))
    hy = horizon
    sky = lerp(sky_top, sky_hor, np.clip(y / hy, 0, 1) ** 1.4)
    ground = lerp(g_far, g_near, np.clip((y - hy) / (1 - hy), 0, 1) ** 0.8)
    img[:] = np.where(y < hy, sky, ground)
    x = np.linspace(0, 1, w)
    for layer, (amp, col_t) in enumerate(((0.08, 0.35), (0.05, 0.0))):
        ph = rng.uniform(0, 6.28, 3)
        ridge = hy - amp * (0.6 + 0.4 * np.sin(x * 5 + ph[0]) * np.sin(x * 13 + ph[1]) + 0.2 * np.sin(x * 31 + ph[2]))
        mask = (np.arange(h)[:, None] / h > ridge[None, :]) & (np.arange(h)[:, None] / h < hy + 0.01)
        col = lerp(hills, sky_hor, col_t)
        img[mask] = col
    # tyre tracks
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    for _ in range(3):
        cx, k, off = rng.uniform(0.2, 0.8), rng.uniform(-1.2, 1.2), rng.uniform(-0.05, 0.05)
        track = np.abs(xx - (cx + k * np.clip(yy - hy, 0, None) ** 1.5 + off))
        m = (track < 0.004 + 0.02 * (yy - hy)) & (yy > hy + 0.04)
        img[m] *= 0.72
    # dust cloud + sun glow
    for _ in range(4):
        cx, cy, r = rng.uniform(0.25, 0.75), rng.uniform(hy - 0.08, hy + 0.12), rng.uniform(0.12, 0.3)
        d = np.exp(-(((xx - cx) * w / h) ** 2 + (yy - cy) ** 2) / (r * r))[..., None]
        img = lerp(img, dust, d * rng.uniform(0.25, 0.55))
    sx, sy = rng.uniform(0.2, 0.8), hy - 0.18
    glow = np.exp(-(((xx - sx) * w / h) ** 2 + (yy - sy) ** 2) / 0.05)[..., None]
    img = img + glow * 60
    return img


def portrait(w, h, pal, seed):
    rng = np.random.default_rng(seed)
    sky_top, sky_hor, hills, g_far, g_near, dust = PALETTES[pal]
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    img = lerp(sky_top, hills, yy[..., None] ** 1.2) * 1.0
    lx = rng.uniform(0.2, 0.8)
    light = np.exp(-(((xx - lx) * w / h) ** 2 + (yy - 0.3) ** 2) / 0.12)[..., None]
    img = lerp(img, sky_hor, light * 0.85)
    # head + shoulders silhouette
    hx = 0.5 + rng.uniform(-0.08, 0.08)
    ar = w / h
    head = (((xx - hx) * ar / 0.11) ** 2 + ((yy - 0.42) / 0.13) ** 2) < 1
    shoulders = (((xx - hx) * ar / 0.36) ** 2 + ((yy - 0.95) / 0.32) ** 2) < 1
    neck = (np.abs((xx - hx) * ar) < 0.05) & (yy > 0.48) & (yy < 0.66)
    sil = (head | shoulders | neck)[..., None]
    rim = lerp(g_near, dust, 0.15)
    img = np.where(sil, rim * 0.55, img)
    return img


def finish(arr, label, seed, blur=2.2):
    rng = np.random.default_rng(seed + 99)
    h, w, _ = arr.shape
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(float)
    yy, xx = np.mgrid[0:h, 0:w] / np.array([h, w])[:, None, None]
    vig = 1 - 0.55 * (((xx - 0.5) * 1.3) ** 2 + ((yy - 0.5) * 1.3) ** 2)[..., None]
    a = a * np.clip(vig, 0.35, 1)
    a = a + rng.normal(0, 9, (h, w, 1))
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(im)
    size = max(14, w // 70)
    f = ImageFont.truetype(MONO, size)
    d.text((size * 2, h - size * 3.2), f"PLACEHOLDER · {label}", font=f, fill=(255, 255, 255, 150))
    return im


PHOTOS = [
    # name, w, h, kind, palette, label
    ("hero-roost", 2400, 1500, "land", "golden", "01 · HERO · MOTOCROSS"),
    ("mechie-jungle-track", 1600, 2000, "land", "jungle", "02 · MOTOCROSS"),
    ("supercross-whip", 2000, 1334, "land", "dawn", "03 · SUPERCROSS"),
    ("rider-helmet-portrait", 1600, 2000, "port", "night", "04 · RIDER PORTRAIT"),
    ("launch-red-stage", 2000, 1334, "port", "night", "05 · MACHINES · LAUNCH"),
    ("cockpit-open-road", 1600, 2000, "land", "mist", "06 · MACHINES · RIDE"),
    ("misty-track", 2000, 1334, "land", "mist", "07 · MOTOCROSS"),
    ("rocket-rock-jump", 1600, 2000, "land", "dawn", "08 · SUPERCROSS"),
    ("linen-portrait", 1600, 2000, "port", "golden", "09 · PORTRAITS"),
    ("couple-garden", 1600, 2000, "port", "jungle", "10 · COUPLES"),
    ("onam-festive", 1600, 1600, "port", "golden", "11 · BRAND · FESTIVE"),
    ("foot-gala-25", 2000, 1334, "land", "jungle", "12 · EVENTS"),
    ("jackets-duo", 1600, 2000, "port", "dawn", "13 · PORTRAITS"),
    ("trail-ghat-ride", 2000, 1334, "land", "jungle", "14 · TRAIL RIDE"),
]

for i, (name, w, h, kind, pal, label) in enumerate(PHOTOS):
    seed = 1000 + i * 17
    arr = landscape(w, h, pal, seed, horizon=0.5 if h > w else 0.56) if kind == "land" else portrait(w, h, pal, seed)
    finish(arr, label, seed, blur=2.2 if kind == "land" else 7).save(os.path.join(OUT, f"{name}.jpg"), quality=86, optimize=True, progressive=True)
    print("wrote", name)
