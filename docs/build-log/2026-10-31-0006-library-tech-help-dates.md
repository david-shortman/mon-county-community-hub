# 2026-10-31: Library drop-in tech help dates on the calendar (#670)

- **Considered:** the library's Drop-In Digital Navigator Hours at the main library help people with phones, accounts, online forms and scams. The library calendar feed in #730 leaves out any title it lists 3 or more times, and the Morgantown session is listed 3 times (November 4, 10 and 19), so the feed would not show it.
- **Chose:** three hand-checked entries in `content/calendar/`, each read on its own event page. The slugs match the ones the feed adapter would make, so if the feed ever lists one, the hand-checked entry wins and there is no duplicate. The branch sessions (Clay-Battelle, Clinton, Arnettsville, Cheat) are left to the feed, which keeps them.
- **Next:** roll new dates forward when the library posts them.
