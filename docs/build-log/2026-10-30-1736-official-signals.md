# 2026-10-30: Say plainly that we are not official, and mark government sources

- **Considered:** David noted that most sites carry a small signal about whether they are official and where their information comes from. Ours did not say it is independent, so a visitor could take it for a city or county site.
- **Chose:** a short footer line on every page, and a "(government site)" mark on sources with a .gov address. Only US government bodies can register .gov, so the mark is never a guess. The orgs' `kind: government` field was not used, since it is too loose to call a site official.
- **Shipped:** footer: "An independent community guide, not a government site. It is not run by the City of Morgantown, Monongalia County or the State of West Virginia, or by the groups it lists." Source lines and calendar cards add "(government site)", or "(all government sites)" once when every link in a group is .gov.
- **Scoreboard:** Trust TR8 (open about who runs it) and TR1 (source signals).
