# /free-adult-classes/: free classes to read, learn English or use a computer

Date: 2026-11-14. Sprint wave 19, learning lane (#529). Follows #1936.

## What I considered

The lane asked for free adult classes (literacy, English, computer basics) offered by public bodies in Mon County, each from its own page. The site had the pieces spread out: MTEC's English classes and Literacy Volunteers on `/keep-learning/` and `/work-and-learning/`, the library's computer and job tools on `/find-a-job/`. Nothing listed computer basics classes, and no page put the three kinds of class together.

## What shipped

- `/free-adult-classes/`, in three parts: reading, writing and math (MTEC Adult Learning Center, plus Literacy Volunteers), English (MTEC), and computer basics (the library's Northstar lessons, Digital Navigator drop-in hours and free computers).
- A new record, `content/resources/mpls-northstar-digital-literacy.yaml`, from the library's Northstar info session page and adult programs page, read 2026-11-14.
- Links from `/keep-learning/#more`, `/high-school-equivalency/` and `llms.txt`.

## Left off

- The library's own Digital Navigator record is in open PR #1823 (for:david), so this page describes drop-in hours in a sentence with its own source line instead of a card.
- WVU and WVU Extension classes: WVU's sites refuse automated reads.

## Where a learning section could go

`/keep-learning/`, `/high-school-equivalency/`, `/free-adult-classes/` and `/pay-for-training/` all sit in the family door under topic `work`. A "Learning" group on the Topics page could hold them together.
