---
date: 2024-09-17
draft: false
tags:
---
1. Download linux(tar.gz) package from [official website](https://dbeaver.io/download/)
2. `cd Downloads`
3. `tar -xf <packagename>.tar.gz`
4. `sudo mkdir /usr/share/dbeaver-ce`
5. From your Downloads directory: `sudo mv dbeaver/* /usr/share/dbeaver-ce/`
6. `cd /usr/share/dbeaver-ce/`
7. `sudo ln -s /usr/share/dbeaver-ce/dbeaver /usr/local/bin/dbeaver`
8. `sudo cp /usr/share/dbeaver-ce/dbeaver-ce.desktop /usr/share/applications/`
9. Done! After these steps you should be able to find and launch DBeaver from your application menu and use the `dbeaver` command in the terminal. 


The same steps also works for [[Как настроить Zotero Integration plugin в Obsidian раз и навсегда|Zotero]]

---
### Reference:
- Me

### Related:
- [[Как настроить Zotero Integration plugin в Obsidian раз и навсегда]]
- [[How to see the description of the system's hardware components in Linux - BIOS, RAM capacity, baseboard]]
- [[MariaDB SQL set up and commands]]