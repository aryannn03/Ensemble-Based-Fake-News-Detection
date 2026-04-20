import json
import sys
import shutil
from pathlib import Path

def fix_notebook(nb_path: Path) -> None:
    print(f"Opening: {nb_path}")

    if not nb_path.exists():
        print(f"ERROR: File not found: {nb_path}")
        raise SystemExit(1)

    # Back up original before touching it
    backup_path = nb_path.with_suffix(".ipynb.bak")
    shutil.copy2(nb_path, backup_path)
    print(f"Backup saved: {backup_path}")

    with nb_path.open("r", encoding="utf-8") as f:
        nb = json.load(f)

    metadata = nb.setdefault("metadata", {})

    if "widgets" in metadata:
        print("Found metadata.widgets — inspecting...")
        widgets = metadata["widgets"]

        fixed_any = False
        for mime_key, widget_val in widgets.items():
            if not isinstance(widget_val, dict):
                continue

            if "state" not in widget_val:
                print(f"  Adding missing 'state' key to: {mime_key}")
                widget_val["state"] = {}
                fixed_any = True

            if "version_major" not in widget_val:
                widget_val["version_major"] = 2
                fixed_any = True

            if "version_minor" not in widget_val:
                widget_val["version_minor"] = 0
                fixed_any = True

            if widget_val.get("state"):
                print(f"  Clearing widget state blob in: {mime_key} "
                      f"({len(widget_val['state'])} entries)")
                widget_val["state"] = {}
                fixed_any = True

        if not fixed_any:
            print("  metadata.widgets already looks valid — no changes needed.")
    else:
        print("No metadata.widgets found — nothing to fix there.")

    cells_fixed = 0
    for cell in nb.get("cells", []):
        for output in cell.get("outputs", []):
            out_meta = output.get("metadata", {})

            # Remove widget-view references from output metadata
            widget_view_key = "application/vnd.jupyter.widget-view+json"
            if widget_view_key in out_meta:
                del out_meta[widget_view_key]
                cells_fixed += 1

            # Clear widget-view output data blobs
            out_data = output.get("data", {})
            if widget_view_key in out_data:
                # Replace with a plain text placeholder so the cell
                # still shows something meaningful on GitHub
                model_id = out_data[widget_view_key].get("model_id", "")
                output["data"] = {
                    "text/plain": [f"[Widget: {model_id}]"]
                }
                cells_fixed += 1

    if cells_fixed:
        print(f"Cleared widget references from {cells_fixed} cell output(s).")

    with nb_path.open("w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2, ensure_ascii=False)

    print(f"\nNotebook fixed and saved: {nb_path}")
    print("You can now commit and push — GitHub should render it correctly.")
    print(f"Original backed up at   : {backup_path}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = Path(sys.argv[1]).resolve()
    else:
        target = Path(__file__).resolve().parent / "transformer_model.ipynb"

    fix_notebook(target)
