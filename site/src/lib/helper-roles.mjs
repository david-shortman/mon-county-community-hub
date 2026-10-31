// Helper role cards (#404): "If someone tells you X, here are 3 things to do,"
// for people residents already trust. Each step is either a page on this site
// or a resource record from content/resources, so every phone number keeps its
// source and checked date. Steps state no facts of their own.
//
//   page: a route on this site, with `text` saying why to go there
//   resource: a slug in content/resources, with `text` saying what to do
export const ROLES = [
  {
    slug: 'teachers',
    name: 'Teachers and school staff',
    short: 'Teachers',
    situations: [
      {
        hears: 'A student says there is no food at home',
        steps: [
          { page: '/help/food/', text: 'Show the family where to get food today or this week, and help buying groceries every month.' },
          { resource: 'starting-points-family-programs', text: 'Families with young children can call Starting Points about its baby pantry and free family programs.' },
          { resource: 'wv-211', text: 'Anyone can call or text 211, any hour, and get pointed to local help.' },
        ],
      },
      {
        hears: 'A parent is worried about how their baby or toddler is growing',
        steps: [
          { resource: 'wv-birth-to-three-referral', text: 'Parents of children under 3 can refer their own child to WV Birth to Three.' },
          { page: '/families-and-kids/', text: 'More for young children: Pre-K, Head Start, playgroups and story times.' },
        ],
      },
      {
        hears: 'A family says their heat or power is about to be shut off',
        steps: [
          { page: '/utility-bills/', text: 'Who to call first, and programs that help with heat, water and electric bills.' },
          { resource: 'wv-211', text: 'Call or text 211, any hour, and get pointed to local help.' },
        ],
      },
    ],
  },
  {
    slug: 'faith-leaders',
    name: 'Pastors and faith leaders',
    short: 'Faith leaders',
    situations: [
      {
        hears: 'Someone has nowhere to sleep tonight',
        steps: [
          { page: '/stay-tonight/', text: 'Emergency shelter in Morgantown, with phone numbers and what to expect.' },
          { resource: 'wv-211', text: 'Call or text 211, any hour, and ask about a place to stay tonight.' },
        ],
      },
      {
        hears: 'Someone is behind on rent or has an eviction notice',
        steps: [
          { page: '/money/?pick=rent', text: 'Steps in order for someone behind on rent.' },
          { resource: 'legal-aid-wv-eviction-help', text: 'Someone facing eviction can call Legal Aid of WV for free legal help.' },
        ],
      },
      {
        hears: 'Someone talks about wanting to die, or is in an emotional crisis',
        steps: [
          { resource: '988-lifeline', text: 'Call or text 988 with them, or give them the number. It is free and open any hour.' },
          { text: 'If someone is in danger right now, call 911.' },
        ],
      },
    ],
  },
  {
    slug: 'librarians',
    name: 'Librarians and library staff',
    short: 'Librarians',
    situations: [
      {
        hears: 'Someone wants to apply for SNAP (food stamps)',
        steps: [
          { page: '/snap/', text: 'How to apply online at WV PATH, the state\'s free site, or by phone.' },
          { resource: 'apply-for-snap-wv-path', text: 'They can also call the state\'s help line about an application.' },
        ],
      },
      {
        hears: 'Someone wants to learn to read, or to learn English',
        steps: [
          { resource: 'lvmpc-adult-literacy', text: 'Literacy Volunteers gives adults free reading, writing and English lessons, one-on-one or in classes.' },
          { page: '/work-and-learning/', text: 'Adult classes and job help.' },
        ],
      },
      {
        hears: 'Someone is looking for a job',
        steps: [
          { resource: 'workforce-wv-morgantown-office', text: 'WorkForce West Virginia has job leads and job training.' },
          { page: '/work-and-learning/', text: 'More job help and training in Mon County.' },
        ],
      },
    ],
  },
  {
    slug: 'nurses',
    name: 'Nurses and health workers',
    short: 'Nurses',
    situations: [
      {
        hears: 'A patient cannot afford medicine or a dentist',
        steps: [
          { resource: 'health-right-clinic', text: 'Milan Puskar Health Right is a free clinic that also helps with prescriptions.' },
          { page: '/dental-and-prescriptions/', text: 'Dentists for people without dental insurance, and help paying for medicine.' },
        ],
      },
      {
        hears: 'A patient has no ride to an appointment',
        steps: [
          { resource: 'wv-medicaid-rides', text: 'Medicaid and WVCHIP members may be able to book a ride to covered care. Book at least 5 business days ahead.' },
          { page: '/medical-rides/', text: 'Medicaid rides and the bus, side by side.' },
        ],
      },
      {
        hears: 'A patient is turning 65 or is confused about Medicare',
        steps: [
          { resource: 'wv-ship-medicare-counseling', text: 'WV SHIP gives free Medicare help by phone, including choosing a plan.' },
          { page: '/turning-65/', text: 'When to sign up, and help paying Medicare costs.' },
        ],
      },
    ],
  },
  {
    slug: 'landlords',
    name: 'Landlords and property managers',
    short: 'Landlords',
    situations: [
      {
        hears: 'A tenant says they cannot pay this month\'s rent',
        steps: [
          { page: '/money/?pick=rent', text: 'Steps in order for someone behind on rent.' },
          { resource: 'wv-211', text: 'The tenant can call or text 211, any hour, and get pointed to local help.' },
        ],
      },
      {
        hears: 'A tenant cannot pay the power, gas or water bill',
        steps: [
          { page: '/utility-bills/', text: 'Who to call first, and programs that help with utility bills.' },
          { resource: 'lieap-heating-help', text: 'In winter, the state\'s LIEAP program helps with heating bills when its window is open.' },
        ],
      },
      {
        hears: 'A new tenant needs to start power, water, gas or trash',
        steps: [
          { page: '/moving-here/', text: 'Who serves homes here and how to start each service.' },
        ],
      },
    ],
  },
  {
    slug: 'bus-drivers',
    name: 'Bus drivers and transit staff',
    short: 'Bus drivers',
    situations: [
      {
        hears: 'A rider has nowhere to sleep tonight',
        steps: [
          { page: '/stay-tonight/', text: 'Emergency shelter in Morgantown, with phone numbers.' },
          { resource: 'wv-211', text: 'Call or text 211, any hour, and ask about a place to stay tonight.' },
        ],
      },
      {
        hears: 'A rider is a veteran who is homeless or about to lose housing',
        steps: [
          { resource: 'va-homeless-veterans-line', text: "The VA's line for veterans who are homeless or may lose their housing is open day and night." },
          { page: '/veterans/', text: 'The local VA clinic, the Vet Center, and more.' },
        ],
      },
      {
        hears: 'A rider needs to get to a medical visit',
        steps: [
          { resource: 'mountain-line-medical-trips', text: 'Mountain Line buses go to Ruby Memorial and Mon General. Call for trip times.' },
          { page: '/medical-rides/', text: 'Medicaid rides and the bus, side by side.' },
        ],
      },
    ],
  },
];

export const role = (slug) => ROLES.find((r) => r.slug === slug);
