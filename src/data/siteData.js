// Site Configuration Data
export const SITE_NAME = "EcoBench";
export const SITE_TAGLINE = "Sustainable Smart Bench Technology";

export const NAV_ITEMS = {
  Home: "/",
  FAQs: "/faqs",
  "About Us": "/about",
  Contact: "/contact"
};

// Features Data
export const FEATURES = [
  {
    icon: "🌱",
    title: "Eco-Friendly",
    description: "Harnesses renewable solar energy to reduce environmental impact.",
    color: "green",
    stat: "100%",
    stat_label: "Renewable"
  },
  {
    icon: "🔋",
    title: "Smart Charging",
    description: "Provides reliable USB charging for mobile devices on campus.",
    color: "blue",
    stat: "5V",
    stat_label: "USB Output"
  },
  {
    icon: "📊",
    title: "Energy Monitoring",
    description: "Displays real-time power generation and energy usage data.",
    color: "yellow",
    stat: "24/7",
    stat_label: "Tracking"
  },
  {
    icon: "💺",
    title: "Comfortable Seating",
    description: "Designed with ergonomic seating for student comfort and usability.",
    color: "purple",
    stat: "4+",
    stat_label: "Seats"
  }
];

// Team Members Data
export const TEAM_MEMBERS = [
  {
    name: "Jigs C. Lactao",
    role: "Backend Developer & Electrical Engineer",
    image: "assets/img/member1.png",
    bio: "Developed the backend logic of the prototype website and contributed to the manual power generation system.",
    expertise: ["Backend Web Development", "Database Logic", "Manual Power Generation"],
    social: {
      facebook: "https://web.facebook.com/jigsuyaaaaaa",
      linkedin: "https://www.linkedin.com/in/jigs-lactao-122894387/",
      github: "https://github.com/jigsuyaaa"
    },
    color: "green"
  },
  {
    name: "Mariem O. Manato",
    role: "System Architect & Electrical Engineer",
    image: "assets/img/member2.png",
    bio: "Designed the overall system architecture and was responsible for the manual power generation mechanism.",
    expertise: ["System Architecture Design", "Manual Power Generation", "Energy Conversion"],
    social: {
      facebook: "https://web.facebook.com/yemakeki",
      linkedin: "https://www.linkedin.com/in/mariem-manato-97628b360/",
      github: "https://github.com/yemakeki"
    },
    color: "blue"
  },
  {
    name: "Audrey Nicole Q. Mesa",
    role: "Project Lead & UI/UX Designer",
    image: "assets/img/member3.png",
    bio: "Led the team, designed the UI/UX for both the monitoring system and the prototype website, and handled the solar component of the EcoBench.",
    expertise: ["UI/UX Design", "Web Interface Design", "Solar Systems Integration"],
    social: {
      facebook: "https://web.facebook.com/audreynicole.19",
      linkedin: "https://www.linkedin.com/in/audrey-nicole-mesa-b8895732a/",
      github: "https://github.com/msaudreyncl"
    },
    color: "yellow"
  },
  {
    name: "Marcus Cedric S. Pedrosa",
    role: "Monitoring System Developer & Hardware Engineer",
    image: "assets/img/member4.png",
    bio: "Managed both the backend development and hardware implementation of the EcoBench monitoring system.",
    expertise: ["IoT Systems", "Hardware Integration", "Monitoring & Data Systems"],
    social: {
      facebook: "https://web.facebook.com/marcuscedric.pedrosa",
      linkedin: "https://www.linkedin.com/in/marcus-cedric-pedrosa-1b58b0269/",
      github: "https://github.com/CedZzzzzzzzz"
    },
    color: "purple"
  },
  {
    name: "Quinn harvey G. Pineda",
    role: "Project Coordinator & Technical Specialist",
    image: "assets/img/member5.png",
    bio: "Coordinated project tasks and progress while providing technical support and implementation for the solar power component and overall system of the EcoBench.",
    expertise: ["Hardware Integration", "Solar Power Systems", "System Support & Integration"],
    social: {
      facebook: "https://web.facebook.com/Yevrah.pineda.7",
      linkedin: "https://www.linkedin.com/in/quinn-pineda/",
      github: "https://github.com/Blaesei"
    },
    color: "teal"
  }
];

// Project Stats
export const PROJECT_STATS = [
  { icon: "🎓", number: "5", label: "Team Members", description: "Dedicated innovators" },
  { icon: "⚡", number: "100%", label: "Solar Powered", description: "Clean energy" },
  { icon: "🌱", number: "0", label: "Carbon Emissions", description: "Zero footprint" },
  { icon: "💡", number: "1", label: "Innovative Solution", description: "Smart & sustainable" }
];

// Milestones/Timeline
export const MILESTONES = [
  {
    year: "2024",
    month: "Jan",
    title: "Project Inception",
    description: "Team formed and initial concept developed. Brainstorming sessions led to the EcoBench vision.",
    icon: "🚀",
    color: "green"
  },
  {
    year: "2024",
    month: "Mar",
    title: "Prototype Design",
    description: "Engineering designs and CAD models completed. First blueprints approved.",
    icon: "📐",
    color: "blue"
  },
  {
    year: "2025",
    month: "Jan",
    title: "Development Phase",
    description: "Building and testing the first prototype. Hardware and software integration ongoing.",
    icon: "⚙️",
    color: "yellow"
  },
  {
    year: "2025",
    month: "Jun",
    title: "Campus Deployment",
    description: "Installation at PUP Institute of Technology. Making sustainability accessible to all.",
    icon: "🎯",
    color: "purple"
  }
];

