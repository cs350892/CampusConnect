const { getStudentImage } = require('./students');

const alumni = [
  {
    id: 1,
    name: "Chandra Shekhar",
    branch: "MCA",
    batch: "2022-24",
    image: getStudentImage(undefined, false),
    pronouns: "he/him",
    location: "HBTU Kanpur",
    headline: "Senior Software Engineer at Google",
    company: "Google",
    techStack: ["React", "Node.js", "TypeScript"],
    socialLinks: {
      github: "https://github.com/chandrasekhar",
      linkedin: "https://linkedin.com/in/chandrasekhar"
    },
    email: "cs350892@gmail.com"
  },
  // Add more alumni as needed
];

module.exports = alumni;