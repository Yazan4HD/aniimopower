import urllib.request
import ssl
import json
import os
import re
from PIL import Image

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Create directories
os.makedirs("public/images/aniimos", exist_ok=True)
os.makedirs("public/images/renders", exist_ok=True)
os.makedirs("public/images/items", exist_ok=True)

# Load local Aniimos
with open("src/data/aniimos.json", "r", encoding="utf-8") as f:
    aniimos = json.load(f)

# Load wiki map
with open("wiki_aniimos_map.json", "r", encoding="utf-8") as f:
    wiki_map = json.load(f)

# Name normalization map for any spelling differences
NAME_ALIASES = {
    "scorchhowl": "scorchhowl",
    "inferlupa": "inferlupa",
    "infergon": "infergon",
    "sparkelf": "sparkelf",
    "erlath": "erlath",
    "glacy": "glacy",
    "panpanta": "panpanta",
    "piopiota": "piopiota",
    "sherro": "sherro",
    "thunderstorm": "sherro", # Sherro thunderstorm form
    "dewple": "dewple",
    "dewlop": "dewlop",
    "popapus": "popapus",
    "gachapus": "gachapus",
    "lilipole": "lilipole",
    "scrubbit": "scrubbit",
    "saws": "saws",
    "whirlbite": "whirlbite",
    "jeglid": "jeglid",
    "jeburst": "jeburst",
    "irisal": "irisal",
    "irisalis": "irisal",
    "leafy": "leafy",
    "melloblum": "melloblum",
    "pomawk": "pomawk",
    "thornblade": "thornblade",
    "tuckin": "tuckin",
    "crocobask": "crocobask",
    "bubbeep": "bubbeep",
    "glameep": "glameep",
    "salabask": "salabask",
    "besauce": "besauce",
    "blazen": "blazen",
    "dazmand": "dazmand",
    "fenmane": "fenmane",
    "fulmintis": "fulmintis",
    "luminelle": "luminelle",
    "jaguaraun": "jaguaraun",
    "geoclaw": "geoclaw",
    "glynsera": "glynsera",
    "sugarfish": "sugarfish",
    "sugarslime": "sugarslime",
    "sugartini": "sugartini",
    "prawnch": "prawnch",
    "jabster": "jabster",
    "cornet": "cornet",
    "eklue": "eklue",
    "gracewing": "gracewing",
    "somniwing": "gracewing",
    "tromber": "tromber",
    "tubster": "tubster",
    "turbo": "turbo",
    "hypnowl": "hypnowl",
    "mesmerowl": "mesmerowl",
    "hypnyto": "hypnyto",
    "puffby": "puffby",
    "buffby": "buffby",
    "royalby": "royalby",
    "bailite": "bailite",
    "geodeback": "geodeback",
    "grizbo": "grizbo",
    "minespine": "minespine",
    "waleetle": "baleetle", # Baleetle on wiki
    "coraliz": "coraliz",
    "reefish": "reefish",
    "fragrancier": "fragrancier",
    "hexxin": "hexxin",
    "ignitis": "ignitis",
    "pawney": "pawney",
    "rookey": "rookey",
    "stellarys": "stellarys",
    "coinwisp": "coinwisp",
    "pouchwisp": "pouchwisp",
    "ekrim": "ekrim",
    "helion": "helion",
    "lunara": "lunara",
}

wiki_by_lower = {k.lower(): (k, v) for k, v in wiki_map.items()}

def download_file(url, target_path):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            if resp.status == 200:
                with open(target_path, "wb") as f:
                    f.write(resp.read())
                return True
    except Exception as e:
        # print(f"Error downloading {url}: {e}")
        pass
    return False

# Download Phenomena Crystal item icon
phenomena_url = "https://worldx-website-cdn.aniimo.com/official-website/worldx/wiki_stage/init/0_Item_152100_Icon.png"
if download_file(phenomena_url, "public/images/items/phenomena-crystal.png"):
    print("Downloaded official Phenomena Crystal icon from wiki.aniimo.com!")

downloaded_avatars = 0
downloaded_renders = 0

print(f"\nDownloading all official Aniimo images from wiki.aniimo.com...")

for a in aniimos:
    clean_name = a["name"].lower().strip()
    target_name = NAME_ALIASES.get(clean_name, clean_name)
    
    # Check wiki entry
    matched = None
    if target_name in wiki_by_lower:
        matched = wiki_by_lower[target_name]
    else:
        for wk, (orig_k, u) in wiki_by_lower.items():
            if wk in target_name or target_name in wk:
                matched = (orig_k, u)
                break
                
    if not matched:
        print(f"  Warning: No wiki match found for '{a['name']}'")
        continue
        
    orig_name, render_url = matched
    # Extract ID from render_url (e.g. 10025)
    id_match = re.search(r'Wiki_Aniimo_(\d+)\.png', render_url)
    if not id_match:
        continue
    numeric_id = id_match.group(1)
    
    # 1. Download official full-body render
    render_filename = f"{a['slug']}-render.png"
    render_target = f"public/images/renders/{render_filename}"
    
    # If prismana, try prismana render ID if known
    download_render_url = render_url
    if a.get("isPrismana", False):
        prismana_render_url = f"https://worldx-website-cdn.aniimo.com/official-website/worldx/wiki_stage/init/Wiki_Aniimo_{numeric_id}03.png"
        if download_file(prismana_render_url, render_target):
            a["renderImage"] = f"/images/renders/{render_filename}"
            downloaded_renders += 1
            render_done = True
        else:
            render_done = False
    else:
        render_done = False
        
    if not render_done and not os.path.exists(render_target):
        if download_file(download_render_url, render_target):
            a["renderImage"] = f"/images/renders/{render_filename}"
            downloaded_renders += 1
    elif os.path.exists(render_target):
        a["renderImage"] = f"/images/renders/{render_filename}"
        
    # 2. Download official PetHead circular icon
    pethead_url = f"https://worldx-website-cdn.aniimo.com/official-website/worldx/wiki_stage/init/Wiki_PetHead_{numeric_id}.png"
    pethead_target = f"public/images/aniimos/{a['slug']}.png"
    
    if download_file(pethead_url, pethead_target):
        a["image"] = f"/images/aniimos/{a['slug']}.png"
        a["officialWikiId"] = numeric_id
        a["officialWikiUrl"] = f"https://wiki.aniimo.com/item/{numeric_id[:3]}/basic-form"
        downloaded_avatars += 1
        print(f"  [OK] {a['name']:15s} -> PetHead #{numeric_id} + Render downloaded")
    else:
        print(f"  [MISS] {a['name']:15s} -> PetHead #{numeric_id} failed, keeping fallback")

# Save updated aniimos.json
with open("src/data/aniimos.json", "w", encoding="utf-8") as f:
    json.dump(aniimos, f, indent=2, ensure_ascii=False)

print(f"\nDownload complete! Successfully fetched {downloaded_avatars} PetHeads and {downloaded_renders} Renders from wiki.aniimo.com!")

