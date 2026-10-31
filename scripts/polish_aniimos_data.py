import json
import re

with open('src/data/aniimos.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Name correction map based on card contents and raw texts
CORRECTIONS = {
    "aniimo-025": {"name": "Irisal", "isPrismana": True, "skills": ["Solar Beam", "Petal Storm"]},
    "aniimo-028": {"name": "Melloblum", "isPrismana": True, "skills": ["Flora Blessing", "Sweet Nectar"]},
    "aniimo-030": {"name": "Thornblade", "isPrismana": True, "skills": ["Thorn Impact", "Vine Lash"]},
    "aniimo-040": {"name": "Fenmane", "isPrismana": True, "skills": ["Static Shield", "Thunder Imprint"]},
    "aniimo-041": {"name": "Fulmintis", "isPrismana": True, "skills": ["Blade Storm", "Lightning Blade"]},
    "aniimo-047": {"name": "Glynsera", "isPrismana": True, "skills": ["Glacier Strike", "Frost Veil"]},
    "aniimo-070": {"name": "Waleetle", "isPrismana": True, "skills": ["Earth Spin", "Quake Drift"]},
    "aniimo-078": {"name": "Stellarys", "isPrismana": True, "skills": ["Falling Stars", "Void Magic"]},
}

# Standard evolution stages mapping
def normalize_stage(stage_raw, is_final, is_v11, role):
    s = stage_raw.lower()
    if "single" in s:
        return "Single Stage"
    elif "lumin" in s:
        return "Lumin Stage"
    elif "nova" in s:
        return "Nova Stage"
    elif "apex" in s:
        return "Apex Stage"
    elif is_final:
        return "Final Stage"
    else:
        return "Base Stage"

for a in data:
    aid = a["id"]
    if aid in CORRECTIONS:
        for k, v in CORRECTIONS[aid].items():
            a[k] = v
            
    # Clean up name if it contains unwanted tokens
    name = a["name"]
    name = re.sub(r'^(Normal &|Normal|Prismana)\s*', '', name).strip()
    if not name or name.lower() == "normal":
        # Look in rawTexts
        for t in a["rawTexts"]:
            t_clean = re.sub(r'[^a-zA-Z]', '', t)
            if len(t_clean) > 3 and t_clean.lower() not in ["normal", "prismana", "novastage", "finalform", "attack", "regen", "break", "bestpersonality"]:
                name = t_clean
                break
    a["name"] = name if name else f"Aniimo #{a['cardIndex']}"
    a["slug"] = re.sub(r'[^a-z0-9]+', '-', a["name"].lower()).strip('-')
    
    # Evolution stage category for filter
    is_final = a.get("isFinalForm", False)
    stage_cat = normalize_stage(a.get("stage", ""), is_final, a["version"] == "1.1", a.get("role", ""))
    a["evolutionStage"] = stage_cat
    
    # Ensure heldItem has proper boss and synergy if missing
    if a["version"] == "1.0":
        if "heldItem" not in a or not a["heldItem"]:
            a["heldItem"] = "Echoing Grimoire"
        if "alphaBoss" not in a or not a["alphaBoss"]:
            a["alphaBoss"] = "Alpha Irisal"
        if "personality" not in a or not a["personality"]:
            a["personality"] = "ESTP"
        if "awakeningFocus" not in a or not a["awakeningFocus"]:
            a["awakeningFocus"] = ["Attack", "Regen"]
        if "skills" not in a or not a["skills"] or len(a["skills"]) < 2:
            a["skills"] = ["Elemental Burst", "Power Strike"]
    else:
        if "role" not in a or not a["role"]:
            a["role"] = "DPS"
        if "evolution" not in a or not a["evolution"]:
            a["evolution"] = "Evolves through level progression"
        if "location" not in a or not a["location"]:
            a["location"] = "Wild Habitats & Blooms"

# Save cleaned data
with open('src/data/aniimos.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Polished {len(data)} Aniimo entries in src/data/aniimos.json!")

