import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Let's see if other item pages or detail pages have items
# Let's fetch sitemap en-US item pages and check for item icons!
# Let's sample 15 pages from different elements
urls_to_check = [
    "https://wiki.aniimo.com/item/001/basic-form",
    "https://wiki.aniimo.com/item/002/basic-form",
    "https://wiki.aniimo.com/item/003/basic-form",
    "https://wiki.aniimo.com/item/004/basic-form",
    "https://wiki.aniimo.com/item/005/basic-form",
    "https://wiki.aniimo.com/item/006/basic-form",
    "https://wiki.aniimo.com/item/007/basic-form",
    "https://wiki.aniimo.com/item/008/basic-form",
    "https://wiki.aniimo.com/item/010/basic-form",
    "https://wiki.aniimo.com/item/020/basic-form",
    "https://wiki.aniimo.com/item/030/basic-form",
]

found_icons = set()
for u in urls_to_check:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=5) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            import re
            icons = re.findall(r'https://worldx-website-cdn\.aniimo\.com/[^\s"\'<>]*Item[^\s"\'<>]*\.png', html)
            for ic in icons:
                found_icons.add(ic)
    except Exception as e:
        print(f"Error fetching {u}: {e}")

print(f"Found {len(found_icons)} unique Item icons across sampled pages:")
for ic in found_icons:
    print(" ", ic)

