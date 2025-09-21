#!/usr/bin/env python3
"""
Import translations from a CSV file into JSON language files.
CSV must have columns: key, fr, en, es, ar, zh
Usage:
    python tools/import_i18n_from_csv.py path/to/protegemoi_i18n_keys.csv
"""
import sys, json, csv
from pathlib import Path

def main(csv_path: str):
    csv_file = Path(csv_path)
    if not csv_file.exists():
        print(f"[Error] CSV not found: {csv_file}")
        sys.exit(1)

    project_root = Path(__file__).resolve().parents[1]
    i18n_dir = project_root / "assets" / "i18n"
    langs = ["fr","en","es","ar","zh"]

    # Load current JSONs (or create)
    dicts = {}
    for lang in langs:
        f = i18n_dir / f"{lang}.json"
        if f.exists():
            try:
                dicts[lang] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                dicts[lang] = {}
        else:
            dicts[lang] = {}

    # Read CSV and apply updates
    with csv_file.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required_cols = {"key","fr","en","es","ar","zh"}
        if not required_cols.issubset(set(reader.fieldnames or [])):
            print(f"[Error] CSV must include columns: {', '.join(sorted(required_cols))}")
            sys.exit(1)
        count = 0
        for row in reader:
            key = (row.get("key") or "").strip()
            if not key:
                continue
            for lang in langs:
                val = row.get(lang, "")
                if val is None:
                    val = ""
                dicts[lang][key] = val
            count += 1

    # Write back JSON files with pretty formatting
    for lang in langs:
        out = i18n_dir / f"{lang}.json"
        out.write_text(json.dumps(dicts[lang], ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"[OK] Imported translations for {count} keys into {i18n_dir}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python tools/import_i18n_from_csv.py path/to/protegemoi_i18n_keys.csv")
        sys.exit(1)
    main(sys.argv[1])
