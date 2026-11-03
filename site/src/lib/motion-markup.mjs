// The scroll story kit: the HTML for "Skip to the summary" and the
// "Turn off motion" switch (#1441). Used by MotionSwitch.astro and by
// explainers that build their markup as a string (bus-day-markup.mjs).
// The button and the note stay hidden with no script; motion-client.mjs
// shows the right one. Styles: src/styles/motion-switch.css.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function motionSwitchHtml({ skip, skipText = 'Skip to the summary' } = {}) {
  const link = skip ? `<a href="${esc(skip)}">${esc(skipText)}</a>` : '';
  return `<div class="tools motion-tools">${link}<button class="motion-toggle" type="button" data-motion-switch hidden>Turn off motion</button><p class="motion-note" data-motion-note hidden>Motion is off because your device is set to reduce motion.</p></div>`;
}
