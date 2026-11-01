# Motion guide: scroll stories and swipe cards

Movement is one of the tools we can use to explain things, next to timelines, labeled pictures and step paths in the [presentation guide](presentation.md). Reach for it when a change over time or a process is the point and a still picture would explain it slower. Most pages never need it.

Last checked: November 1, 2026. Research behind this guide: the examples and rules review done in Claude Duet on November 1, 2026, summed up below with its sources.

## When to reach for it

Good fits are pages people read when they have time to understand:

- How the site works and how sources are checked (one listing moving through the steps).
- Processes with stages, like how a city law gets passed.
- Things that change over a year, like the growing calendar.
- "Try it" tools where a slider or a few taps teach more than reading, like a property tax estimate.

When you plan or write a page, ask: is the change itself what the reader needs to understand? If yes, consider a scroll story or swipe cards. If a still picture says it, use the still picture.

## Never animate these

- Help now, crisis and Stay tonight pages, and any page naming 988, 211 or 911.
- Deadlines, eligibility rules, amounts and phone numbers. Never put these only inside a moving picture.
- The first screen of any page. It gives the answer with no motion.
- Forms and the fix request path.

People under stress or trying to finish a task are slowed down by scroll effects, and it is worse on phones and slow connections (NN/g).

## The rules

1. **Move only when the change is the point.** A step happening, a before and after, something growing over time.
2. **Never take over the scroll.** Watch where the reader is. Never change scroll speed or turn a down swipe into a sideways move.
3. **Build the finished page first.** Every step, word and picture is plain HTML that reads fine with no script, on an old phone, or in a browser without the newest CSS. Motion is a layer on top (presentation rule 8).
4. **The device decides.** Animate only inside `@media (prefers-reduced-motion: no-preference)`. Put a "Skip to the summary" link at the top of each scroll story.
5. **One point per step, 3 to 7 steps.** Short, plain words beside each change.
6. **Phone first.** Design the phone version first. If each step makes sense alone, stack the pictures on small screens. Nothing that needs hover.
7. **Swiping is never the only way.** Swipe cards get big Back and Next buttons, a "Step 2 of 5" label, and a peek of the next card. Nothing moves on its own.
8. **The words carry the meaning.** Each picture has a text name. Code order matches screen order, so a screen reader hears a normal numbered list.
9. **Let people try it when that helps.** A slider or a few taps, at the reader's own pace.
10. **Keep it light.** Move only position and fade. CSS before script. No library, no autoplay video, no big image sequences. Stay inside the [weight budget](presentation.md#weight-budget).
11. **Calm look.** Simple shapes in the site's colors ([identity.md](identity.md)), short gentle changes, no parallax, spinning or flashing.
12. **Be clear what is real.** Caption each picture with its takeaway, mark what is an illustration and what is real data, and end with the action to take and the sources.

## How to build it

- **Scroll story:** CSS `position: sticky` for the picture, plus a few lines of script with `IntersectionObserver` that mark which step is in view. No library needed.
- **Swipe cards:** native sideways scrolling with `scroll-snap`, plus real buttons. No custom gesture code.
- **CSS scroll-driven animations** only for small extras like a progress bar, wrapped in `@supports`. They are not in every browser yet, so never put meaning in them.
- Make the visible, finished state the default, so nothing stays hidden where an effect does not run.
- On phones, do not size steps by screen height units, since the browser bar resizing makes them jump.
- Check with `node scripts/a11y-deep.mjs` (it covers reduced motion) and the [accessibility status](../accessibility.md) list.

## Examples worth borrowing from

| Example | What to borrow |
|---|---|
| [R2D3: A visual introduction to machine learning](https://r2d3.us/visual-intro-to-machine-learning-part-1/) | One chart stays put while steps scroll by: the pattern for how it works pages |
| [Washington Post coronavirus simulator](https://www.dezeen.com/2020/03/26/the-washington-post-coronavirus-inforgraphics-harry-stevens/amp/) | Plain dots for people, "what if" comparisons |
| [The Pudding: Women's pockets](https://pudding.cool/2018/08/pockets/) | A skip link to the end, and a small tool after the story |
| [Ciechanowski: Mechanical Watch](https://ciechanow.ski/mechanical-watch/) | Sliders the reader controls instead of scroll |
| [GOV.UK step by step navigation](https://design-system.service.gov.uk/patterns/step-by-step-navigation) | Calm numbered steps with no motion, tested with disabled users |
| [ONS scrollytelling prototypes](https://digitalblog.ons.gov.uk/2021/05/24/what-makes-for-a-good-scrollytelling-article) | Short, precise text, one point at a time |
| [Anthropic: Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model) | Question-led sections and captions that state the takeaway |
| [Google Web Stories accessibility](https://blog.amp.dev/2020/07/16/accessibility-in-web-stories/) | Rules for any swipe card set |

## Sources

- [W3C: Understanding Animation from Interactions (WCAG 2.3.3)](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [NN/g: Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- [The Pudding: Responsive scrollytelling best practices](https://pudding.cool/process/responsive-scrollytelling/)
- [The Pudding: Easier scrollytelling with position sticky](https://pudding.cool/process/scrollytelling-sticky/)
- [Smashing Magazine: Usability guidelines for better carousels](https://www.smashingmagazine.com/2022/04/designing-better-carousel-ux)
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations)
