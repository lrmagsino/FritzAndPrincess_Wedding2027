/**
 * Single source of truth for wedding content.
 * Anything the couple has not yet provided is marked with TBA so nothing is invented.
 */
export const TBA = "To be announced";

export const couple = {
  names: "Fritz & Princess",
  first: "Fritz",
  second: "Princess",
  dateLong: "Friday, April 23, 2027",
  date: "April 23, 2027",
  isoDate: "2027-04-23",
  location: "Antipolo, Rizal",
  tagline: "Together today, tomorrow, and always.",
};

export const navLinks = [
  { id: "welcome", label: "Home" },
  { id: "story", label: "Our Story" },
  { id: "details", label: "Wedding Details" },
  { id: "entourage", label: "Entourage" },
  { id: "dress-code", label: "Dress Code" },
  { id: "timeline", label: "Timeline" },
  { id: "wishes", label: "Wishes & Prayers" },
  { id: "rsvp", label: "RSVP" },
  { id: "gallery", label: "Gallery" },
];

export const storyMoments = [
  {
    label: "The first rumor",
    title: "Grade 5 · Lawang Bato Elementary School",
    paragraphs: [
      "They say love begins with a glance. But for Fritz and Princess, it began with a rumor!",
      "Back in Grade 5 at Lawang Bato Elementary School, Princess proudly announced, “Fritz has a crush on me!” The plot twist? Fritz didn’t even know she existed! Talk about being the leading lady before meeting the leading man!",
    ],
  },
  {
    label: "A moment beneath the tree",
    title: "The Chinese garter memory",
    paragraphs: [
      "But one day, he saw her playing Chinese garter beneath a talisay tree—and suddenly, that rumor started becoming reality.",
    ],
  },
  {
    label: "The beginning of them",
    title: "December 23, 2013",
    date: "December 23, 2013",
    paragraphs: ["Finally, on December 23, 2013, they became official."],
  },
  {
    label: "Miles between them",
    title: "Long-distance love",
    paragraphs: ["Then came long-distance love, countless video calls, and years of waiting."],
  },
  {
    label: "The question",
    title: "September 17, 2025 · Bali",
    date: "September 17, 2025",
    paragraphs: [
      "Until September 17, 2025, in Bali, Fritz finally popped the question.",
      "His romantic “Will you marry me?” received the unforgettable response: “Gago ka!”",
      "But thankfully, she said YES!",
    ],
  },
  {
    label: "The next chapter",
    title: "April 23, 2027 · Antipolo",
    date: "April 23, 2027",
    paragraphs: [
      "And now, on April 23, 2027, at the Parish of Immaculate Heart of Mary in Antipolo, their story reaches its sweetest chapter.",
    ],
  },
];

export const storyPhotos = [
  {
    src: "/story/story-01.png",
    width: 1044,
    height: 768,
    alt: "Grade VI, Section Rizal class photograph at Lawang Bato Elementary School for School Year 2009–2010, with red hearts marking two students.",
    caption: "The memories that started it all.",
  },
  {
    src: "/story/story-02.png",
    width: 768,
    height: 775,
    alt: "Princess and Fritz together in their school uniforms.",
    caption: "Before forever, there was childhood and a story waiting to unfold.",
  },
  {
    src: "/story/story-03.png",
    width: 768,
    height: 768,
    alt: "Fritz and Princess together at graduation in white caps and gowns.",
    caption: "A milestone celebrated side by side.",
  },
];

