---
date: 2024-09-07
draft: false
tags:
---
```zsh
sudo mariadb-upgrade --user=mysql --basedir=/usr --datadir=/var/lib/mysql

sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql

sudo systemctl status mariadb

sudo systemctl start mariadb

sudo systemctl stop mariadb

mariadb -u solleks -p black
```

```sql
show tables;
show databases;
use <yourdatabase>;
```

---
### Reference:
- 

### Related:
- [[Databases]]
- [[PostgreSQL Enable Disable]]
- [[Какие базы данных бывают]]