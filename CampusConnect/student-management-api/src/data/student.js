const maleGhibliImage = "https://i.ibb.co/TqK1XTQm/image-5.jpg";
const femaleGhibliImage = "https://i.ibb.co/h17CS0KL/hbtuGirl.jpg";

const convertGoogleDriveUrl = (url) => {
  if (!url || !url.includes('drive.google.com')) {
    return '';
  }
  const fileIdMatch1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const fileIdMatch2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const fileId = fileIdMatch1 ? fileIdMatch1[1] : fileIdMatch2 ? fileIdMatch2[1] : '';
  return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : '';
};

const getStudentImage = (providedImageUrl, isFemale = false) => {
  return isFemale ? femaleGhibliImage : maleGhibliImage;
};

const students = [
  {
    id: 1,
    name: "Chandra Shekhar",
    branch: "MCA",
    batch: "2024-26",
    isPlaced: false,
    image: getStudentImage("https://drive.google.com/file/d/1hbV17htCRlAISZ6Ny79eBZEWFwOZoNrz/view?usp=drivesdk"),
    pronouns: "he/him",
    location: "HBTU Kanpur",
    headline: "MERN Stack Developer | 105+ DSA Problems Solved | Building modern web applications",
    skills: {
      dsa: ["105+ Problems Solved", "Data Structures", "Algorithms", "Competitive Programming"],
      development: ["MongoDB", "Express.js", "React.js", "Node.js", "MERN Stack", "JavaScript"]
    },
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin/chandrsde"
    },
    rollNumber: "240231026",
    email: "cs350892@gmail.com",
    dsaProblems: 105
  },
  // ... (Add remaining students)
];

const tprStudents = [
  {
    id: 101,
    name: "Chandra Shekhar",
    branch: "MCA",
    batch: "2024-26",
    isPlaced: false,
    image: getStudentImage(undefined, false),
    pronouns: "he/him",
    location: "HBTU Kanpur",
    headline: "MERN Stack Developer | 150+ DSA Problems Solved | TPR MCA",
    skills: {
      dsa: ["150+ Problems Solved", "Data Structures", "Algorithms", "Competitive Programming"],
      development: ["MongoDB", "Express.js", "React.js", "Node.js", "MERN Stack", "JavaScript", "TypeScript"]
    },
    socialLinks: {
      github: "https://github.com/chandrasekhar",
      linkedin: "https://linkedin.com/in/chandrasekhar"
    },
    rollNumber: "240231026",
    email: "cs350892@gmail.com",
    dsaProblems: 150
  },
  // ... (Add remaining TPR students)
];

module.exports = { students, tprStudents, getStudentImage };