export const weddingEvents = [
  {
    id: "ceremony",
    title: "Ceremony",
    description: "Join us as we make our vows and begin this next chapter together.",
    imageSrc: "/venues/parish-immaculate-heart-of-mary.png",
    imageAlt:
      "Parish of the Immaculate Heart of Mary in Antipolo, photographed at night with the church and outdoor ceremony pavilion illuminated.",
    venue: "Parish of the Immaculate Heart of Mary",
    address: "Daang Bakal Road, Brgy. Dela Paz, Antipolo City",
    location: "Antipolo, Rizal",
    date: "April 23, 2027",
    time: "1:30 p.m.",
    notes: "Please arrive at least 15 minutes early to ensure a smooth start to the ceremony.",
    mapUrl: process.env.NEXT_PUBLIC_CEREMONY_MAP_URL || "https://maps.app.goo.gl/GQvUGWgypgrqnHnE6",
  },
  {
    id: "reception",
    title: "Reception",
    description: "Celebrate with us as we gather for the next part of our wedding day.",
    imageSrc: "/venues/garden-hive-reception.png",
    imageAlt:
      "Reception setup at The Garden Hive Events Place, with a floral wedding stage, gold seating, and a white chaise lounge.",
    venue: "The Garden Hive Events Place",
    address: "The Citywalk Bldg. ML Quezon St. Ext. Brgy San Roque, Antipolo City 1870",
    location: "Antipolo, Rizal",
    date: "April 23, 2027",
    time: "3:30 p.m.",
    notes:
      "Please enjoy cocktail hours. We prepared food and drinks for everyone. Kindly RSVP to help us plan accordingly.",
    mapUrl:
      process.env.NEXT_PUBLIC_RECEPTION_MAP_URL || "https://maps.app.goo.gl/g5DfCtYthcWQqNfG9",
  },
];

export interface EntourageMember {
  name: string;
  role?: string;
}

export interface EntourageGroup {
  title: string;
  members: EntourageMember[];
}

export interface EntourageCategory {
  id: string;
  title: string;
  groups: EntourageGroup[];
}

export const entourage: EntourageCategory[] = [
  {
    id: "principal-sponsors",
    title: "Principal Sponsors",
    groups: [
      {
        title: "Male Principal Sponsors",
        members: [
          { name: "Mr. Henry Cabatay" },
          { name: "Mr. Ariel Rubidy" },
          { name: "Mr. Rowel Ramirez" },
          { name: "Mr. Michael Clemente" },
          { name: "Mr. To be announced" },
          { name: "Mr. To be announced" },
        ],
      },
      {
        title: "Female Principal Sponsors",
        members: [
          { name: "Mrs. Nercylla Saquilayan" },
          { name: "Mrs. Maximiana Delina" },
          { name: "Mrs. Jovelyn Ramirez" },
          { name: "Mrs. Misal Pardinez" },
          { name: "Mrs. Neneth Cabatay" },
          { name: "Mrs. To be announced" },
        ],
      },
    ],
  },
  {
    id: "secondary-sponsors",
    title: "Secondary Sponsors",
    groups: [
      {
        title: "",
        members: [
          { role: "Best Man", name: "Jake Balbalec" },
          { role: "Matron of Honor", name: "Dianne Dela Cruz" },
          { role: "Maid of Honor", name: "Sheila Mae Espinosa" },
          { role: "Veil Sponsor", name: "Dianne Dela Cruz & Jerome Dela Cruz" },
          { role: "Cord Sponsor", name: "Desiree Ann Dichoso & Carlo Aportadera" },
          { role: "Candle Sponsor", name: "Sheila Mae Espinosa & Leo Neil Francisco" },
        ],
      },
    ],
  },
  {
    id: "groomsmen",
    title: "Groomsmen",
    groups: [
      {
        title: "",
        members: [
          { name: "Allanboy Asilo" },
          { name: "John Royce Gayapanao" },
          { name: "Lenj Jesther Magsino" },
          { name: "Jhasper Kim Ramirez" },
          { name: "Rusty Gayapanao" },
          { name: "Jerome Dela Cruz" },
          { name: "Karl Chester Aguas" },
          { name: "Jhomar Dacera" },
          { name: "Leo Neil Famadico" },
          { name: "Carlo Aportadera" },
          { name: "John Stephen Viente" },
        ],
      },
    ],
  },
  {
    id: "bridesmaids",
    title: "Bridesmaids",
    groups: [
      {
        title: "",
        members: [
          { name: "Freah Julia Vicente" },
          { name: "Rizzalou Gayapanao" },
          { name: "Aileen Rubidy" },
          { name: "Jhayra Kate Ramirez" },
          { name: "Rowena De Guzman" },
          { name: "Desiree Ann Dichoso" },
          { name: "Christine Amiel Guirre" },
          { name: "Janine Prado" },
          { name: "Kathlene Damolo" },
          { name: "Leslie Navarro" },
        ],
      },
    ],
  },
  {
    id: "bearers",
    title: "Bearers",
    groups: [
      {
        title: "",
        members: [
          { role: "Ring Bearer", name: "Light Russen Gayapanao" },
          { role: "Coin Bearer", name: "Sieghart Aero Dela Cruz" },
          { role: "Bible Bearer", name: "Tobias Jinn Dela Cruz" },
          { role: "Herald Bearer", name: "Rizz Thea Gayapanao" },
        ],
      },
    ],
  },
  {
    id: "flower-girls",
    title: "Flower Girls",
    groups: [
      {
        title: "",
        members: [
          { name: "Gianna Serene Gayapanao" },
          { name: "Giana Nicole Saquilayan" },
          { name: "Gabrielle Ann Dichoso" },
        ],
      },
    ],
  },
];

