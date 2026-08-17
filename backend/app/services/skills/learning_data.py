"""
Curated Role-Skill Mappings and High-Quality Learning Resources (YouTube Search / Course Links)
for FutureReady Skill Development Engine.
"""

from typing import List, Dict, Any

ROLE_SKILL_CATALOG: List[Dict[str, Any]] = [
    {
        "role": "Full Stack Developer",
        "description": "Build modern responsive web frontends, scalable backend APIs, database schemas, and deploy containerized apps.",
        "skills": [
            {
                "name": "HTML & CSS",
                "importance": "High",
                "topics": ["Semantic HTML", "Responsive CSS", "Flexbox/Grid", "CSS Variables"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "HTML & CSS Full Course - Beginner to Pro",
                        "description": "Comprehensive guide to semantic HTML, responsive CSS layouts, Flexbox and CSS Grid.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=HTML+CSS+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Semantic HTML, responsive CSS, Flexbox/Grid",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "JavaScript",
                "importance": "High",
                "topics": ["ES6+ Syntax", "DOM Manipulation", "Async/Await", "Fetch API", "Closures"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "JavaScript Full Course - Modern ES6+ & Async",
                        "description": "Master core JavaScript, DOM manipulation, asynchronous programming with async/await, and Fetch API.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=JavaScript+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "ES6+, DOM, async/await, Fetch API",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "React",
                "importance": "High",
                "topics": ["Components & Props", "Hooks (useState, useEffect)", "State Management", "Client Routing", "API Integration"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "React 19 & Hooks Full Course",
                        "description": "Deep dive into components, custom hooks, React Router, state architecture, and API consumption.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=React+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Components, hooks, routing, state, APIs",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Backend Development",
                "importance": "High",
                "topics": ["Node.js/Express", "FastAPI", "Spring Boot", "Middleware", "Routing"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Backend Engineering with Node.js, Express & FastAPI",
                        "description": "Build high-throughput RESTful servers, request validation, middleware pipelines, and error handling.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Node.js+Express+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Node.js/Express, FastAPI or Spring Boot",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Databases",
                "importance": "High",
                "topics": ["MongoDB", "PostgreSQL/SQL", "CRUD Operations", "Schema Design", "Indexing & Transactions"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "MongoDB & SQL Relational Database Architecture",
                        "description": "Master NoSQL document modeling in MongoDB and relational SQL queries, joins, and indexing.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=MongoDB+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "MongoDB/SQL, CRUD, schema design, indexing",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "REST APIs",
                "importance": "High",
                "topics": ["HTTP Methods", "Status Codes", "Request Validation", "API Contracts", "Pydantic"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "REST API Architecture & Design with FastAPI",
                        "description": "Build resilient REST APIs with HTTP status codes, structured error payloads, and automated OpenAPI docs.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=REST+API+tutorial+FastAPI",
                        "difficulty": "Intermediate",
                        "topic": "HTTP methods, status codes, validation, contracts",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Git & Deployment",
                "importance": "Medium",
                "topics": ["Git/GitHub", "Docker Basics", "CI/CD Workflows", "Cloud Deployment"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Git, GitHub, Docker & Cloud Deployment Full Course",
                        "description": "Learn version control, branching strategies, containerizing web services with Docker, and cloud hosting.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Git+GitHub+Docker+deployment+full+course",
                        "difficulty": "Beginner",
                        "topic": "Git/GitHub, Docker and deployment basics",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "AI Engineer",
        "description": "Architect artificial intelligence workflows, train machine learning models, implement RAG systems, fine-tune LLMs, and deploy MLOps pipelines.",
        "skills": [
            {
                "name": "Python",
                "importance": "High",
                "topics": ["OOP in Python", "Packages & Modules", "Data Structures", "Async Python", "APIs"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Python for AI & Advanced Software Engineering",
                        "description": "Advanced Python programming, object-oriented design, memory management, and package development.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Python+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Programming, OOP, packages and APIs",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "NumPy & Pandas",
                "importance": "High",
                "topics": ["Vectorized Operations", "Dataframes", "Data Cleaning", "Feature Transformation", "Aggregations"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "NumPy & Pandas for Data Analysis & AI",
                        "description": "Fast numerical computation with NumPy arrays and tabular data preprocessing with Pandas.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=NumPy+Pandas+full+course",
                        "difficulty": "Beginner",
                        "topic": "Numerical computing and data manipulation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Machine Learning",
                "importance": "High",
                "topics": ["Supervised Learning", "Unsupervised Learning", "Evaluation Metrics", "Model Validation", "Bias-Variance"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Machine Learning from Scratch to Production",
                        "description": "Linear models, tree ensembles, classification, regression, and model evaluation.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=machine+learning+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Supervised/unsupervised learning and evaluation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Deep Learning",
                "importance": "High",
                "topics": ["Neural Networks", "PyTorch/TensorFlow", "Backpropagation", "CNNs", "Optimization"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Deep Learning & Neural Networks with PyTorch",
                        "description": "Build and train multi-layer perceptrons, convolutional neural nets, and custom loss functions.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=deep+learning+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Neural networks, CNNs and training",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "NLP & Transformers",
                "importance": "High",
                "topics": ["Tokenization", "Embeddings", "Self-Attention", "Hugging Face", "Transformer Architectures"],
                "default_level": "Advanced",
                "resources": [
                    {
                        "title": "Transformers & Natural Language Processing with Hugging Face",
                        "description": "Learn transformer attention mechanisms, BERT, GPT tokenization, embeddings, and Hugging Face pipelines.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Hugging+Face+Transformers+NLP+tutorial",
                        "difficulty": "Advanced",
                        "topic": "Tokenization, embeddings, Transformers, Hugging Face",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "LLM / GenAI",
                "importance": "High",
                "topics": ["Prompt Engineering", "RAG (Retrieval-Augmented Generation)", "Vector Databases", "LangChain/LlamaIndex", "Evaluation"],
                "default_level": "Advanced",
                "resources": [
                    {
                        "title": "Generative AI, Large Language Models & RAG Architecture",
                        "description": "Build production generative AI applications, vector search retrieval, semantic caching, and LLM evaluation.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Generative+AI+LLM+RAG+full+course",
                        "difficulty": "Advanced",
                        "topic": "LLMs, RAG, prompting, APIs and evaluation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "MLOps",
                "importance": "Medium",
                "topics": ["Docker for ML", "Model Serving", "MLflow", "Model Monitoring", "Data Drift"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "MLOps - Packaging, Deploying & Monitoring AI Models",
                        "description": "Containerize ML inference endpoints with Docker, track experiments with MLflow, and monitor model performance.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=MLOps+Docker+MLflow+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Docker, model serving, tracking and monitoring",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Frontend Developer",
        "description": "Design responsive, accessible, high-performance web user interfaces using modern JavaScript frameworks.",
        "skills": [
            {
                "name": "HTML5",
                "importance": "High",
                "topics": ["Semantic Elements", "Forms & Validation", "ARIA Roles", "Accessibility Standards"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "HTML5 Semantic Structure & Web Accessibility",
                        "description": "Modern HTML5 elements, native validation, and accessible form structures.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=HTML5+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Semantic structure, forms and accessibility",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "CSS3",
                "importance": "High",
                "topics": ["Flexbox", "CSS Grid", "Responsive Design", "Animations", "Tailwind CSS"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "CSS3 Masterclass - Flexbox, Grid, Animations & Responsive Design",
                        "description": "Build fluid, responsive user interfaces across mobile and desktop displays.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=CSS+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Flexbox, Grid, responsive design and animations",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "JavaScript",
                "importance": "High",
                "topics": ["ES6+ Features", "DOM APIs", "Promises", "Async/Await", "Event Delegation"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Modern JavaScript (ES6+) In-Depth",
                        "description": "Master browser execution contexts, asynchronous event loops, and modern JS language features.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=JavaScript+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "ES6+, DOM, promises and async/await",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "TypeScript",
                "importance": "High",
                "topics": ["Type Annotations", "Interfaces & Types", "Generics", "Narrowing", "Tooling"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "TypeScript Full Course for Production React Apps",
                        "description": "Type-safe web development with interfaces, union types, generics, and compiler configurations.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=TypeScript+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Types, interfaces, generics and tooling",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "React",
                "importance": "High",
                "topics": ["React Hooks", "Custom Hooks", "Context API", "Component Lifecycle", "Performance"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "React Master Course - State, Routing, APIs & Next.js",
                        "description": "Build high-speed single page applications with modern React patterns.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=React+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Hooks, components, routing, state and APIs",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "UI/UX & Accessibility",
                "importance": "Medium",
                "topics": ["WCAG 2.1", "Keyboard Navigation", "Color Contrast", "Screen Readers", "Design Systems"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Web Accessibility (a11y) & Responsive UI/UX Design",
                        "description": "Design accessible, intuitive experiences meeting international accessibility guidelines.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=web+accessibility+responsive+design+tutorial",
                        "difficulty": "Beginner",
                        "topic": "Responsive UI, semantic UI and keyboard access",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Testing & Performance",
                "importance": "Medium",
                "topics": ["Vitest / Jest", "React Testing Library", "Lighthouse", "Code Splitting", "Bundle Optimization"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Frontend Testing & Web Performance Optimization",
                        "description": "Unit testing React components, Core Web Vitals profiling, lazy loading, and asset optimization.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=React+testing+performance+optimization+tutorial",
                        "difficulty": "Intermediate",
                        "topic": "Testing, debugging and frontend optimization",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Backend Developer",
        "description": "Architect high-throughput microservices, robust REST/gRPC APIs, secure database access layers, and containerized deployments.",
        "skills": [
            {
                "name": "Programming",
                "importance": "High",
                "topics": ["Python", "Java", "TypeScript", "Data Structures", "OOP & Design Patterns"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Backend Programming Fundamentals - Python, Java & TypeScript",
                        "description": "Strong foundational programming, data structures, algorithms, and concurrency patterns.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=backend+programming+fundamentals+Python+JavaScript+Java",
                        "difficulty": "Beginner",
                        "topic": "Strong Python, Java or JavaScript/TypeScript fundamentals",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "FastAPI",
                "importance": "High",
                "topics": ["Async Endpoints", "Pydantic V2", "Dependency Injection", "OpenAPI Docs", "Background Tasks"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "FastAPI Full Course - Production Python APIs",
                        "description": "Build async Python backends with automatic docs, JWT auth, dependency injection, and database integrations.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=FastAPI+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Python REST APIs, Pydantic, validation and async",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Spring Boot",
                "importance": "High",
                "topics": ["Spring Core", "Dependency Injection", "Spring Data JPA", "Spring Security", "Production Microservices"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Spring Boot 3 Full Course for Enterprise Backend",
                        "description": "Java enterprise backend development with Spring Boot, Hibernate, JPA, and RESTful web services.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Spring+Boot+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Java REST APIs, DI, JPA and production APIs",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Node.js & Express",
                "importance": "High",
                "topics": ["Event Loop", "Express Middleware", "Routing", "Streams", "Error Handling"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Node.js & Express.js Backend Architecture",
                        "description": "Server-side JavaScript, non-blocking I/O, middleware pipelines, authentication, and REST routing.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Node.js+Express+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Server-side JS, routing, middleware and REST",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Databases",
                "importance": "High",
                "topics": ["PostgreSQL", "MongoDB", "Indexing Strategies", "ACID Transactions", "Connection Pooling"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "SQL & NoSQL Database Architecture - Design, Indexes & Performance",
                        "description": "Master relational PostgreSQL query optimization and NoSQL document modeling.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=SQL+database+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "SQL/NoSQL, data modeling, indexes and transactions",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "API Security",
                "importance": "High",
                "topics": ["JWT Authentication", "OAuth 2.0", "Role-Based Access Control", "Rate Limiting", "CORS & CSRF"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "REST API Security - JWT, OAuth 2.0 & Defense in Depth",
                        "description": "Secure API endpoints against unauthorized access, SQL injections, and DDoS via rate limiters.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=REST+API+security+JWT+OAuth+tutorial",
                        "difficulty": "Intermediate",
                        "topic": "Authentication, authorization, validation and rate limiting",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Docker & Deployment",
                "importance": "Medium",
                "topics": ["Dockerfiles", "Docker Compose", "Multi-Stage Builds", "Environment Config", "Health Checks"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Docker for Backend Developers & Cloud Deployment",
                        "description": "Containerize backend web services, manage microservices with Docker Compose, and deploy to cloud platforms.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Docker+FastAPI+deployment+tutorial",
                        "difficulty": "Beginner",
                        "topic": "Containers, environment variables and deployment",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Data Scientist",
        "description": "Extract actionable statistical insights, train predictive models, perform exploratory data analysis, and present findings.",
        "skills": [
            {
                "name": "Python",
                "importance": "High",
                "topics": ["Python for Data Analysis", "Automation", "Jupyter Notebooks", "Data Structures"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Python for Data Science & Analytics",
                        "description": "Hands-on data analysis, scripting, automation, and exploratory data workflows in Python.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Python+for+data+science+full+course",
                        "difficulty": "Beginner",
                        "topic": "Python for analysis and automation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "SQL",
                "importance": "High",
                "topics": ["Complex Joins", "Window Functions", "CTEs", "Aggregations", "Query Optimization"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Advanced SQL for Data Scientists & Analysts",
                        "description": "Master window functions, common table expressions, data aggregation, and analytical SQL.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=SQL+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Queries, joins, aggregations and windows",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Statistics",
                "importance": "High",
                "topics": ["Probability Distributions", "Hypothesis Testing", "A/B Testing", "P-Values", "Confidence Intervals"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Statistics & Probability for Data Science",
                        "description": "Foundational statistics, normal distributions, hypothesis testing, and statistical decision-making.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=statistics+probability+data+science+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Probability, distributions, hypothesis testing",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Pandas & NumPy",
                "importance": "High",
                "topics": ["Data Cleaning", "Imputation", "Feature Engineering", "Reshaping", "Array Computations"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Pandas & NumPy Complete Data Wrangling Course",
                        "description": "Clean messy real-world datasets, handle missing values, reshape data, and compute vectorized stats.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Pandas+NumPy+data+science+full+course",
                        "difficulty": "Beginner",
                        "topic": "Cleaning, transformation and numerical analysis",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Data Visualization",
                "importance": "Medium",
                "topics": ["Matplotlib", "Seaborn", "Plotly", "Dashboarding", "Data Storytelling"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Data Visualization with Matplotlib, Seaborn & Plotly",
                        "description": "Create compelling charts, statistical heatmaps, interactive plots, and visual dashboards.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Matplotlib+Seaborn+data+visualization+full+course",
                        "difficulty": "Beginner",
                        "topic": "Matplotlib, Seaborn and storytelling",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Machine Learning",
                "importance": "High",
                "topics": ["Regression", "Classification", "Clustering (K-Means)", "Dimensionality Reduction", "Model Tuning"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Applied Machine Learning for Data Scientists",
                        "description": "Build predictive models with scikit-learn, evaluate precision/recall/F1, and tune hyperparameters.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=machine+learning+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Regression, classification, clustering and evaluation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Projects & MLOps Basics",
                "importance": "Medium",
                "topics": ["End-to-End Projects", "Streamlit/Gradio", "Model Packaging", "Reporting"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "End-to-End Data Science Projects & Deployment",
                        "description": "Build complete portfolio projects from raw data acquisition to interactive web app deployment.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=data+science+end+to+end+project+MLOps",
                        "difficulty": "Beginner",
                        "topic": "End-to-end projects and deployment",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Machine Learning Engineer",
        "description": "Engineer scalable machine learning pipelines, optimize deep neural networks, and deploy low-latency inference APIs.",
        "skills": [
            {
                "name": "Python",
                "importance": "High",
                "topics": ["Production Python", "OOP", "Unit Testing", "Profiling", "APIs"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Production Python for ML Engineers",
                        "description": "High-performance Python coding, test-driven development, and package management for ML.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Python+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Production Python, OOP, packages and testing",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "ML Algorithms",
                "importance": "High",
                "topics": ["Gradient Boosting", "Random Forests", "SVMs", "Ensemble Methods", "Cross Validation"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Classical Machine Learning Algorithms & Optimization",
                        "description": "Mathematical intuition and coding implementations of XGBoost, LightGBM, Random Forests, and SVMs.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=machine+learning+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Classical ML algorithms and evaluation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Scikit-learn",
                "importance": "High",
                "topics": ["Pipelines", "ColumnTransformers", "Feature Scaling", "GridSearchCV", "Custom Estimators"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Scikit-Learn Production Pipelines & Preprocessing",
                        "description": "Build leakage-free machine learning pipelines, custom feature transformers, and automated tuning.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=scikit+learn+full+course+tutorial",
                        "difficulty": "Intermediate",
                        "topic": "Pipelines, preprocessing and model selection",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Deep Learning",
                "importance": "High",
                "topics": ["PyTorch", "TensorFlow", "GPU Acceleration", "Transformers", "Transfer Learning"],
                "default_level": "Advanced",
                "resources": [
                    {
                        "title": "Deep Learning with PyTorch - Zero to Mastery",
                        "description": "Train deep neural networks on GPUs, implement computer vision and NLP architectures with PyTorch.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=PyTorch+deep+learning+full+course",
                        "difficulty": "Advanced",
                        "topic": "PyTorch/TensorFlow, neural networks and training",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Model Serving",
                "importance": "High",
                "topics": ["FastAPI", "ONNX Runtime", "Triton Server", "Batch Inference", "Latency Optimization"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Deploying Machine Learning Models with FastAPI & Docker",
                        "description": "Expose models through high-throughput REST APIs, optimize tensor loading, and minimize latency.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=FastAPI+machine+learning+model+deployment",
                        "difficulty": "Intermediate",
                        "topic": "FastAPI, inference APIs and model loading",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "MLOps",
                "importance": "High",
                "topics": ["MLflow", "Experiment Tracking", "Model Registry", "Feature Stores", "Data Drift"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "MLOps Complete Guide - Tracking, CI/CD & Model Registry",
                        "description": "Implement automated ML lifecycle pipelines using MLflow, DVC, and automated retraining triggers.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=MLflow+MLOps+full+course",
                        "difficulty": "Intermediate",
                        "topic": "MLflow, tracking, registry and monitoring",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Docker & Cloud",
                "importance": "Medium",
                "topics": ["Docker Containers", "AWS SageMaker", "Kubernetes", "Cloud GPU Serving"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Containerizing & Deploying ML on Cloud Infrastructure",
                        "description": "Package models into lightweight Docker containers and deploy to cloud Kubernetes clusters.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Docker+MLOps+cloud+deployment+tutorial",
                        "difficulty": "Beginner",
                        "topic": "Containerization and cloud deployment",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "DevOps Engineer",
        "description": "Automate continuous integration/continuous deployment pipelines, manage container orchestration, and ensure cloud infrastructure reliability.",
        "skills": [
            {
                "name": "Linux",
                "importance": "High",
                "topics": ["Shell Scripting", "Systemd Services", "File Permissions", "Process Management", "Networking Basics"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Linux System Administration & Shell Scripting Full Course",
                        "description": "Master command line navigation, Bash automation, file systems, systemd, and Linux networking.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Linux+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Shell, processes, permissions and networking",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Git & GitHub",
                "importance": "High",
                "topics": ["Branching Strategies", "Pull Requests", "Merge Conflicts", "Rebasing", "Hooks"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Git & GitHub Workflow for Professional DevOps",
                        "description": "Git flow, trunk-based development, automated pull request workflows, and release tagging.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Git+GitHub+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Branching, pull requests and workflows",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Docker",
                "importance": "High",
                "topics": ["Images & Containers", "Layer Caching", "Docker Networking", "Volume Mounts", "Docker Compose"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Docker Complete Mastery - Containers & Networking",
                        "description": "Create production container images, multi-container orchestration, and volume persistence.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Docker+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Images, containers, networks and volumes",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Kubernetes",
                "importance": "High",
                "topics": ["Pods & Deployments", "Services & Ingress", "ConfigMaps & Secrets", "HPA Scaling", "Helm Charts"],
                "default_level": "Advanced",
                "resources": [
                    {
                        "title": "Kubernetes (k8s) Full Architecture Course",
                        "description": "Deploy, scale, and manage automated container clusters, zero-downtime rollouts, and ingress routing.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Kubernetes+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Pods, deployments, services and scaling",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "CI/CD",
                "importance": "High",
                "topics": ["GitHub Actions", "GitLab CI", "Automated Testing", "Artifact Building", "Deployment Pipelines"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "CI/CD Automation with GitHub Actions & Docker",
                        "description": "Build end-to-end continuous integration pipelines, automated security scanning, and cloud deployments.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=CI+CD+GitHub+Actions+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Build, test and deployment pipelines",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Cloud",
                "importance": "High",
                "topics": ["AWS EC2", "S3", "VPC Networking", "IAM Roles", "Security Groups"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "AWS Cloud Foundations for DevOps Engineers",
                        "description": "Core cloud compute, scalable storage, virtual private clouds, and identity management on AWS.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=AWS+cloud+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "AWS/Azure/GCP core services",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Monitoring",
                "importance": "Medium",
                "topics": ["Prometheus", "Grafana", "Log Aggregation", "Alertmanager", "System Observability"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Prometheus & Grafana Observability Masterclass",
                        "description": "Collect infrastructure metrics, create dynamic Grafana monitoring dashboards, and configure alerts.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Prometheus+Grafana+monitoring+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Logs, metrics, alerts and observability",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Cloud Engineer",
        "description": "Architect resilient cloud-native infrastructures, configure IAM security policies, write Infrastructure-as-Code (Terraform), and optimize cloud costs.",
        "skills": [
            {
                "name": "Linux & Networking",
                "importance": "High",
                "topics": ["Linux Administration", "TCP/IP", "DNS Resolution", "HTTP/HTTPS", "Subnetting"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Computer Networking & Linux Fundamentals for Cloud",
                        "description": "In-depth guide to IP addressing, subnets, routing tables, DNS, and Linux system management.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Linux+networking+full+course",
                        "difficulty": "Beginner",
                        "topic": "Linux administration, TCP/IP, DNS and HTTP",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Cloud Platform",
                "importance": "High",
                "topics": ["AWS/Azure/GCP", "Compute (EC2/Lambda)", "Storage (S3)", "VPC Networking", "Load Balancers"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "AWS Cloud Practitioner & Solutions Architect",
                        "description": "Design secure, highly available, and cost-effective cloud architectures on AWS.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=AWS+Cloud+Practitioner+full+course",
                        "difficulty": "Beginner",
                        "topic": "AWS/Azure/GCP compute, storage, IAM and networking",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "IAM & Security",
                "importance": "High",
                "topics": ["IAM Policies", "Least Privilege", "KMS Encryption", "Secrets Manager", "Security Hub"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Cloud IAM Security, Permissions & Access Management",
                        "description": "Implement zero-trust security, IAM role federation, KMS key management, and secrets rotation.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=AWS+IAM+cloud+security+tutorial",
                        "difficulty": "Intermediate",
                        "topic": "Identity, permissions, secrets and cloud security",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Docker",
                "importance": "High",
                "topics": ["Containers", "Multi-stage Builds", "Registry Management (ECR)", "Security Scanning"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "Docker Containers for Cloud Deployments",
                        "description": "Package applications for cloud portability and serverless container deployments.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Docker+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Containers and container deployment",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Kubernetes",
                "importance": "High",
                "topics": ["EKS/GKE", "Managed Control Planes", "Node Groups", "Ingress Controllers", "Storage Classes"],
                "default_level": "Advanced",
                "resources": [
                    {
                        "title": "Managed Kubernetes on Cloud (AWS EKS & GKE)",
                        "description": "Deploy enterprise workloads on managed cloud Kubernetes clusters with autoscaling.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Kubernetes+full+course+freeCodeCamp",
                        "difficulty": "Intermediate",
                        "topic": "Container orchestration and services",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Terraform",
                "importance": "High",
                "topics": ["Infrastructure as Code", "HCL Syntax", "State Files", "Modules", "Terraform Cloud"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Terraform (IaC) Masterclass - Automating Cloud Infrastructure",
                        "description": "Provision reproducible cloud environments using HashiCorp Terraform modules and state management.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Terraform+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Infrastructure as code",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Monitoring & Cost",
                "importance": "Medium",
                "topics": ["CloudWatch", "Cost Explorer", "Budgets & Alarms", "Billing Optimization"],
                "default_level": "Beginner",
                "resources": [
                    {
                        "title": "CloudWatch Monitoring, Log Groups & Cost Optimization",
                        "description": "Set up automated health alarms, analyze cloud spend, and optimize underutilized cloud resources.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=AWS+CloudWatch+monitoring+tutorial",
                        "difficulty": "Beginner",
                        "topic": "Cloud monitoring, logging, alerts and cost awareness",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Data Engineer",
        "description": "Build high-capacity ETL/ELT pipelines, distributed stream/batch data processing architectures, and enterprise data warehouses.",
        "skills": [
            {
                "name": "Python",
                "importance": "High",
                "topics": ["Data Processing", "Automation", "PySpark", "APIs", "Data Validation"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Python for Data Engineering & Pipeline Automation",
                        "description": "Extract, clean, and automate large data batch flows using modern Python libraries.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Python+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Data processing and automation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "SQL",
                "importance": "High",
                "topics": ["Analytical SQL", "Window Functions", "Partitioning", "Execution Plans", "Indexing"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Advanced SQL & Database Performance for Data Engineering",
                        "description": "Write high-performance queries for multi-million row datasets with indexing and partitioning.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=SQL+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Advanced queries, joins and optimization",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "ETL / ELT",
                "importance": "High",
                "topics": ["Pipeline Architecture", "Data Cleaning", "Incremental Loads", "Idempotency", "Data Quality"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Building Production ETL & ELT Data Pipelines",
                        "description": "Design reliable data extraction, transformation, schema validation, and loading architectures.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=ETL+ELT+data+engineering+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Data pipelines and transformation",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Apache Spark",
                "importance": "High",
                "topics": ["Distributed Computing", "PySpark", "DataFrames", "Spark SQL", "RDDs & Partitioning"],
                "default_level": "Advanced",
                "resources": [
                    {
                        "title": "Apache Spark & PySpark Masterclass for Big Data",
                        "description": "Process big data in parallel using PySpark dataframes, caching, and cluster computing.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=PySpark+Apache+Spark+full+course",
                        "difficulty": "Advanced",
                        "topic": "Distributed processing and PySpark",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Airflow",
                "importance": "High",
                "topics": ["DAGs", "Tasks & Operators", "Schedules & Triggers", "Backfills", "Error Notifications"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Apache Airflow - Workflow Orchestration & Automation",
                        "description": "Schedule, monitor, and orchestrate complex dependency-driven data workflows with Python DAGs.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Apache+Airflow+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Workflow orchestration and scheduling",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Data Warehousing",
                "importance": "High",
                "topics": ["Star Schema", "Snowflake Schema", "Fact & Dimension Tables", "Slowly Changing Dimensions", "BigQuery/Snowflake"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Data Warehousing Architecture & Dimensional Modeling",
                        "description": "Design analytical dimensional schemas, star schema models, and columnar data warehouses.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=data+warehouse+star+schema+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Star schema, fact/dimension tables and analytics",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Cloud Data Engineering",
                "importance": "Medium",
                "topics": ["AWS S3 Data Lake", "Glue", "Athena", "Redshift / Snowflake", "IAM Data Security"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Cloud Data Engineering on AWS & Snowflake",
                        "description": "Build serverless data lakes, query data in S3 with Athena, and automate cloud data lakes.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=cloud+data+engineering+AWS+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Cloud storage, pipelines and managed services",
                        "type": "video"
                    }
                ]
            }
        ]
    },
    {
        "role": "Cybersecurity Engineer",
        "description": "Defend networks and systems against unauthorized access, conduct security vulnerability assessments, configure identity management, and orchestrate incident responses.",
        "skills": [
            {
                "name": "Networking",
                "importance": "High",
                "topics": ["TCP/IP", "DNS & DHCP", "HTTP/HTTPS", "Ports & Protocols", "Subnets & Routing"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Computer Networking Security Fundamentals",
                        "description": "Understand network protocols, packet structure, firewalls, and port routing for defense.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=computer+networking+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "TCP/IP, DNS, HTTP, ports and routing",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Linux",
                "importance": "High",
                "topics": ["Linux Security", "File Permissions", "Sudoers", "SSH Hardening", "System Logs"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Linux for Cybersecurity & Ethical Hacking",
                        "description": "Linux system commands, process management, user permissions, and host security hardening.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Linux+full+course+freeCodeCamp",
                        "difficulty": "Beginner",
                        "topic": "Commands, permissions, processes and administration",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Python",
                "importance": "High",
                "topics": ["Security Automation", "Port Scanners", "Log Parsing", "API Scripting", "Tooling"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Python for Cybersecurity & Security Automation",
                        "description": "Write custom security tooling, automated vulnerability scanners, and log analyzers in Python.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Python+for+cybersecurity+tutorial",
                        "difficulty": "Beginner",
                        "topic": "Automation, scripting and security tooling",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Web Security",
                "importance": "High",
                "topics": ["OWASP Top 10", "SQL Injection", "XSS", "CSRF", "Secure Coding Practices"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "OWASP Top 10 Web Application Security Course",
                        "description": "Understand, detect, and mitigate the most dangerous web application security vulnerabilities.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=OWASP+Top+10+web+security+full+course",
                        "difficulty": "Intermediate",
                        "topic": "OWASP Top 10 and secure coding",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Security Tools",
                "importance": "High",
                "topics": ["Wireshark", "Nmap", "Burp Suite", "Metasploit", "Vulnerability Scanners"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Wireshark, Nmap & Security Tooling Practical Lab",
                        "description": "Analyze network traffic with Wireshark, discover open ports with Nmap, and test defenses.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=Wireshark+Nmap+cybersecurity+course",
                        "difficulty": "Intermediate",
                        "topic": "Wireshark, Nmap and defensive fundamentals",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "Identity & Cryptography",
                "importance": "High",
                "topics": ["Hashing (SHA/Bcrypt)", "Symmetric vs Asymmetric", "TLS/SSL Certificates", "Public Key Infrastructure (PKI)", "MFA"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "Cryptography & Identity Access Management (IAM)",
                        "description": "Principles of encryption, public key infrastructure, hashing algorithms, and digital signatures.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=cryptography+cybersecurity+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Authentication, authorization, hashing and encryption",
                        "type": "video"
                    }
                ]
            },
            {
                "name": "SIEM & Incident Response",
                "importance": "Medium",
                "topics": ["Security Logs", "Splunk / Elastic", "Incident Triage", "Threat Detection", "Forensics"],
                "default_level": "Intermediate",
                "resources": [
                    {
                        "title": "SIEM Log Analysis & Incident Response Fundamentals",
                        "description": "Centralize security log analytics, detect anomalous behavior, triage alerts, and respond to breaches.",
                        "platform": "YouTube",
                        "url": "https://www.youtube.com/results?search_query=SIEM+incident+response+full+course",
                        "difficulty": "Intermediate",
                        "topic": "Logs, detection, triage and response",
                        "type": "video"
                    }
                ]
            }
        ]
    }
]
