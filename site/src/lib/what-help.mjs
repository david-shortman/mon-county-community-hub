// "What help might I get?" (#188): two short questions, then the pages that
// may help. Each answer is a page that already exists, so this file holds no
// facts: link text comes from each page's own label and summary. Answers live
// only in the web address (/help/what-help/<need>/<who>/).
// `href` may carry a door pick (?pick=rent), so the person lands on their steps.
export const NEEDS = [
  { id: 'food', label: 'Food', hint: 'Today, this week, or every month', href: '/help/food/' },
  { id: 'bill', label: "A heat, water or power bill I can't pay", href: '/money/?pick=utility' },
  { id: 'rent', label: 'Rent, or an eviction notice', href: '/money/?pick=rent' },
  { id: 'stay', label: 'A place to stay tonight', href: '/stay-tonight/' },
  { id: 'cash', label: 'Cash fast, or another bill', href: '/money/?pick=cash' },
  { id: 'care', label: 'A doctor, a dentist or shots', href: '/care/' },
  { id: 'work', label: 'A job, or classes', href: '/work-and-learning/' },
];
export const WHO = [
  { id: 'kids', label: 'A baby or a child under 5', href: '/for/parents-young-kids/' },
  { id: 'older', label: 'Someone 60 or older', href: '/for/older-adults/' },
  { id: 'disability', label: 'Someone with a disability', href: '/for/disability-and-caregivers/' },
  { id: 'veteran', label: 'A veteran', href: '/veterans/' },
  { id: 'none', label: 'None of these, or skip', href: null },
];
// The page path without a pick, to look up its label.
export const routeOf = (href) => href.split(/[?#]/)[0];
