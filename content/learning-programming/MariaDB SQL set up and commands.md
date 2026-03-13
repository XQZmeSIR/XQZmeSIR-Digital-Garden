---
publish: true
created: 2024-09-07
modified: 2026-03-13T18:53:40.796+03:00
cssclasses: ""
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
- [[learning-programming/Databases]]
- [[learning-programming/PostgreSQL Enable Disable]]
- [[learning-programming/Какие базы данных бывают]]