# -*- coding: utf-8 -*-
"""Generates the 7 homepage language versions from template.html + translations.py.
Run from this directory: python generate.py
Writes to the real site paths: ../../index.html, ../../en/index.html, etc.
"""
import os
import re
from translations import T, LANG_META, CATEGORY_ORDER, CATEGORY_IMG

HERE = os.path.dirname(os.path.abspath(__file__))
SITE_ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))

with open(os.path.join(HERE, "template.html"), "r", encoding="utf-8") as f:
    TEMPLATE = f.read()

ALL_LANGS = list(LANG_META.keys())


def build_hreflang_tags(lang):
    lines = []
    for code, meta in LANG_META.items():
        lines.append(f'<link rel="alternate" hreflang="{code}" href="https://briefai.ch{meta["path"]}">')
    lines.append('<link rel="alternate" hreflang="x-default" href="https://briefai.ch/">')
    return "\n".join(lines)


def build_category_cards(lang):
    cards = []
    for cat_id in CATEGORY_ORDER:
        img = CATEGORY_IMG[cat_id]
        title = T[f"cat_{cat_id}_title"][lang]
        sub = T[f"cat_{cat_id}_sub"][lang]
        is_placeholder = img is None
        classes = "cat-card placeholder" if is_placeholder else "cat-card"
        pending_pill = f'<span class="pending-pill">{T["cat_badge_pending"][lang]}</span>' if is_placeholder else ""
        img_html = f'<img src="/assets/images/categories/{img}" alt="" loading="lazy">' if img else ""
        aria_label = f' aria-label="{title} — {T["cat_badge_pending"][lang]}"' if is_placeholder else ""
        card = (
            f'      <button type="button" class="{classes}" data-cat="{cat_id}" aria-haspopup="dialog"{aria_label}>\n'
            f'        {pending_pill}\n'
            f'        <div class="cat-stage">{img_html}</div>\n'
            f'        <h4 class="cat-title">{title}</h4>\n'
            f'        <p class="cat-sub">{sub}</p>\n'
            f'      </button>'
        )
        cards.append(card)
    return "\n".join(cards)


def render_page(lang):
    meta = LANG_META[lang]
    root = "" if lang == "de" else "../"
    canonical_url = f"https://briefai.ch{meta['path']}"
    privacy_link = f"{root}privacy.html"

    values = {}
    for key, per_lang in T.items():
        if key == "waitlist_consent":
            continue  # handled separately below (needs privacy_link substitution)
        values[key] = per_lang.get(lang, per_lang.get("de", ""))

    values["waitlist_consent"] = T["waitlist_consent"][lang].replace("{privacy_link}", privacy_link)
    values["root"] = root
    values["html_lang"] = lang
    values["html_dir"] = meta["dir"]
    values["canonical_url"] = canonical_url
    values["hreflang_tags"] = build_hreflang_tags(lang)
    values["category_cards"] = build_category_cards(lang)

    out = TEMPLATE
    for key, val in values.items():
        out = out.replace("{{" + key + "}}", val)

    remaining = re.findall(r"\{\{[a-zA-Z0-9_]+\}\}", out)
    if remaining:
        raise RuntimeError(f"[{lang}] Unresolved placeholders: {sorted(set(remaining))}")

    return out


def main():
    for lang in ALL_LANGS:
        html = render_page(lang)
        if lang == "de":
            out_path = os.path.join(SITE_ROOT, "index.html")
        else:
            lang_dir = os.path.join(SITE_ROOT, lang)
            os.makedirs(lang_dir, exist_ok=True)
            out_path = os.path.join(lang_dir, "index.html")
        with open(out_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(html)
        print(f"wrote {out_path} ({len(html)} chars)")


if __name__ == "__main__":
    main()
