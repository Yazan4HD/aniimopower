import cv2
import json
import os
import re
import numpy as np
from PIL import Image
import easyocr

print("Initializing EasyOCR reader...")
reader = easyocr.Reader(['en'], gpu=False)

print("Loading aniimo_power_cards final.png...")
full_img = Image.open('aniimo_power_cards final.png')
w_total, h_total = full_img.size
print(f"Image dimensions: {w_total}x{h_total}")

# Create output dirs
os.makedirs('public/images/aniimos', exist_ok=True)
os.makedirs('public/images/items', exist_ok=True)

# Detect all cards using thresholding
cv_img = cv2.imread('aniimo_power_cards final.png')
gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(gray, 248, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in contours:
    x, y, cw, ch = cv2.boundingRect(c)
    if cw > 400 and ch > 300 and y > 1100:
        boxes.append((x, y, cw, ch))

# Sort top to bottom, left to right
boxes.sort(key=lambda b: (b[1], b[0]))

# Group into rows
rows = []
curr_row = []
curr_y = None
for b in boxes:
    if curr_y is None or abs(b[1] - curr_y) < 40:
        curr_row.append(b)
        curr_y = b[1]
    else:
        rows.append(curr_row)
        curr_row = [b]
        curr_y = b[1]
if curr_row:
    rows.append(curr_row)

print(f"Grouped {len(boxes)} cards into {len(rows)} rows.")

ELEMENT_RANGES = [
    (0, 2200, "Fire"),
    (2200, 5100, "Water"),
    (5100, 6800, "Grass"),
    (6800, 8300, "Lightning"),
    (8300, 9900, "Ice"),
    (9900, 12000, "Wind"),
    (12000, 13600, "Earth"),
    (13600, 15200, "Dark"),
    (15200, 99999, "Light"),
]

def get_element(y):
    for y_min, y_max, el in ELEMENT_RANGES:
        if y_min <= y < y_max:
            return el
    return "Normal"

PERSONALITIES = [
    "ESTP", "ESFP", "ISTJ", "ISFJ", "INTJ", "INTP", "ENTP", "ENTJ",
    "ENFP", "ENFJ", "INFJ", "INFP", "ISTP", "ISFP", "ESTJ", "ESFJ"
]

HELD_ITEMS = [
    "Echoing Grimoire", "Ferocious Fang", "Miraculous Fleece",
    "Spirited Feather", "Fission Needles", "Gargantuan Horn",
    "Heartseeker Pendant", "Heritage Amulet", "Explosive Gloves"
]

ALPHA_BOSSES = [
    "Alpha Ignitis", "Alpha Irisal", "Alpha Grizbo",
    "Alpha Geoclaw", "Alpha Minespine"
]

STATS = ["Attack", "Regen", "Break", "P.Def", "M.Def", "HP", "Counter Boost", "Defense", "Speed"]

aniimos = []
card_counter = 0

for r_idx, row in enumerate(rows):
    print(f"\n--- Processing Row {r_idx + 1}/{len(rows)} (y={row[0][1]}) ---")
    for c_idx, (x, y, cw, ch) in enumerate(row):
        card_counter += 1
        card_crop = full_img.crop((x, y, x + cw, y + ch))
        
        # Crop circular avatar
        # Avatar is at roughly (12, 12) to (132, 132)
        avatar_crop = card_crop.crop((12, 12, 134, 134))
        
        # OCR the text region of the card
        # Downscale slightly for speed and smooth text
        text_crop = card_crop.crop((130, 10, cw, ch - 10))
        # Save temp image for easyocr
        temp_path = f"temp_card_{r_idx}_{c_idx}.png"
        text_crop.save(temp_path)
        
        ocr_res = reader.readtext(temp_path)
        try:
            os.remove(temp_path)
        except:
            pass
        
        raw_texts = [item[1].strip() for item in ocr_res if item[1].strip()]
        full_text_str = " ".join(raw_texts)
        
        element = get_element(y)
        
        # Check Prismana
        is_prismana = False
        if any("prism" in t.lower() for t in raw_texts):
            is_prismana = True
        else:
            # Check top right corner for rainbow badge
            badge_crop = card_crop.crop((cw - 120, 10, cw - 5, 80))
            badge_arr = np.array(badge_crop)
            if badge_arr.shape[2] >= 3:
                hsv = cv2.cvtColor(badge_arr, cv2.COLOR_RGB2HSV)
                # check saturation
                sat = hsv[:, :, 1]
                if (sat > 100).sum() > 300: # saturated colorful badge
                    is_prismana = True
                    
        # Check if Version 1.1
        is_v11 = False
        if any("1.1" in t or "new in" in t.lower() or "build not published" in t.lower() or "role" in t.lower() for t in raw_texts):
            is_v11 = True
            
        version = "1.1" if is_v11 else "1.0"
        
        # Find name
        # Filter out system tags
        filtered_lines = [
            t for t in raw_texts
            if not any(k in t.lower() for k in ["new in", "1.1", "prismana", "build not published", "final form", "stage", "best personality"])
        ]
        
        name = filtered_lines[0] if filtered_lines else f"Aniimo_{card_counter}"
        # Clean name
        name = re.sub(r'[^a-zA-Z0-9\s\-]', '', name).strip()
        
        # Find stage
        stage = "Single stage"
        for t in raw_texts:
            if "stage" in t.lower():
                stage = t
                break
                
        # Generate slug
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        if not slug:
            slug = f"aniimo-{card_counter}"
            
        # If slug already exists, make unique
        existing_slugs = [a["slug"] for a in aniimos]
        final_slug = slug
        dup_count = 1
        while final_slug in existing_slugs:
            dup_count += 1
            final_slug = f"{slug}-{dup_count}"
            
        avatar_filename = f"{final_slug}.png"
        avatar_crop.save(f"public/images/aniimos/{avatar_filename}")
        
        data = {
            "id": f"aniimo-{card_counter:03d}",
            "slug": final_slug,
            "name": name,
            "element": element,
            "version": version,
            "stage": stage,
            "isPrismana": is_prismana,
            "image": f"/images/aniimos/{avatar_filename}",
            "cardIndex": card_counter,
            "row": r_idx + 1,
            "col": c_idx + 1,
            "rawTexts": raw_texts
        }
        
        if not is_v11:
            # v1.0 format
            # Final Form
            is_final = any("final" in t.lower() for t in raw_texts)
            data["isFinalForm"] = is_final
            
            # Personality
            personality = None
            for p in PERSONALITIES:
                if any(p in t for t in raw_texts):
                    personality = p
                    break
            data["personality"] = personality or "Balanced"
            
            # Held item & boss
            found_item = None
            for item in HELD_ITEMS:
                if any(item.lower() in t.lower() or item.split()[0].lower() in t.lower() for t in raw_texts):
                    found_item = item
                    break
            data["heldItem"] = found_item or "Echoing Grimoire"
            
            found_boss = None
            for b in ALPHA_BOSSES:
                if any(b.lower() in t.lower() or b.split()[1].lower() in t.lower() for t in raw_texts):
                    found_boss = b
                    break
            data["alphaBoss"] = found_boss or "Alpha Ignitis"
            
            # Awakening focus
            awakening = []
            for s in STATS:
                if any(s.lower() in t.lower() for t in raw_texts):
                    awakening.append(s)
            data["awakeningFocus"] = list(set(awakening)) if awakening else ["Attack"]
            
            # Skills
            skills = []
            for t in filtered_lines[1:]:
                if any(k in t.lower() for k in ["awakening", "alpha", "focus", "attack", "regen", "break"]):
                    continue
                if found_item and found_item.lower() in t.lower():
                    continue
                if len(t) > 3 and not any(p in t for p in PERSONALITIES):
                    skills.append(t)
            data["skills"] = skills[:2] if len(skills) >= 2 else (skills + ["Basic Attack"])[:2]
        else:
            # v1.1 format
            # Role
            role = "DPS"
            for t in raw_texts:
                if "role" in t.lower() or any(r in t.lower() for r in ["support", "dps", "tank", "breaker", "buffer", "healer"]):
                    for r in ["support", "dps", "tank", "breaker", "buffer", "healer"]:
                        if r in t.lower():
                            role = r.capitalize()
                            break
            data["role"] = role
            
            # Evolution info
            evo = None
            for t in raw_texts:
                if "evolve" in t.lower() or "lv:" in t.lower() or "lv " in t.lower():
                    evo = t
                    break
            data["evolution"] = evo or "Evolves through level progression"
            
            # Location / How to get
            loc_parts = []
            for t in filtered_lines[1:]:
                if any(k in t.lower() for k in ["role", "evolve", "lv:", "support", "dps", "tank", "breaker", "build not published"]):
                    continue
                if len(t) > 4:
                    loc_parts.append(t)
            data["location"] = ", ".join(loc_parts) if loc_parts else "Special Habitat Region"
            
        aniimos.append(data)
        print(f" Card {card_counter:02d}: {data['name']} ({element}, v{version}, Prismana: {is_prismana})")

# Write out JSON
with open('src/data/aniimos.json', 'w', encoding='utf-8') as f:
    json.dump(aniimos, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully extracted all {len(aniimos)} Aniimo cards into src/data/aniimos.json!")