export const palette = [
  { name: "Deep Burgundy", hex: "#4A0E1E", note: "Romance and depth" },
  { name: "Silver-Gray", hex: "#A7A9AF", note: "Elegance and balance" },
];

export const attire = [
  {
    id: "guest",
    title: "Guest Attire",
    recommendation: "Semi-Formal",
    description:
      "Semi-formal attire is encouraged for all guests. Any colour is welcome, so feel free to express your personal style while celebrating with Fritz and Princess.",
    note: "Any colour is welcome.",
  },
  {
    id: "ninong",
    title: "Ninong",
    recommendation: "Black Suit and Tie",
    description: "Ninongs are encouraged to wear a classic black suit paired with a formal tie.",
  },
  {
    id: "ninang",
    title: "Ninang",
    recommendation: "Champagne Gold",
    description:
      "Ninangs are encouraged to wear champagne-gold attire for an elegant and coordinated look.",
  },
];

export const timeline = [
  { time: "1:30 PM", dateTime: "13:30", title: "Guest Arrival & Seating", icon: "arrival" },
  {
    time: "2:00 PM",
    dateTime: "14:00",
    title: "Ceremony Begins",
    icon: "ceremony",
    highlight: true,
  },
  {
    time: "3:00 PM",
    dateTime: "15:00",
    title: "Ceremony Ends & Photo Session with the Couple",
    icon: "photo",
  },
  {
    time: "4:00 PM",
    dateTime: "16:00",
    title: "Travel to Reception Venue",
    icon: "travel",
    highlight: true,
  },
  { time: "4:30 PM", dateTime: "16:30", title: "Cocktail Hour", icon: "cocktail" },
  {
    time: "5:00 PM",
    dateTime: "17:00",
    title: "Reception Starts",
    icon: "reception",
    highlight: true,
  },
  { time: "5:30 PM", dateTime: "17:30", title: "Early Dinner", icon: "dinner" },
  { time: "6:30 PM", dateTime: "18:30", title: "Toasts & Games", icon: "toasts" },
  {
    time: "7:15 PM",
    dateTime: "19:15",
    title: "First Dance & Cake Cutting",
    icon: "dance",
    highlight: true,
  },
  {
    time: "7:45 PM",
    dateTime: "19:45",
    title: "Open Dance Floor & Group Photos",
    icon: "dance-floor",
  },
  {
    time: "8:15 PM",
    dateTime: "20:15",
    title: "Thank-You Message & Gift Giving",
    icon: "thanks",
  },
  {
    time: "9:00 PM",
    dateTime: "21:00",
    title: "End of Program",
    icon: "farewell",
    highlight: true,
  },
];

export const gallery = [
  {
    id: "g1",
    art: "globe",
    title: "The world",
    description:
      "Placeholder illustration: a silver-gray globe on a burgundy field, standing in for a future photo.",
  },
  {
    id: "g2",
    art: "compass",
    title: "Direction",
    description:
      "Placeholder illustration: a silver-gray compass with a burgundy north point, standing in for a future photo.",
  },
  {
    id: "g3",
    art: "plane",
    title: "Departure",
    description:
      "Placeholder illustration: a small airplane on a curved route, standing in for a future photo.",
  },
  {
    id: "g4",
    art: "route",
    title: "The route",
    description:
      "Placeholder illustration: a dotted travel route curving across a burgundy field, standing in for a future photo.",
  },
  {
    id: "g5",
    art: "heart",
    title: "Destination",
    description:
      "Placeholder illustration: a heart-shaped map pin, standing in for a future photo.",
  },
  {
    id: "g6",
    art: "monogram",
    title: "Fritz & Princess",
    description:
      "Placeholder illustration: the F and P monogram, standing in for a future couple photo.",
  },
];