// Core Values
export const CORE_VALUES = [
  {
    icon: "🌍",
    title: "Sustainability",
    description: "Committed to environmental stewardship and renewable energy solutions"
  },
  {
    icon: "💡",
    title: "Innovation",
    description: "Pushing boundaries with creative technology and smart design"
  },
  {
    icon: "🤝",
    title: "Collaboration",
    description: "Working together to create meaningful impact for our community"
  },
  {
    icon: "🎯",
    title: "Excellence",
    description: "Striving for the highest quality in every aspect of our project"
  }
];

// Contact Information
export const CONTACT_INFO = {
  gcash: "09398428449",
  email: "ecobench.studio@pup.edu.ph",
  location: {
    name: "Polytechnic University of the Philippines",
    department: "Institute of Technology",
    address: "Sta. Mesa, Manila 1016",
    country: "Philippines"
  }
};

// FAQ Data
export const FAQ_ITEMS = [
  {
    category: "general",
    badge: "General",
    badgeClass: "badge-general",
    question: "What is EcoBench?",
    answer: "EcoBench is a sustainable smart bench designed specifically for the Polytechnic University of the Philippines Institute of Technology. It provides phone charging in public spaces using renewable and human-powered energy sources. The bench combines solar panels for harnessing solar energy with a manual hand-crank system as an alternative power source during low sunlight conditions."
  },
  {
    category: "general",
    badge: "General",
    badgeClass: "badge-general",
    question: "Where are EcoBenches located?",
    answer: "EcoBenches are strategically placed throughout the Polytechnic University of the Philippines Institute of Technology campus. You can view all bench locations and their real-time status by signing in to our management system."
  },
  {
    category: "general",
    badge: "General",
    badgeClass: "badge-general",
    question: "Is EcoBench free to use?",
    answer: "Yes! EcoBench is completely free for all students, faculty, and visitors of PUP Institute of Technology. Our mission is to provide accessible, sustainable charging solutions to the campus community."
  },
  {
    category: "charging",
    badge: "Charging",
    badgeClass: "badge-charging",
    question: "How many devices can charge simultaneously?",
    answer: "Each EcoBench features two USB charging ports located on both ends of the bench, allowing two users to charge their devices simultaneously. This design improves accessibility and convenience for multiple users."
  },
  {
    category: "charging",
    badge: "Charging",
    badgeClass: "badge-charging",
    question: "What devices are compatible with EcoBench?",
    answer: "EcoBench supports any device that can charge via USB. This includes smartphones, tablets, portable batteries, and other USB-compatible devices. You'll need to bring your own USB charging cable."
  },
  {
    category: "charging",
    badge: "Charging",
    badgeClass: "badge-charging",
    question: "How fast does EcoBench charge devices?",
    answer: "Charging speed depends on the current power source. Solar charging provides consistent power during daylight hours, comparable to standard wall chargers. Manual hand-crank charging is slower but provides emergency power when needed."
  },
  {
    category: "technical",
    badge: "Technical",
    badgeClass: "badge-technical",
    question: "How does the solar panel system work?",
    answer: "EcoBench uses integrated solar panels to convert sunlight into electrical energy. This energy is stored in batteries and can be used to charge devices even during cloudy conditions or at night, ensuring reliable power availability throughout the day."
  },
  {
    category: "technical",
    badge: "Technical",
    badgeClass: "badge-technical",
    question: "What is the manual hand-crank system?",
    answer: "The manual hand-crank is an alternative power source that converts human kinetic energy into electrical energy. During low sunlight conditions or emergencies, users can manually generate power by turning the crank, ensuring charging capability is always available."
  },
  {
    category: "dashboard",
    badge: "Dashboard",
    badgeClass: "badge-dashboard",
    question: "What is the EcoBench Dashboard?",
    answer: "The EcoBench Dashboard is an interactive management system that provides real-time monitoring of all benches. Sign in to view battery levels, power source status, charging port availability, bench locations, and more. The dashboard demonstrates full CRUD functionality for managing bench data."
  },
  {
    category: "dashboard",
    badge: "Dashboard",
    badgeClass: "badge-dashboard",
    question: "How do I access the Dashboard?",
    answer: "To access the full Dashboard with real-time monitoring, prototype information, and management features, you need to sign in. Click the 'Sign In' button at the top of the page to create an account or log in. Once signed in, you'll have access to the complete EcoBench management system."
  },
  {
    category: "dashboard",
    badge: "Dashboard",
    badgeClass: "badge-dashboard",
    question: "What can I see in the Dashboard?",
    answer: "The Dashboard provides comprehensive monitoring including battery status, power generation metrics, charging port availability, energy consumption data, environmental impact statistics, and detailed prototype specifications. You can also view bench locations and receive maintenance notifications."
  },
  {
    category: "maintenance",
    badge: "Maintenance",
    badgeClass: "badge-maintenance",
    question: "How do I report a malfunctioning bench?",
    answer: "If you encounter a malfunctioning EcoBench, please report it through our contact page or notify the campus facilities management. Include the bench location and a description of the issue. Our maintenance team will address it promptly."
  },
  {
    category: "maintenance",
    badge: "Maintenance",
    badgeClass: "badge-maintenance",
    question: "How often are the benches maintained?",
    answer: "EcoBenches undergo regular maintenance checks to ensure optimal performance. Solar panels are cleaned periodically, batteries are tested, and all charging ports are inspected. Maintenance schedules and status can be viewed through the management system."
  }
];
