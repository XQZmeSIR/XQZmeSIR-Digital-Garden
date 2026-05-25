---
publish: true
draft: true
created: 2026-05-25 12:34
modified: 2026-05-25T12:56:51.087+03:00
tags:
  - nodejs
  - npm
  - homebrew
  - macos
  - obsidian
---

## Контекст и важный нюанс

Когда в системе параллельно установлены несколько версий Node.js (например, дефолтная **Node 25** и изолированная **Node 22** через Homebrew), у каждой из них есть **своё собственное независимое хранилище глобальных пакетов** (`node_modules`) и свой собственный бинарник `npm`.

Если обновить пакет просто через `npm install -g`, он обновится **только** для текущей активной (дефолтной) версии Node.

Рассмотрим процесс проверки и обновления глобального пакета (на примере `obsidian-hybrid-search`) для обеих версий.

---

## Часть 1. Работа с изолированной версией (Node 22)

Так как по умолчанию в терминале вызывается Node 25, для управления пакетами внутри Node 22 нам нужно принудительно прокидывать контекст правильного `npm`. Проще всего это сделать через временный `PATH`.

### 1. Проверить текущую установленную версию пакета

Узнать, какая версия пакета сейчас привязана к Node 22:

```bash
PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm list -g obsidian-hybrid-search --depth=0
```

### 2. Обновить пакет до последней версии

Запустить обновление глобального пакета строго в изолированном окружении 22-й ноды:

```bash
PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm install -g obsidian-hybrid-search@latest
```

### 3. Проверить результат

Повторно запустите команду просмотра (из пункта 1), чтобы убедиться, что номер версии изменился.

---

## Часть 2. Работа с дефолтной версией (Node 25)

Здесь всё стандартно, так как терминал по умолчанию ссылается на эту версию.

### 1. Проверить текущую установленную версию пакета

```bash
npm list -g obsidian-hybrid-search --depth=0

```

### 2. Обновить пакет до последней версии (если требуется)

```bash
npm install -g obsidian-hybrid-search@latest

```

---

## Шпаргалка по командам (Сводная таблица)

| Действие | Для Node 22 (Homebrew) | Для Node 25 (Дефолт) |
| --- | --- | --- |
| **Узнать версию** | `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm list -g obsidian-hybrid-search --depth=0` | `npm list -g obsidian-hybrid-search --depth=0` |
| **Обновить** | `PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm install -g obsidian-hybrid-search@latest` | `npm install -g obsidian-hybrid-search@latest` |

> [!tip] Ссылка на репозиторий проекта
> Для отслеживания релизов и документации: [flowing-abyss/obsidian-hybrid-search](https://github.com/flowing-abyss/obsidian-hybrid-search)

---

### Reference:

- Gemini Flash 3.5

### Related:

- [[Временный запуск CLI-команд omniroute, ohsчерез @22 версию Node.js]]
- [[jupyter, obsidian hybrid search, marimo terminal commands]]
