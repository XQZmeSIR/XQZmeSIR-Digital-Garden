---
publish: true
draft: true
created: 2026-05-27 23:09
modified: 2026-05-27T23:33:06.470+03:00
---

What I changed in these files to increase the number of shown commands in telegram and the way they ordered meaning that they show my custom skills above with higher priority, and they do not get omitted because of Telegram API limit of only 100 possible shown commands.

In plain language, these changes solve the following problem: In Telegram bot when I write slash and the commands that are available are Are completed and shown and you can list through them those commands and they their amount was limited to 30, which is a predetermined setup in `telegram.py` code. But it was inconvenient for me because I couldn't see all the commands that that were a available to me and even my commands that were in the end of that list of all commands because they're kinda added to the end of the list.

So in order to show all the commands and also fix the how hierarchy and order of those commands to make my user skills be more on the top rather than in the end of the list I made the following changes into files:

First, let's find out that the max commands per scope is equal to 100(maximum that telegram API can handle), and not 30:

```zsh
grep -n "MAX_COMMANDS_PER_SCOPE" ~/.hermes/hermes-agent/gateway/platforms/telegram.py

# If it's not 100 hen it means that the settings were reset or the Hermes was updated, and so were the files. Which means that we need to increase this number to one hundred. That's the only change in this file. 

# MAX_COMMANDS_PER_SCOPE = 100 

```

### `.hermes/hermes-agent/gateway/platforms/telegram.py`

```python
# line 120
MAX_COMMANDS_PER_SCOPE = 100  # ----MY CHANGE-----
# that's it
```

---

### `.hermes/hermes-agent/hermes_cli/commands.py`

```python
# after _TELEGRAM_MENU_PRIORITY constanta put this one:

_TELEGRAM_SKILL_PRIORITY = (
    "session-finalization",
    "sessions-detailed",
    "winston-concise",
    "systems-principle-planner",
    "systems-principle",
    "reasoner",
    "pet-project-architect",
    "leverage-filter",
    "interview-coach",
    "dataset-learning-planner",
    "data-analyst-legend-builder",
    "llm-wiki",
)
"""Personal skills that should stay visible in Telegram's capped menu.

Skills listed here appear first (in this order) before the remaining
alphabetically-sorted skills.  This prevents them from being pushed out
of the 100-command Telegram Bot API menu limit.
"""

# This is basically your custom skills or commands that you want to stand out and be in the middle after the menu priority commands so that so that you can access them and they do not omit after the limit of 100. 
```

Then, in the same `commands.py` file, inside of `def _collect_gateway_skill_entries` function find the following line:

`skill_triples = _clamp_command_names(skill_triples, reserved_names)`

and put AFTER THAT variable or in other words - line of code this:

```python
def _collect_gateway_skill_entries(...)
	###
	# some code
	###
	
	skill_triples = _clamp_command_names(skill_triples, reserved_names)
	# BELOW this skill_triples put the followinng
	
	    # Telegram skill priority: push personal skills to the top 🚨 after the _TELEGRAM_MENU_PRIORITY but before everything else - so kinda put your skills inbetween.
	    
    if platform == "telegram":
        skill_priority_map = {
            _sanitize_telegram_name(name): idx
            for idx, name in enumerate(_TELEGRAM_SKILL_PRIORITY)
        }

        skill_triples.sort(
            key=lambda triple: (
                0 if triple[0] in skill_priority_map else 1,
                skill_priority_map.get(triple[0], 0),
                triple[0],
            )
        )

```

That'll be all. Now, the `hermes gateway restart`  must be done for telegram to pick up changes.
After that, the amount of shown /shash commands will be 100, and YOUR list of skills that you put in `_TELEGRAM_SKILL_PRIORITY` will be right after first few menu commands.

Done.

You can also ask your Hermes Agent to implement that using this instruction. He can also make it a skill, so Whenever the update happens or your changes in those files somehow get to defaults you can ask your Hermes agent to use the skill to revert those changes and make them this customized.

[[.hermes/skills/user-skills/telegram-skill-priority]]
