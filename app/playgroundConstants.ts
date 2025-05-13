export const quotes = [
  {
    author: "Louise Bourgeois",
    quote: "Art is a guaranty of sanity.",
    hebrewQuote: "אומנות היא ערבות לשפיות",
    hebrewAuthor: "לואיז בורז'ואה",
  },
  {
    author: "James Matthew Barrie",
    quote:
      "Would you like an adventure now, or would you like to have your tea first?",
    hebrewQuote: "האם תרצי את ההרפתקה שלך עכשיו, או שמא נשתה תה לפני כן?",
    hebrewAuthor: "ג'יימס מתיו בארי",
  },
  {
    author: "Lao Tzu",
    quote: "When I let go of what I am, I become what I might be.",
    hebrewQuote: "כשאני מרפה ממי שאני, אני הופך למה שאפשרי עבורי להיות",
    hebrewAuthor: "לאו צה",
  },
  {
    author: "Anaïs Nin",
    quote: "We don't see things as they are, we see them as we are.",
    hebrewQuote:
      "אנחנו לא רואים את הדברים כפי שהם, אנחנו רואים אותם כפי שאנחנו",
    hebrewAuthor: "אנאיס נין",
  },
  {
    author: "Virginia Woolf",
    quote: "Nothing has really happened until it's been described (in words).",
    hebrewQuote: "דבר לא באמת התרחש עד אשר תוצר במילים",
    hebrewAuthor: "וירג'יניה וולף",
  },
  {
    author: "Leonardo da Vinci",
    quote: "The noblest pleasure is the joy of understanding.",
    hebrewQuote: "העונג הנעלה מכל הוא האושר שבהבנה",
    hebrewAuthor: "לאונרדו דה וינצ'י",
  },
  {
    author: "Oscar Wilde",
    quote:
      "There are only two tragedies in life:\nOne is not getting what one wants, and the other is getting it.",
    hebrewQuote:
      "יש רק שתי טרגדיות בעולם הזה.\nהאחת היא לא לקבל את מה שרוצים והשנייה היא לקבל.",
    hebrewAuthor: "אוסקר ווילד",
  },
  {
    author: "Oscar Wilde",
    quote: "Life imitates art far more than art imitates life.",
    hebrewQuote: "החיים מחקים את האמנות יותר מאשר האמנות מחקה את החיים",
    hebrewAuthor: "אוסקר ווילד",
  },
];

interface InscriptionConfig {
  text: string;
  minSize: number;
  maxSize: number;
  minWidth: number;
  maxWidth: number;
}

export const INSCRIPTION: InscriptionConfig = {
  text: "האמת\nמכוסה\nקוצים",
  minSize: 40,
  maxSize: 144,
  minWidth: 320,
  maxWidth: 1492,
};

export const INSCRIPTION2: InscriptionConfig = {
  text: "החיים\nמוזרים",
  minSize: 40,
  maxSize: 144,
  minWidth: 320,
  maxWidth: 1492,
};

export const INSCRIPTION3: InscriptionConfig = {
  text: "ויני\nוידי\nויצ'י",
  minSize: 40,
  maxSize: 144,
  minWidth: 320,
  maxWidth: 1492,
};

export const INSCRIPTION4: InscriptionConfig = {
  text: "THERE'S\nNO ROSE\nWITHOUT\nA THORN",
  minSize: 24,
  maxSize: 92,
  minWidth: 320,
  maxWidth: 1492,
};

export const textOptions = [
  ["H", "a", "l", "b", "s", "c", "h", "a", "t", "t", "e", "n"],
  ["P", "e", "n", "u", "m", "b", "r", "a"],
  ["半", "影"],
];

export const items = [
  {
    title: "Plum Cave",
    image: "/plum-cave.webp",
    className: "absolute top-10 left-[10%] rotate-[-5deg]",
  },
  {
    title: "שחור",
    image: "/shakhor.webp",
    className: "absolute top-40 left-[25%] rotate-[-7deg]",
  },
  {
    title: "Lantern",
    image: "/lantern.webp",
    className: "absolute top-5 left-[40%] rotate-[8deg]",
  },
  {
    title: "Midbar | מדבר",
    image: "/midbar.webp",
    className: "absolute top-32 left-[64%] rotate-[10deg]",
  },
  {
    title: "Namer UI",
    image: "/namer-ui.webp",
    className: "absolute top-20 right-[35%] rotate-[2deg]",
  },
  {
    title: "שיינין ים",
    image: "/shining-yam.webp",
    className: "absolute top-24 left-[45%] rotate-[-7deg]",
  },
  {
    title: "PHA5E-Inspired Hero Section",
    image: "/pha5e-inspired-hero-section.webp",
    className: "absolute top-8 left-[30%] rotate-[4deg]",
  },
  {
    title: "פלאם קייב",
    image: "/plum-cave-hebrew.webp",
    className: "absolute top-34 left-[50%] rotate-[-2deg]",
  },
];
