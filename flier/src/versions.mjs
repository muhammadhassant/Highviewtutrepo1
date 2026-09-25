// The three flier versions. Everything that differs between them lives here.
// Prices are per hour; "was" is the previous price shown with a strike-through.

const PHONE_DISPLAY = '07392 202168';
const PHONE_INTL = '447392202168'; // 07392 202168 in international format for WhatsApp

const whatsapp = (note) => `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(`Hi! Maths tutoring enquiry (${note})`)}`;

// student review, shown above the footer on the versions that include `review`
const review = {
  quote: 'I received an A* in A-Level Maths and am now at UCL, thanks to Highview Tutors.',
  name: 'Mustafa Ahmed',
  by: 'Former A-Level student',
  photo: 'mustafa-ahmed.jpg', // in assets/
};

const fixedTimes = [
  { day: 'Monday', time: '6pm–8pm' },
  { day: 'Saturday', time: '2pm–4pm' },
];

export const versions = [
  {
    id: 'v1-highview-road',
    name: 'Version 1: 107 Highview Road',
    prices: [
      { label: 'Year 2–6', sub: 'Primary & 11+', was: 30, now: 25 },
      { label: 'Year 7–11', sub: 'KS3 & GCSE', was: 35, now: 30 },
      { label: 'Year 12–13', sub: 'A-Level', was: 40, now: 35 },
    ],
    where: { title: '107 Highview Road', detail: 'West Ealing, W13 0HL' },
    when: { flexible: true, title: 'Weekdays and weekends', detail: 'Flexible timings. Enquire to book.' },
    qr: whatsapp('Highview Road'),
    freeConsultation: false, // footer line "Book a free consultation" above the phone number
    review,
  },
  {
    id: 'v2-chardon-house',
    name: 'Version 2: Chardon House, Singapore Road',
    prices: [{ label: 'All ages 7–17', was: 25, now: 15 }],
    where: { title: 'Singapore Road (1–2 Chardon House)', detail: 'West Ealing, London, W13 0EP' },
    when: { flexible: false, slots: fixedTimes },
    qr: whatsapp('Chardon House'),
    freeConsultation: true,
  },
  {
    id: 'v3-west-ealing-library',
    name: 'Version 3: West Ealing Community Library',
    prices: [{ label: 'All ages 7–17', was: 25, now: 15 }],
    where: { title: 'West Ealing Community Library', detail: 'Opposite Sainsbury’s, W13 9BT' },
    when: { flexible: false, slots: fixedTimes },
    qr: whatsapp('West Ealing Library'),
    freeConsultation: false,
    review,
  },
];

export const contact = {
  phone: PHONE_DISPLAY,
  email: 'info@highviewtutors.com',
  web: 'www.highviewtutors.com',
  area: 'West Ealing',
};
