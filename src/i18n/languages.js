export const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "/flags/en.svg",
    region: "europe",
    available: true,
    font: "inter",
  },

  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "/flags/fr.svg",
    region: "europe",
    available: true,
    font: "inter",
  },

  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "/flags/de.svg",
    region: "europe",
    available: true,
    font: "inter",
  },

  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "/flags/es.svg",
    region: "europe",
    available: true,
    font: "inter",
  },

  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "/flags/it.svg",
    region: "europe",
    available: false,
    font: "inter",
  },

  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "/flags/in.svg",
    region: "india",
    available: true,
    font: "devanagari",
  },

  {
    code: "kn",
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    region: "india",
    available: false,
    font: "kannada",
  },

  {
    code: "ta",
    name: "Tamil",
    nativeName: "தமிழ்",
    region: "india",
    available: false,
    font: "tamil",
  },

  {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    flag: "/flags/da.svg",
    region: "europe",
    available: false,
    font: "inter",
  },

  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "/flags/jp.svg",
    region: "asia",
    available: false,
    font: "japanese",
  },

  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "/flags/zh.svg",
    region: "asia",
    available: false,
    font: "chinese",
  },

  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "/flags/kr.svg",
    region: "asia",
    available: false,
    font: "korean",
  },

  {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    flag: "/flags/nl.svg",
    region: "europe",
    available: false,
    font: "inter",
  },

  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "/flags/ru.svg",
    region: "europe",
    available: false,
    font: "inter",
  },

  {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    flag: "/flags/no.svg",
    region: "europe",
    available: false,
    font: "inter",
  },

  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "/flags/pt.svg",
    region: "europe",
    available: false,
    font: "inter",
  },

  {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    flag: "/flags/sv.svg",
    region: "europe",
    available: false,
    font: "inter",
  },
];

export const localeCodes = languages.filter((language) => language.available).map((language) => language.code);
