/**
 * Shared option sets for general data-collection fields.
 * Presentation-layer defaults only — these will be served by the FastAPI
 * reference-data endpoints once connected.
 */

export const LOCATION_OPTIONS = [
  "Bengaluru, India",
  "Chennai, India",
  "Hyderabad, India",
  "Pune, India",
  "Mumbai, India",
  "Delhi NCR, India",
  "Kolkata, India",
  "Coimbatore, India",
  "Kochi, India",
  "Ahmedabad, India",
  "Remote — India",
  "Remote — Global",
];

export const DEGREE_OPTIONS = [
  "B.E.",
  "B.Tech",
  "B.Sc",
  "BCA",
  "B.Com",
  "BBA",
  "M.E.",
  "M.Tech",
  "M.Sc",
  "MCA",
  "MBA",
  "Ph.D",
  "Diploma",
];

export const COURSE_OPTIONS = [
  "Computer Science and Engineering",
  "Information Technology",
  "Artificial Intelligence and Data Science",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Systems",
  "Data Science",
  "Business Administration",
  "Commerce",
  "Mathematics",
];

export const YEAR_OPTIONS = Array.from({ length: 16 }, (_, i) => String(2030 - i));

export const SKILL_OPTIONS = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C++",
  "SQL",
  "React",
  "Node.js",
  "FastAPI",
  "Django",
  "Spring Boot",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Git",
  "REST APIs",
  "System Design",
  "Data Structures & Algorithms",
  "Machine Learning",
  "Deep Learning",
  "Pandas",
  "Tableau",
  "Communication",
  "Problem Solving",
];

export const ROLE_OPTIONS = [
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "QA Engineer",
  "Business Analyst",
  "Product Analyst",
  "Support Engineer",
];

export const EXPERIENCE_OPTIONS = [
  "Fresher (0 years)",
  "0–1 years",
  "1–2 years",
  "2–4 years",
  "4–6 years",
  "6+ years",
];

export const CAREER_FIELD_OPTIONS = [
  "Software Development",
  "Data & Analytics",
  "Artificial Intelligence / ML",
  "Cloud & DevOps",
  "Cybersecurity",
  "Product Management",
  "Quality Assurance",
  "IT Support",
];

export const CERTIFICATION_OPTIONS = [
  "AWS Certified Cloud Practitioner",
  "AWS Certified Solutions Architect",
  "Microsoft Azure Fundamentals (AZ-900)",
  "Google Cloud Associate Engineer",
  "Oracle Java SE Programmer",
  "MongoDB Associate Developer",
  "Docker Certified Associate",
  "Meta Front-End Developer",
  "Google Data Analytics",
  "None yet",
];
