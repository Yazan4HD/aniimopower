import json
import os
import math
from PIL import Image, ImageDraw, ImageFont

# Element Colors (primary, secondary, highlight)
ELEMENT_THEMES = {
    "Fire": ((204, 82, 49), (249, 115, 22), (254, 215, 170)),
    "Water": ((44, 94, 179), (14, 165, 233), (186, 230, 253)),
    "Grass": ((52, 127, 63), (34, 197, 94), (187, 247, 208)),
    "Lightning": ((217, 173, 38), (234, 179, 8), (254, 240, 138)),
    "Ice": ((43, 150, 194), (6, 182, 212), (207, 250, 254)),
    "Wind": ((46, 151, 128), (20, 184, 166), (204, 251, 241)),
    "Earth": ((146, 99, 57), (180, 83, 9), (254, 215, 170)),
    "Dark": ((98, 70, 169), (147, 51, 234), (233, 213, 255)),
    "Light": ((199, 144, 42), (245, 158, 11), (254, 243, 199)),
}

def draw_circle_avatar(aniimo, output_path):
    size = 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    element = aniimo.get("element", "Fire")
    is_prismana = aniimo.get("isPrismana", False)
    name = aniimo.get("name", "Aniimo")
    
    primary, secondary, highlight = ELEMENT_THEMES.get(element, ((100, 100, 100), (150, 150, 150), (220, 220, 220)))
    
    center = size // 2
    radius = size // 2 - 8
    
    # Outer Rainbow Ring for Prismana!
    if is_prismana:
        # Draw smooth conical rainbow border
        ring_thickness = 10
        steps = 180
        for i in range(steps):
            angle1 = (i / steps) * 360
            angle2 = ((i + 1.5) / steps) * 360
            # hue to RGB
            h_val = (i / steps) * 6.0
            c = 1.0
            x_col = c * (1 - abs(h_val % 2 - 1))
            if 0 <= h_val < 1: r, g, b = 255, int(x_col*255), 0
            elif 1 <= h_val < 2: r, g, b = int(x_col*255), 255, 0
            elif 2 <= h_val < 3: r, g, b = 0, 255, int(x_col*255)
            elif 3 <= h_val < 4: r, g, b = 0, int(x_col*255), 255
            elif 4 <= h_val < 5: r, g, b = int(x_col*255), 0, 255
            else: r, g, b = 255, 0, int(x_col*255)
            
            draw.arc(
                [center - radius, center - radius, center + radius, center + radius],
                start=angle1,
                end=angle2,
                fill=(r, g, b, 255),
                width=ring_thickness
            )
        inner_r = radius - ring_thickness
    else:
        # Elegant clean metallic element border
        border_thickness = 7
        draw.ellipse(
            [center - radius, center - radius, center + radius, center + radius],
            outline=primary + (255,),
            width=border_thickness
        )
        inner_r = radius - border_thickness
        
    # Draw Inner Radial-like Gradient
    for r in range(inner_r, 0, -2):
        t = r / inner_r # 1.0 at outer, 0.0 at center
        # Center is brighter secondary/highlight, edges are deeper primary
        cr = int(primary[0] * t + secondary[0] * (1 - t) * 0.8)
        cg = int(primary[1] * t + secondary[1] * (1 - t) * 0.8)
        cb = int(primary[2] * t + secondary[2] * (1 - t) * 0.8)
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(cr, cg, cb, 255))
        
    # Subtle inner decorative rune ring
    draw.ellipse([center - inner_r + 14, center - inner_r + 14, center + inner_r - 14, center + inner_r - 14], outline=highlight + (100,), width=1)
    
    # Emblem / Silhouette in center
    # Draw stylized creature crest
    initials = "".join([w[0] for w in name.split() if w])[:2].upper()
    if not initials:
        initials = name[:2].upper()
        
    # Draw stylized central emblem shape
    cx, cy = center, center - 6
    # Stylized polygon
    poly_pts = [
        (cx, cy - 44),
        (cx + 36, cy - 14),
        (cx + 28, cy + 38),
        (cx - 28, cy + 38),
        (cx - 36, cy - 14)
    ]
    draw.polygon(poly_pts, fill=(18, 20, 45, 180), outline=highlight + (220,))
    
    # Text Initials
    try:
        font = ImageFont.truetype("arial.ttf", 36)
        font_sub = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    bbox = draw.textbbox((0, 0), initials, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw // 2, cy - th // 2 - 2), initials, font=font, fill=(255, 255, 255, 255))
    
    # Bottom badge with Element or Prismana
    tag_text = "PRISMANA" if is_prismana else element.upper()
    tag_bg = (244, 63, 94, 230) if is_prismana else primary + (230,)
    tag_w = 90 if is_prismana else 74
    tag_h = 22
    tag_y = center + 58
    
    draw.rounded_rectangle(
        [center - tag_w // 2, tag_y, center + tag_w // 2, tag_y + tag_h],
        radius=10,
        fill=tag_bg,
        outline=highlight + (200,)
    )
    tbbox = draw.textbbox((0, 0), tag_text, font=font_sub)
    ttw = tbbox[2] - tbbox[0]
    tth = tbbox[3] - tbbox[1]
    draw.text((center - ttw // 2, tag_y + (tag_h - tth) // 2 - 1), tag_text, font=font_sub, fill=(255, 255, 255, 255))
    
    img.save(output_path, "PNG")

def draw_held_item(item, output_path):
    size = 256
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = size // 2 - 10
    
    # Outer item frame
    draw.ellipse([center - radius, center - radius, center + radius, center + radius], fill=(24, 28, 54, 255), outline=(217, 173, 38, 255), width=6)
    draw.ellipse([center - radius + 10, center - radius + 10, center + radius - 10, center + radius - 10], outline=(147, 51, 234, 160), width=2)
    
    item_id = item["id"]
    try:
        font_main = ImageFont.truetype("arial.ttf", 20)
        font_initials = ImageFont.truetype("arial.ttf", 46)
        font_sub = ImageFont.truetype("arial.ttf", 13)
    except:
        font_main = ImageFont.load_default()
        font_initials = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    initials = "".join([w[0] for w in item["name"].split() if w])[:2].upper()
    
    # Draw item icon shape
    draw.ellipse([center - 46, center - 46, center + 46, center + 46], fill=(217, 173, 38, 50), outline=(234, 179, 8, 220), width=3)
    
    ibbox = draw.textbbox((0, 0), initials, font=font_initials)
    iw = ibbox[2] - ibbox[0]
    ih = ibbox[3] - ibbox[1]
    draw.text((center - iw // 2, center - ih // 2 - 4), initials, font=font_initials, fill=(255, 225, 120, 255))
    
    # Item bottom ribbon
    draw.rounded_rectangle([center - 95, center + 55, center + 95, center + 82], radius=8, fill=(18, 20, 40, 240), outline=(217, 173, 38, 200))
    boss_text = item["alphaBoss"].replace("Alpha ", "")
    b_bbox = draw.textbbox((0, 0), f"Boss: {boss_text}", font=font_sub)
    bw = b_bbox[2] - b_bbox[0]
    draw.text((center - bw // 2, center + 61), f"Boss: {boss_text}", font=font_sub, fill=(254, 240, 138, 255))
    
    img.save(output_path, "PNG")

# Generate all Aniimo avatars
with open('src/data/aniimos.json', 'r', encoding='utf-8') as f:
    aniimos = json.load(f)

print(f"Generating high-resolution circular avatars for {len(aniimos)} Aniimos...")
for a in aniimos:
    out_path = f"public/images/aniimos/{a['slug']}.png"
    draw_circle_avatar(a, out_path)
    a["image"] = f"/images/aniimos/{a['slug']}.png"

# Update aniimos.json with accurate image paths
with open('src/data/aniimos.json', 'w', encoding='utf-8') as f:
    json.dump(aniimos, f, indent=2, ensure_ascii=False)

# Generate held items
with open('src/data/held_items.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Generating high-resolution icons for {len(items)} Held Items...")
for it in items:
    out_path = f"public/images/items/{it['id']}.png"
    draw_held_item(it, out_path)
    it["icon"] = f"/images/items/{it['id']}.png"

with open('src/data/held_items.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print("All avatar and held item assets successfully generated!")
