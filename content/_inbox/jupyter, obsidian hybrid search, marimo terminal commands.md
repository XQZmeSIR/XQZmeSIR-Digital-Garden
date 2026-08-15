---
publish: true
draft: true
created: 2026-04-28 17:48
modified: 2026-06-26T10:34:13.434+03:00
---

```zsh
# running and using Jupyter notebooks for a project
cd dir
uv init / uv venv
uv add jupyterlab pandas numpy matplotlib seaborn
uv run jupyter lab

uvx jupyter lab  # downloads + runs in one go (like pipx, but for uv)

# ---------
marimo edit [file] # Starts the Marimo editor in your browser. Use --watch to auto-update when the file changes.

marimo run [file] # Runs a notebook as a read-only, interactive web app.

marimo new # Creates a new notebook.

marimo tutorial [name] # Opens a tutorial (e.g., intro).

marimo export [format] [file] # Exports a notebook to HTML or ipynb.

marimo convert notebook.ipynb -o notebook.py 

# ------------
# obsidian hybrid search
npm update -g obsidian-hybrid-search # update
obsidian-hybrid-search & # start server

ohs # hybrid search
ohss # semantic
ohst # title
ohsf # full text
ohs [query] --rerank # use rerank for better result. needs hybrid search
ohsi # index vault
ohsst # status
ohsi --force # force index from scratch
```

---

### Reference:

-

### Related:

-
