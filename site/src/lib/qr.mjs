// QR codes made at build time (#160), as inline SVG, so a printout needs no
// outside service and the page loads no script. Black on white with a quiet
// border, which prints well on any printer. Always print the short web
// address beside a code: a code alone gets few taps. Uses qrcode-generator
// (MIT, free), the same library as the community center flyers.
import qrcode from 'qrcode-generator';

export async function qrSvg(url) {
  const qr = qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  const svg = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  // Decorative for screen readers: the web address is printed next to it.
  return svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" class="qr" ');
}

// "everythingmorgantown.org/stay-tonight": easy to say out loud and type.
export function shortAddress(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// The same address split after the domain, so a narrow card can wrap it at
// the slash instead of mid-word: ['everythingmorgantown.org', '/stay-tonight'].
export function addressParts(url) {
  const a = shortAddress(url);
  const i = a.indexOf('/');
  return i < 0 ? [a, ''] : [a.slice(0, i), a.slice(i)];
}
