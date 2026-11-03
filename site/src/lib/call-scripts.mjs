// Short call scripts (#406, #1071): questions to ask when calling about a
// bill or late rent. They are questions, never legal or medical advice, and
// state no facts about any program, so they need no source. The full list is
// on /before-you-call/. A resource card shows one next to its Call button
// when the record names it with `call_script: <id>`.
export const CALL_SCRIPTS = [
  {
    id: 'utility',
    title: 'Calling the power, gas or water company about a bill',
    lines: [
      'My name is ____. My account number is ____.',
      'I got a notice dated ____. I cannot pay the full amount right now.',
      'Can I set up a payment plan? How much would each payment be?',
      'What is the last day before service is shut off?',
      'Is there any help program I should apply for?',
    ],
  },
  {
    id: 'landlord',
    title: 'Talking to a landlord about late rent',
    lines: [
      'My rent for ____ will be late. I can pay $____ on ____.',
      'Can we agree on a plan for the rest?',
      'Can you put what we agree to in writing, by text or email?',
    ],
  },
  {
    id: 'medical-bill',
    title: 'Calling a hospital or clinic billing office',
    lines: [
      'I have a bill dated ____ for $____. The account number is ____.',
      'Can you send me an itemized bill that lists each charge?',
      'Do you have a financial help program? How do I apply?',
      'Can I set up a payment plan while I apply?',
    ],
  },
];

export const callScript = (id) => CALL_SCRIPTS.find((s) => s.id === id);
