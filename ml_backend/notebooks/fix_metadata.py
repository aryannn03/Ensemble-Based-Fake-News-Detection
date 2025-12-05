import json
from pathlib import Path

nb_path = Path(__file__).resolve().parent / "transformer_model.ipynb"

print("Attempting to open:", nb_path)

if not nb_path.exists():
    print("ERROR: Notebook file not found at:", nb_path)
    raise SystemExit(1)

with nb_path.open("r", encoding="utf-8") as f:
    nb = json.load(f)

metadata = nb.setdefault("metadata", {})

if "widgets" in metadata:
    print("Found metadata.widgets – removing it.")
    metadata.pop("widgets")
else:
    print("No metadata.widgets found – nothing to remove.")

metadata.setdefault("language_info", {"name": "python"})

with nb_path.open("w", encoding="utf-8") as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print("Notebook metadata fixed and saved successfully.")
