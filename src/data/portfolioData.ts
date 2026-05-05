// ============================================================
// ALL PORTFOLIO DATA — Edit this file to update your portfolio
// ============================================================

export const personalInfo = {
  name: "Darshil Golaniya",
  tagline: "Python Developer · AI/ML Engineer · Full Stack Developer",
  roles: ["Python Developer", "AI/ML Engineer", "Full Stack Developer", ".NET Developer"],
  email: "gdarshil1203@gmail.com",
  phone: "+917046818092",
  linkedin: "https://linkedin.com/in/darshil-golaniya",
  github: "https://github.com/darshilprajapati",
  whatsapp: "https://wa.me/917046818092",
  summary:
    "I’m a developer with a strong interest in building practical, end-to-end solutions. My experience spans Python for data-driven and AI-based work, as well as full-stack development using .NET and React. I’ve worked on projects where I handled everything from backend APIs and database design to frontend interfaces, and I enjoy bringing different parts of a system together into something reliable and user-friendly.",
};

export const skills = [
  {
    category: "Languages",
    icon: "💻",
    items: ["Python", "C#", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    category: "AI / ML",
    icon: "🤖",
    items: ["Scikit-learn", "NumPy", "Pandas", "Matplotlib", "Groq API", "Prompt Engineering"],
  },
  {
    category: "Web Frameworks",
    icon: "🌐",
    items: ["React.js", "ASP.NET Core", "Django", "Flask", "Angular"],
  },
  {
    category: "Databases",
    icon: "🗄️",
    items: ["SQL Server", "MySQL", "PostgreSQL"],
  },
  {
    category: "Tools & DevOps",
    icon: "🛠️",
    items: [ "GitHub", "Postman", "VS Code", "Visual Studio", "Swagger", "REST APIs", "JWT"],
  },
  {
    category: "Concepts",
    icon: "⚙️",
    items: ["Machine Learning", "RBAC", "OOP", "MVC Architecture", "CRUD", "Dependency Injection"],
  },
];

export const experience = [
  {
    company: "Knovos India Pvt. Ltd.",
    role: ".NET Developer Intern",
    period: "Jan 2026 – Apr 2026",
    location: "Gandhinagar, India",
    color: "#00d4ff",
    points: [
      "Built a production-grade Web-Based Collaboration Portal using ASP.NET Core, React.js, and SQL Server with folder management and document handling.",
      "Implemented role-based access control (RBAC) and JWT authentication to enforce data security and access policies across user roles.",
      "Developed activity logging and audit dashboards using React.js with real-time REST API integration, improving system transparency.",
    ],
  },
  {
    company: "Prodigy Info Tech",
    role: "Web Development Intern",
    period: "May 2025 – Jun 2025",
    location: "Remote",
    color: "#7928ca",
    points: [
      "Designed and built responsive web pages using HTML, CSS, and JavaScript with focus on clean UI and cross-browser compatibility.",
    ],
  },
  {
    company: "TatvaSoft",
    role: "Angular & .NET Developer Trainee",
    period: "Mar 2025 – Apr 2025",
    location: "Ahmedabad, India",
    color: "#00ff88",
    points: [
      "Gained hands-on training in .NET Core backend development and Angular frontend.",
      "Built basic CRUD applications and understood component-based architecture.",
    ],
  },
];

export const aimlProjects = [
  {
    title: "Mental Health Analyzer",
    description:
      "Full-stack AI-powered mental health support app with real-time AI chatbot using Groq API (LLM). Implements sentiment-based mood tracking to detect stress levels and trigger SOS alerts.",
    tech: ["React.js", "Node.js", "MongoDB", "Groq API", "Python"],
    github: "https://github.com/darshilprajapati/MindCare",
    demo: "#",
    year: "2026",
    highlight: true,
  },
  {
    title: "Stock Predictor Application",
    description:
      "Machine learning-based stock price prediction system using Scikit-learn. Integrated Polygon API for live stock data and built a Django interface with Matplotlib visualizations.",
    tech: ["Python", "Django", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    github: "https://github.com/darshilprajapati/stock-navigator",
    demo: "#",
    year: "2025",
    highlight: false,
  },
  {
    title: "VoicePilot-AI",
    description:
      "Python-based voice assistant with natural language command processing. Supports YouTube playback, Wikipedia search, joke generation, real-time clock updates, and web navigation.",
    tech: ["Python", "speech_recognition", "pyttsx3", "pywhatkit"],
    github: "https://github.com/darshilprajapati/VoicePilot-AI",
    demo: "#",
    year: "2024",
    highlight: false,
  },
];

export const webProjects = [
  {
    title: "Web-Based Collaboration Portal",
    description:
      "Full-stack portal for secure document and folder management with RBAC, JWT authentication, activity logging and audit dashboards with real-time REST API integration.",
    tech: ["ASP.NET Core", "React.js", "SQL Server", "JWT", "REST API"],
    github: "https://github.com/darshilprajapati/Tatvasoft_internship_2025",
    demo: "#",
    year: "2026",
    highlight: true,
  },
  {
    title: "Django Online Quiz System",
    description:
      "Online quiz platform built with Django and HTML featuring question management, timed quizzes, and instant result evaluation with MIT License.",
    tech: ["Django", "HTML", "CSS", "Python"],
    github: "https://github.com/darshilprajapati/django-online-quiz-system",
    demo: "#",
    year: "2025",
    highlight: false,
  },
  {
    title: "ReactiveNews App",
    description:
      "React.js news aggregator consuming NewsAPI with category filtering, infinite scrolling, and optimized loading for smooth UX.",
    tech: ["React.js", "NewsAPI", "JavaScript"],
    github: "https://github.com/darshilprajapati/react-news-app",
    demo: "#",
    year: "2025",
    highlight: false,
  },
  {
    title: "TextForge (TextUtils)",
    description:
      "React.js web utility for text processing with case conversion, word/character counting, clipboard copy, text preview and a fully responsive UI.",
    tech: ["React.js", "JavaScript", "CSS"],
    github: "https://github.com/darshilprajapati/TextForge-react-app",
    demo: "#",
    year: "2025",
    highlight: false,
  },
  {
    title: "To-Do List GUI App",
    description:
      "Desktop task management application using Python and Tkinter with full CRUD functionality — task creation, updating, deletion, and live task counter.",
    tech: ["Python", "Tkinter"],
    github: "https://github.com/darshilprajapati/todo-app",
    demo: "#",
    year: "2025",
    highlight: false,
  },
];

export const education = [
  {
    institution: "LDRP Institute of Technology and Research",
    degree: "Bachelor of Engineering in Computer Engineering",
    period: "Sep 2023 – Jul 2026",
    location: "Gandhinagar, Gujarat",
    courses: ["Artificial Intelligence", "DBMS", "Operating Systems", "Software Engineering", "DSA"],
  },
  {
    institution: "The Maharaja Sayajirao University of Baroda",
    degree: "Diploma in Computer Engineering",
    period: "Mar 2020 – Jul 2023",
    location: "Vadodara, Gujarat",
    courses: ["Data Structures", "Network Security", "Web Development", "OOP"],
  },
];

export const certifications = [
  {
    title: "Python for Data Science",
    issuer: "NPTEL",
    icon: "🐍",
    color: "#00d4ff",
    image: "/certificates/nptel.png",
  },
  {
    title: "Supervised Machine Learning: Regression & Classification",
    issuer: "Coursera (Stanford University)",
    icon: "🎓",
    color: "#7928ca",
    image: "/certificates/coursera.png",
  },
  {
    title: "GenAI Powered Data Analytics",
    issuer: "Forage",
    icon: "🤖",
    color: "#00ff88",
    image: "/certificates/forage.png",
  },
  {
    title: "Career Edge",
    issuer: "TCS iON",
    icon: "⭐",
    color: "#ff6b35",
    image: "/certificates/tcs.png",
  },
];