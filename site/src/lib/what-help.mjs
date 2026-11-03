// "What help might I get?" (#188): two short questions, then the pages that
// may help. Each answer is a page that already exists, so this file holds no
// facts: link text comes from each page's own label and summary. Answers live
// only in the web address (/help/what-help/<need>/<who>/).
// `href` may carry a door pick (?pick=rent), so the person lands on their steps.
export const NEEDS = [
  { id: 'food', topic: 'food', label: 'Food', hint: 'Today, this week, or every month', href: '/help/food/' },
  { id: 'bill', topic: 'a heat, water or power bill', label: "A heat, water or power bill I can't pay", href: '/money/?pick=utility' },
  { id: 'rent', topic: 'rent or an eviction notice', label: 'Rent, or an eviction notice', href: '/money/?pick=rent' },
  { id: 'stay', topic: 'a place to stay tonight', label: 'A place to stay tonight', href: '/stay-tonight/' },
  { id: 'cash', topic: 'cash or another bill', label: 'Cash fast, or another bill', href: '/money/?pick=cash' },
  { id: 'care', topic: 'a doctor, a dentist or shots', label: 'A doctor, a dentist or shots', href: '/care/' },
  { id: 'work', topic: 'a job or classes', label: 'A job, or classes', href: '/work-and-learning/' },
];
export const WHO = [
  { id: 'kids', home: 'a baby or a child under 5', label: 'A baby or a child under 5', href: '/for/parents-young-kids/' },
  { id: 'older', home: 'someone 60 or older', label: 'Someone 60 or older', href: '/for/older-adults/' },
  { id: 'disability', home: 'someone with a disability', label: 'Someone with a disability', href: '/for/disability-and-caregivers/' },
  { id: 'veteran', home: 'a veteran', label: 'A veteran', href: '/veterans/' },
  { id: 'none', label: 'None of these, or skip', href: null },
];
// `topic` and `home` name the picks in headings and search descriptions, so
// each of the 35 results pages has its own (#1553).
// The page path without a pick, to look up its label.
export const routeOf = (href) => href.split(/[?#]/)[0];
