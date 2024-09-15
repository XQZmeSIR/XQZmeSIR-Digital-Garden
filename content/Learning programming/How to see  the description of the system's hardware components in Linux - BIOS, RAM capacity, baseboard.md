---
date: 2024-09-15
draft: false
tags:
---
To determine the maximum RAM capacity of your system in a Linux terminal, you can use the following command:

```bash
sudo dmidecode -t memory
```

This will show detailed information about your system's memory, including the maximum capacity supported by the motherboard.

Alternatively, you can filter the relevant information with this command:

```bash
sudo dmidecode -t memory | grep -i "maximum capacity"
```

This will return the maximum RAM capacity directly.


```bash
sudo dmidecode -t baseboard
sudo dmidecode -t bios
```

---
### Reference:
- ChatGPT-4o

### Related:
- 