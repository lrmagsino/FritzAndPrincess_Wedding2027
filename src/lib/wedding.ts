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
  { id: "countdown", label: "Countdown" },
  { id: "calendar", label: "Wedding Calendar" },
  { id: "story", label: "Our Story" },
  { id: "entourage", label: "Entourage" },
  { id: "details", label: "Ceremony & Reception" },
  { id: "reminders", label: "Friendly Reminders" },
  { id: "wishes", label: "Wishes & Prayers" },
  { id: "gallery", label: "Gallery" },
  { id: "rsvp", label: "RSVP" },
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
    id: "invitation-page-one",
    title: "With the Blessing of Our Families",
    groups: [
      {
        title: "Parents of the Groom",
        members: [{ name: "Juliben Empleo" }, { name: "Jomely Viente" }],
      },
      {
        title: "Parents of the Bride",
        members: [{ name: "Roy Gayapanao" }, { name: "Jocelyn Gayapanao" }],
      },
      {
        title: "Male Principal Sponsors",
        members: [
          { name: "Mr. Henry Cabatay" },
          { name: "Mr. Ariel Rubidy" },
          { name: "Mr. Rowel Ramirez" },
          { name: "Mr. Michael Clemente" },
          { name: "To be announced" },
          { name: "To be announced" },
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
          { name: "To be announced" },
        ],
      },
    ],
  },
  {
    id: "invitation-page-two",
    title: "Our Beloved Entourage",
    groups: [
      {
        title: "Best Man",
        members: [{ name: "Jake Balbalec" }],
      },
      {
        title: "Matron of Honor",
        members: [{ name: "Dianne Dela Cruz" }],
      },
      {
        title: "Maid of Honor",
        members: [{ name: "Sheila Mae Espinosa" }],
      },
      {
        title: "Groomsmen",
        members: [
          { name: "Rusty Gayapanao" },
          { name: "John Royce Gayapanao" },
          { name: "Lenj Jesther Magsino" },
          { name: "Jerome Dela Cruz" },
          { name: "Jhasper Kim Ramirez" },
          { name: "Leo Neil Famadico" },
          { name: "Carlo Aportadera" },
          { name: "Karl Chester Aguas" },
          { name: "John Stephen Viente" },
        ],
      },
      {
        title: "Bridesmaids",
        members: [
          { name: "Freah Julia Empleo" },
          { name: "Rizzalou Gayapanao" },
          { name: "Rowena De Guzman" },
          { name: "Aileen Rubidy" },
          { name: "Jhayra Kate Ramirez" },
          { name: "Desiree Ann Dichoso" },
          { name: "Leslie Navarro" },
          { name: "Christine Amiel Guirre" },
          { name: "Janine Prado" },
          { name: "Kathlene Damolo" },
        ],
      },
      { title: "Ring Bearer", members: [{ name: "Tobias Jinn Dela Cruz" }] },
      { title: "Coin Bearer", members: [{ name: "Ethan Salvador" }] },
      { title: "Bible Bearer", members: [{ name: "Light Russen Gayapanao" }] },
      { title: "Herald Bearer", members: [{ name: "Rizz Thea Gayapanao" }] },
      {
        title: "Flower Girls",
        members: [
          { name: "Gianna Serene Gayapanao" },
          { name: "Gianna Nicole Saquilayan" },
          { name: "Gabrielle Ann Dichoso" },
        ],
      },
    ],
  },
];

export const friendlyReminders = {
  adultsOnly:
    "To give all our guests the opportunity to celebrate without having to worry about little eyes and ears, we politely request no children. Only the entourage and children of the immediate family are allowed.",
  gifts:
    "Your presence and prayers are the greatest gifts of all. But, should you still believe that a gift is worth giving, a small envelope for our future is a delightful blessing.",
  plusOnes:
    "We're keeping our guest list intentional and intimate. As much as we'd love to invite everyone, we are unable to accommodate plus ones at this time.",
  principalSponsors: ["GENTLEMEN: Black suit and tie", "LADIES: Formal attire in champagne gold"],
  guests:
    "Guests are welcome to wear any color of their choice, except white and its shades, in formal or semi-formal attire.",
};

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
