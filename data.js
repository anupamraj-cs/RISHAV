/*
  ALL YOUR CONTENT LIVES HERE. Edit this file in VS Code, save, and refresh the page.

  Files (PDF or image) go in the assets/ folder:
    assets/profile.jpg                  your photo
    assets/resume.pdf                   your resume
    assets/certificates/aws.pdf         one file per certificate
    assets/achievements/excellence.pdf  one file per achievement

  "file"    = the PDF or image that opens when the card is clicked.
  "preview" = optional. A picture to show on the card (assets/certificates/aws.png),
              or the word "logo" to always show the company logo instead of the PDF.
              Leave it out and the page draws the first page of the PDF by itself,
              or uses the image directly when "file" is an image.
  "logo"    = optional. The issuing company's logo, for example assets/logos/ducat.png.
              Shown when the PDF cannot be previewed (or when preview is "logo").
              With no logo file, the card shows the issuer's name in large letters.
*/
window.PORTFOLIO = {
  name: "ANUPAM RAJ",
  roles: "Computer Science Student | Software Developer | AI Enthusiast",
  headline: "Computer Science Engineering student who builds modern applications with Python, Java, web technologies and MySQL.",

  photo: "assets/profile/image.jpeg",
  resume: "assets/resume/resume%20(2).pdf",

  university: "RGPV",
  degree: "B.Tech, Computer Science Engineering",
  batch: "2024 to 2028",
  semester: 5,        // current semester
  totalSem: 8,
  cgpa: "",
  focus: "Python, Java, DSA, OOP, Web Development, MySQL",
  location: "",
  email: "anupamraj.cs@gmail.com",
  phone: "",

  about: [
    "I am a Computer Science Engineering student at RGPV. My interests are software development, artificial intelligence, web development and solving real-world problems with technology.",
    "I enjoy learning new technologies, building useful software and improving my programming skills."
  ],

  links: [
    { label: "GitHub", url: "https://github.com/anupamraj-cs" },
    { label: "LinkedIn", url: "https://linkedin.com/in/anupamraj-cs" }
  ],

  // Extra education rows, for example Class XII. Example:
  // { title: "Class XII", place: "Your school", period: "2022 to 2024", score: "85%" }
  education: [],

  skills: [
    { group: "Languages", items: ["Python", "Java", "C", "C++", "JavaScript"] },
    { group: "Web", items: ["HTML", "CSS"] },
    { group: "Database", items: ["MySQL"] }
  ],

  projects: [
    {
      title: "Document Management System",
      desc: "Desktop application for storing and managing documents securely. It has login, upload, search, download and document management.",
      tech: ["Java Swing", "MySQL", "JDBC"],
      links: [{ label: "GitHub", url: "https://github.com/anupamraj-cs/Document_Management_System" }]
    },
    {
      title: "DigiPass: Digital Gate Pass System",
      desc: "Gate pass system for colleges. Students request passes online, and teachers, HODs and admin approve or reject them. It has secure login, real-time approval status and pass history.",
      tech: ["Flutter", "Firebase", "Dart", "Cloud Firestore"],
      links: [
        { label: "APK download", url: "https://github.com/anupamraj-cs/Digital-Pass/releases/download/BetaVersion/Digital.Pass.apk" },
        { label: "Live", url: "https://digi-pass.netlify.app/" },
        //{ label: "Report", url: "https://rishavtiwari.dpdns.org/report.html" }
      ]
    },
    {
      title: "Attendance Calculator",
      desc: "Predicts your attendance percentage, works out how many classes you need to reach a target, and shows how many classes you can skip.",
      tech: ["HTML", "CSS", "JavaScript"],
      links: [{ label: "Live", url: "Attendence-Calculator/index.html" }]
    },
    {
      title: "HOSTEL360",
      desc: "HOSTEL360 is a web-based Smart Hostel Management System designed to simplify hostel operations and improve communication between students, wardens, administrators, and security staff. The system provides features such as room and bed allocation, digital notices and messaging, outgoing pass requests, QR-based gate entry/exit, and hostel monitoring. It reduces paperwork, improves transparency, and provides a centralized platform for efficient hostel management.",          // add one or two lines about what it does
      tech: [],
      links: []
      
    }
  ],
  
  // Example: { role: "Web development intern", org: "Company", period: "Jun to Jul 2026", desc: "What you built." }
  experience: [],

  certificates: [
    { title: "C & Java Beginner", issuer: "DUCAT", date: "2024", file: "assets/certificates/Anupam%20Raj%20%20%28DUCAT%29.pdf" },
    { title: "C++ Skill Up", issuer: "Certificate", date: "", file: "assets/certificates/C%2B%2B%20Certificate.pdf" },
    { title: "Certificate", issuer: "ISRO / IIRS", date: "September 2026", file: "assets/certificates/Certificate.pdf" },
    { title: "Geodata Processing using Python and Machine Learning", issuer: "ISRO / IIRS", date: "April 2026", file: "assets/certificates/Geodata_Processing_using_Python_and_Machine_Learning_Certificate.pdf" },
  { title: "Deep Dive into Python", issuer: "Certificate", date: "", file: "assets/certificates/Deep%20Dive%20into%20Python-certificate%20%281%29.pdf" },
    ],

  achievements: [
    { text: "CERTIFICATE OF EXCELENCE (TOP PERFORMER) - (Project Based Java Training)", file: "assets/achievements/certificate%20of%20excellence%20.pdf" }
  ]
};
