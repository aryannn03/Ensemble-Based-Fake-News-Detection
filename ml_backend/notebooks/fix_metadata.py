import json
from pathlib import Path

# Notebook is in the SAME folder as this script
nb_path = Path(__file__).resolve().parent / "transformer_model.ipynb"

print("Attempting to open:", nb_path)

if not nb_path.exists():
    print("ERROR: Notebook file not found at:", nb_path)
    raise SystemExit(1)

# Read raw JSON
with nb_path.open("r", encoding="utf-8") as f:
    nb = json.load(f)

# Ensure metadata exists
metadata = nb.setdefault("metadata", {})

# Remove problematic widgets metadata if present
if "widgets" in metadata:
    print("Found metadata.widgets – removing it.")
    metadata.pop("widgets")
else:
    print("No metadata.widgets found – nothing to remove.")

# (Optional) Make sure basic language_info exists
metadata.setdefault("language_info", {"name": "python"})

# Write notebook back
with nb_path.open("w", encoding="utf-8") as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print("Notebook metadata fixed and saved successfully.")
