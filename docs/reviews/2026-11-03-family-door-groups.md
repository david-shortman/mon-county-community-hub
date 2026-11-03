# Family door: jump straight to work, business and disability pages

**Date:** November 3, 2026. **Who:** Claude Code, sprint wave 11, persona walkthroughs lane (#1571, see #529). Follows the [persona walkthroughs](2026-11-03-persona-walkthroughs.md).

> **Simulated, not real residents.** A script and Claude walked made-up tasks on the built site. Nothing here is resident feedback.

## The problem

The Family and life changes door lists every page in four groups: Kids and family, Veterans, Work and learning, and Disability and aging. Kids and family is the longest, so on a phone the work group starts 6 screens down and the disability group 9 screens down. Someone starting a business did not see the word "business" until screen 8.

## The change

- **The four groups are in the door's "On this page" list**, which sits on the second screen. One tap jumps to the group heading. It uses the existing jump list (#1174), with no new styles.
- **"Work and learning" is now "Work, training and business"** as a group name (the Work and learning page keeps its name), so a business owner sees their word.
- The group headings on every door get ids (`group-<topic>`), so other doors can do the same later. Only the Family door lists them for now.

Checked at 320 and 390px with 200% text, light and dark: no sideways scroll, and the jump lands on the heading.

## Before and after

Seven persona tasks go through this door ([`tasks-family-door.yaml`](../../content/findability/walkthroughs/tasks-family-door.yaml), results in [`2026-11-03-family-door.yaml`](../../content/findability/walkthroughs/2026-11-03-family-door.yaml)). Cost is taps plus screens scrolled divided by 3. Lower is better.

| Persona | Before | After |
|---|---|---|
| Disability (p12) | 6.0 | 4.33 |
| School-age kid (p14) | 6.0 | 4.67 |
| Teen first job (p15) | 5.67 | 4.67 |
| Lost a job (p17) | 3.67 | 3.67 |
| Home from jail (p18) | 3.0 | 3.0 |
| Starting a business (p19) | 5.67 | 5.0 |
| Help in your language (p25) | 4.0 | 4.0 |
| **Average** | **4.86** | **4.19** |

The rubric score stays at 83 for these seven tasks: its steps score (0 to 3) uses wide bands, and no task crossed one.

**A correction to round 3.** The round 3 write-up and #1571 said the lost job and reentry pages were buried. They are not: the door's "Big life change?" row, on its first screen, has "I lost my job" and "I'm leaving jail or prison", and those pages link the next steps. Round 3's tap paths missed that row. The results file uses it as the best path.

## Not done

- **More pick list choices** for disability or a business. #1287 showed a longer pick list pushes the rest of the page down, so this run did not try it.
- **The same jump list on other doors.** Get care and Living here have long "Every page" lists too. Worth measuring before adding.
