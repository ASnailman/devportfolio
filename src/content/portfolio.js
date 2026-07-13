// =============================================================================
//  YOUR PORTFOLIO CONTENT — edit everything about yourself here.
// =============================================================================
//  This is the single source of truth for what shows up inside each app window.
//  You should almost never need to touch the React components to update your
//  portfolio — just change the data below. Each exported object/array maps to
//  one app window (Profile, Links, Skills, Apps/Projects).
//
//  Tips:
//   - Text supports plain strings. Multi-paragraph fields take an array of
//     strings, one paragraph per item.
//   - To use a profile picture, drop an image in the `public/` folder and set
//     `avatar` to its path, e.g. avatar: "/me.jpg". Leave it "" to show initials.
//   - Links open in a new tab automatically.
// =============================================================================

// ----- Profile app -----------------------------------------------------------
export const profile = {
  name: "Harris",
  role: "CS Student Attending University of Illinois Urbana-Champaign",
  avatar: "",              // e.g. "/me.jpg" (file lives in public/). "" = initials.
  location: "",            // e.g. "Toronto, Canada" — leave "" to hide.
  // Each string is its own paragraph.
  bio: [
    "Hey! I'm Harris. Welcome to my devportfolio. My favorite device of all time is the iPad mini, so I decided to model the design around that. This portfolio has yet to be completed, but it should be done soon!",
  ],
  // Quick key/value facts shown as a small list. Add or remove freely.
  facts: [
    { label: "Currently", value: "Building this portfolio" },
    { label: "Favorite Animal", value: "Penguins" },
  ],
};

// ----- Links app -------------------------------------------------------------
// Add as many as you like. `handle` is optional secondary text.
export const links = [
  { label: "GitHub", href: "https://github.com/ASnailman", handle: "@asnailman", icon: "/icons/github.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harriskhoo/", handle: "in/harriskhoo", icon: "/icons/linkedin.svg" },
  { label: "Email", href: "mailto:harriskhoo21+portfolio@gmail.com", handle: "", icon: "/icons/mail.svg" },
];

// ----- Skills app ------------------------------------------------------------
// Grouped skill chips. Add/remove groups and items as you wish.
export const skills = [
  { group: "Languages", items: [""] },
  { group: "Frameworks", items: [""] },
  { group: "Tools", items: [""] },
];

// ----- Apps / Projects app ---------------------------------------------------
// Each project becomes a card. `href` and `tags` are optional.
export const projects = [
  {
    name: "DevPortfolio",
    description: "An interactive, OS-style developer portfolio built with Next.js and Framer Motion.",
    href: "",
    tags: ["Next.js", "React", "Framer Motion"],
  },
  ,
  {
    name: "Temp",
    description: "I haven't finished updating the website, but more projects will be added soon!",
    href: "",
    tags: [""],
  },
];
