---
publish: true
draft: true
created: 2026-10-11 20:08
modified: 2026-10-11T17:08:44.969Z
---

**This note supersedes its own earlier version.** The old method — editing `gateway/platforms/telegram.py` and `hermes_cli/commands.py` — is dead. Those edits were silently wiped by a Hermes update, `MAX_COMMANDS_PER_SCOPE` no longer exists anywhere in the codebase, and the skill collector moved to `hermes_cli/commands_platforms.py`. The menu cap and the priority order are now **configuration**, read on every menu build, and configuration survives updates. Everything below lives in `config.yaml`. No source edits, ever.

## The problem

Typing `/` in the Telegram bot shows a capped, ordered list. Two failures compound:

1. **The menu is capped.** Upstream default is 60 commands, while the real candidate count is ~177 (core built-ins + plugin commands + every installed skill). ~87 commands can never appear.
2. **Skills were ordered alphabetically.** Personal skills (`winston-concise`, `reasoner`, `llm-wiki`…) sorted to the tail of the alphabet, which is exactly the part that gets cut. `/winston-concise` still dispatched when typed manually, but it was invisible in the picker — you cannot tap what you cannot see.
   Note that a capped menu is not an error state. The bot keeps serving whatever was registered last, so the symptom is silent: the menu simply never changes.

## The fix — three config keys, one restart

```bash
unset HERMES_HOME
hermes config set platforms.telegram.extra.command_menu.priority_mode append
hermes config set platforms.telegram.extra.command_menu.max_commands 95
hermes config set platforms.telegram.extra.command_menu.priority \
  '["session-finalization","sessions-detailed","winston-concise","systems-principle-planner","systems-principle","reasoner","pet-project-architect","leverage-filter","interview-coach","dataset-learning-planner","data-analyst-legend-builder","llm-wiki"]'
hermes gateway restart
```

That produces this block in `~/.hermes/config.yaml`:

```yaml
platforms:
  telegram:
    extra:
      command_menu:
        priority_mode: append
        max_commands: 95
        priority:
          - session-finalization
          - sessions-detailed
          - winston-concise
          - systems-principle-planner
          - systems-principle
          - reasoner
          - pet-project-architect
          - leverage-filter
          - interview-coach
          - dataset-learning-planner
          - data-analyst-legend-builder
          - llm-wiki
```

The list is a JSON/YAML literal, so `hermes config set` stores a real list, not a string. Comments in `config.yaml` survive the write — verified, the file keeps its `#` lines.

## What each key does

| Key | Meaning | Values |
|---|---|---|
| `max_commands` | how many commands Telegram registers | 1–100, clamped by code. **95** here. |
| `priority_mode` | how your list combines with Hermes' built-in ranking of core commands | `prepend` / `append` / `replace` |
| `priority` | your ranked list — index is the rank | any skill / plugin / core **name**; hyphens are fine (sanitized internally to `a_z` form for matching) |
`priority_mode` in practice:

- `append` — core built-ins first (`new`, `help`, `stop`, `status`, `egress`, `resume`, `sessions`, `model`, `debug`, `restart`, `update`, `verbose`, `commands`, `approve`, `deny`, `queue`, `steer`, `bg`, `btw`, `reasoning`, `usage`, `platform`, `profile`, `whoami`), then your list.
- `prepend` — your list first, then the core built-ins.
- `replace` — only your list gets ranked; core built-ins lose their priority entirely.
  `append` reproduced the historical ordering (core, then personal skills) and is what this note uses.

## Where the priority actually applies now

This is the part that changed most. The pipeline in `hermes_cli/commands_platforms.py`:

1. `telegram_bot_commands()` — core registry entries (no plugins).
2. `_collect_gateway_skill_entries()` — plugin commands first, then skill commands alphabetically. **Nothing is trimmed here** (`max_slots=None`).
3. All candidates merge into `(final_name, description, source, raw_name)`, where `source` is `core` / `plugin` / `skill` and `raw_name` is the sanitized pre-clamp name.
4. `_prioritize_telegram_menu_candidates()` orders the **combined** list by tiers, per `priority_mode`.
5. Only then does `candidates[:max_commands]` cut.
   Two consequences worth remembering:

- Priority is applied **before** the cap, so a prioritized skill is guaranteed a menu slot even when core + plugin commands alone would fill the menu. This is the actual bug fix.
- Priority now reaches **plugin and skill** commands, not just skills. The old source hack sorted skills only — and it sorted them after name clamping, so a long skill name could never match its own priority entry.
- The core ranking table (`_TELEGRAM_MENU_PRIORITY`) applies **only** to `source == core`. A skill that happens to share a name with a core command (e.g. a skill called `platforms`) is not promoted by it.

## The real ceiling is payload bytes, not command count

Measured against the live Bot API with the real menu — 40-character descriptions, as the Telegram adapter truncates them:
| requested cap | payload bytes | `setMyCommands` |
|---|---|---|
| 100 | 9748 | ❌ `BOT_COMMANDS_TOO_MUCH` |
| 99 | 9622 | ✅ |
| **95** | **9211** | ✅ |
| 90 | 8776 | ✅ |
| 60 (upstream default) | 5915 | ✅ |
| 100 commands, 1-char descriptions | 4686 | ✅ |
Telegram documents a 100-command limit, but at 100 commands carrying real descriptions the request is **rejected wholesale** — `set_my_commands FAILED … Bot_commands_too_much` on all three scopes (`Default`, `AllPrivateChats`, `AllGroupChats`). A rejected call does not clear the previous menu, so the bot silently keeps serving the stale list — indistinguishable from "nothing happened".
The last row is the tell: 100 commands with 1-character descriptions sail through at 4686 bytes. **The binding constraint is payload size (~9.7 KB), not the count.** Hence 95 (≈500 bytes of headroom) instead of 100. Do not set 99 or 100 — description length varies with every skill you add and with locale changes, and overshooting turns the whole registration into a no-op.
Upstream's own default is 60 (`_DEFAULT_TELEGRAM_MENU_MAX_COMMANDS`) precisely because of this; the configured value overrides it, so never hand-raise the constant.

