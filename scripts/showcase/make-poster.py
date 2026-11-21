import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = (
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        ]
        if bold
        else [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        ]
    )
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size=size)
    return ImageFont.load_default()


def main() -> None:
    src_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2])
    label = sys.argv[3]

    base = Image.open(src_path).convert("RGBA")
    w, h = base.size

    font = load_font(23, bold=True)
    probe = ImageDraw.Draw(base)
    bbox = probe.textbbox((0, 0), label, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    circle_d = 46
    pad_x = 22
    gap = 16
    pill_w = pad_x + circle_d + gap + text_w + pad_x + 6
    pill_h = 74
    pill_x = (w - pill_w) // 2
    pill_y = (h - pill_h) // 2

    # Soft drop shadow
    shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        [pill_x, pill_y + 8, pill_x + pill_w, pill_y + pill_h + 8],
        radius=pill_h // 2,
        fill=(0, 0, 0, 115),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(16))
    base = Image.alpha_composite(base, shadow)

    # Frosted dark pill overlay
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill=(15, 17, 24, 228),
        outline=(255, 255, 255, 62),
        width=2,
    )

    # Blue play circle + white triangle
    cx = pill_x + pad_x + circle_d // 2
    cy = pill_y + pill_h // 2
    r = circle_d // 2
    odraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(0, 113, 227, 255))
    tri = [
        (cx - 5, cy - 9),
        (cx - 5, cy + 9),
        (cx + 10, cy),
    ]
    odraw.polygon(tri, fill=(255, 255, 255, 255))

    # Crisp label
    tx = pill_x + pad_x + circle_d + gap
    ty = cy - text_h // 2 - bbox[1]
    odraw.text((tx, ty), label, font=font, fill=(248, 249, 252, 255))

    final_img = Image.alpha_composite(base, overlay).convert("RGB")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    final_img.save(out_path, format="PNG", optimize=True)
    print(f"[poster] Saved {out_path} ({w}x{h})")


if __name__ == "__main__":
    main()
