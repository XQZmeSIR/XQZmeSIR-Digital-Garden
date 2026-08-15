---
publish: true
created: 2024-09-22
modified: 2026-03-13T18:53:40.788+03:00
tags:
  - shortcuts
  - vscode
---

Generally VS Code uses ctrl+j to open Terminal so I created a keybinding to switch with ctrl+k combination, like below at keybindings.json:

```json
{
    "key": "ctrl+k",
    "command": "workbench.action.terminal.focus"
},
{
    "key": "ctrl+k",
    "command": "workbench.action.focusActiveEditorGroup",
    "when": "terminalFocus"
}
```

---

### Reference:

- https://superuser.com/questions/1270103/how-to-switch-the-cursor-between-terminal-and-code-in-vscode

### Related:

-
