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
  role: "Developer & Penguin Enthusiast",
  avatar: "",              // e.g. "/me.jpg" (file lives in public/). "" = initials.
  location: "",            // e.g. "Toronto, Canada" — leave "" to hide.
  // Each string is its own paragraph.
  bio: [
    "Hey! I'm Harris. This is my little corner of the internet, styled like a desktop OS.",
    "Replace this text with a few sentences about who you are, what you build, and what you're into.",
  ],
  // Quick key/value facts shown as a small list. Add or remove freely.
  facts: [
    { label: "Currently", value: "Building this portfolio" },
    { label: "Favorite animal", value: "Penguins 🐧" },
    { label: "Email", value: "you@example.com" },
  ],
};

// ----- Links app -------------------------------------------------------------
// Add as many as you like. `handle` is optional secondary text.
export const links = [
  { label: "GitHub", href: "https://github.com/yourname", handle: "@yourname", icon: "🐙" },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourname", handle: "in/yourname", icon: "💼" },
  { label: "Email", href: "mailto:you@example.com", handle: "you@example.com", icon: "✉️" },
];

// ----- Skills app ------------------------------------------------------------
// Grouped skill chips. Add/remove groups and items as you wish.
export const skills = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
  { group: "Frameworks", items: ["React", "Next.js", "Node.js"] },
  { group: "Tools", items: ["Git", "Figma", "VS Code"] },
];

// ----- Apps / Projects app ---------------------------------------------------
// Each project becomes a card. `href` and `tags` are optional.
export const projects = [
  {
    name: "This Portfolio",
    description: "An interactive, OS-style developer portfolio built with Next.js and Framer Motion.",
    href: "",
    tags: ["Next.js", "React", "Framer Motion"],
  },
  {
    name: "Your Next Project",
    description: "A short description of what it does and why it's cool. Add a link and tags.",
    href: "",
    tags: ["Add", "Some", "Tags"],
  },
];