## Verify

```bash
# what Telegram actually serves right now (read-only getMyCommands)
cd ~/.hermes/hermes-agent
PYTHONPATH=. .venv/bin/python \
  ~/.hermes/skills/user-skills/telegram-skill-priority/scripts/probe_menu.py
# gateway-side confirmation
grep "set_my_commands" ~/.hermes/logs/gateway.log | tail -3
# config as the code sees it
hermes config get platforms.telegram.extra.command_menu
```

Expected: the probe reports `95` computed and `95` live, `prioritized but NOT visible: none`, and the twelve personal skills at **positions 24–35** (right after the 24 core built-ins). The log shows `set_my_commands OK for scope … (95 cmds)` three times.
Always verify from **Telegram's own API** (`getMyCommands`), not from the log alone — the menu is pushed at gateway connect, so a log line from an earlier session can mask the current state. The probe script prints `DRIFT:` when the computed menu and the live menu disagree.
In Telegram itself: type `/` → personal skills sit right after the core built-ins; type `/winston-concise` (with hyphens) → still dispatches normally.
Actually seeing it requires the gateway to reach Telegram. If it cannot, the log fills with `Connect attempt N/8 failed` and the menu stays stale — that is a network problem, not a config problem. The gateway retries and registers the new menu on its own once connectivity returns.

## Maintenance — adding a new skill to the menu

`hermes config set` on a list key **replaces the whole list**. Always pass every name you want to keep, in the desired order:

```bash
hermes config set platforms.telegram.extra.command_menu.priority \
  '["session-finalization","sessions-detailed","winston-concise","systems-principle-planner","systems-principle","reasoner","pet-project-architect","leverage-filter","interview-coach","dataset-learning-planner","data-analyst-legend-builder","llm-wiki","NEW-SKILL"]'
hermes gateway restart
```

A skill that is **not** in `priority` still works when typed — it just risks falling outside the visible cap. Sorting it alphabetically is not a bug; it is the pre-existing behaviour.

## Recovery after `hermes update`

Config survives updates; source edits do not. That asymmetry is the whole reason for this rewrite.

1. `hermes config get platforms.telegram.extra.command_menu` — if the block is gone (reset/reinstall, not update), re-run the three `config set` commands above.
2. `hermes gateway restart`.
3. Run the probe script.
4. If you find source patches again in `hermes_cli/commands_platforms.py` — `_DEFAULT_TELEGRAM_MENU_MAX_COMMANDS = 95` or a `_TELEGRAM_SKILL_PRIORITY` tuple — revert them:

```bash
git -C ~/.hermes/hermes-agent checkout -- hermes_cli/commands_platforms.py
```

Both are inert. Nothing reads `_TELEGRAM_SKILL_PRIORITY` (it is dead code left over from the old hack), and an explicitly configured `max_commands` overrides the default constant. Keeping them only creates merge noise on the next update.

## Two pitfalls

1. **There are two `telegram:` blocks in `config.yaml`.** The legacy top-level `telegram:` block (with `extra: rich_messages` / `rich_drafts`) is _not_ where the command menu is read from — the menu is read only from `platforms.telegram.extra.command_menu`. A `command_menu:` written under the top-level block does nothing at all. When a key is defined in both places, `platforms.telegram.extra` wins and the gateway logs a warning about it.
2. **Never set `max_commands: 100`.** See the byte table: registration is rejected as a whole and the bot keeps the previous menu. 95 is the deliberate choice.

## Escape hatches — better than a bigger cap

- **`/commands`** prints the full list, including everything hidden by the cap.
- **Inline mode is uncapped.** `@yourbot <query>` searches every command and skill, per keystroke, paginated, nothing trimmed. One-time setup in @BotFather: `/setinline`. Until you enable it, Telegram never delivers inline queries and the picker stays inert. Results are served only to allowlisted users, so the skill catalogue is not exposed to strangers.
  When the skill catalogue keeps overflowing the menu, this — not a larger `max_commands` — is the real fix.

## Appendix — dead code from the old method

| Symbol | Status |
|---|---|
| `MAX_COMMANDS_PER_SCOPE` | **gone** — removed from the codebase. The file `gateway/platforms/telegram.py` no longer exists; the adapter is `plugins/platforms/telegram/adapter.py`. |
| `_TELEGRAM_SKILL_PRIORITY` | **dead** — may linger in an old working tree, no code reads it. Replaced by `command_menu.priority`. |
| `_TELEGRAM_MENU_PRIORITY` | **alive**, now in `hermes_cli/commands_platforms.py`. Ranks core built-ins only. Not user-editable; use `priority_mode: prepend` to outrank it. |
| `_collect_gateway_skill_entries()` | **moved** to `hermes_cli/commands_platforms.py`. Now returns untrimmed candidates and takes no priority argument — ranking happens later, on the merged list. |
Agent-side companion: the skill `telegram-skill-priority` (with `scripts/probe_menu.py`) contains this same procedure plus the live-verification script. Ask the Hermes agent to "use the telegram-skill-priority skill" whenever the menu misbehaves or after an update.

---

### Reference:

-

### Related:

-
