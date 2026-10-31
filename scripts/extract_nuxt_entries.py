import re
import json

with open('wiki_home.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's find all pattern occurrences:
# e.g. "005",1001100,"Celestis","https://worldx-website-cdn.aniimo.com/official-website/worldx/wiki_stage/init/Wiki_Aniimo_10011.png"
# Or regex matching ("<name>",\s*"https://worldx-website-cdn.aniimo.com/[^"]+")
pattern = r'"([A-Za-z0-9\s\-]+)",\s*"(https://worldx-website-cdn\.aniimo\.com/[^"]+\.png)"'
matches = re.findall(pattern, html)
print(f"Matches of (Name, ImageURL): {len(matches)}")

for name, url in matches[:20]:
    print(f"  {name:20s} : {url}")

# Also check reversed: ("https://...", "<name>")
pattern_rev = r'"(https://worldx-website-cdn\.aniimo\.com/[^"]+\.png)",\s*"([^"]+)"'
matches_rev = re.findall(pattern_rev, html)
print(f"Matches of (ImageURL, Name/Desc): {len(matches_rev)}")
for url, text in matches_rev[:10]:
    print(f"  {url} : {text[:40]}")

