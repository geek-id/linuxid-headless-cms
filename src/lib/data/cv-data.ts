export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    technologies: string[];
  }>;
  skills: Record<string, string[]>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    period: string;
    details?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
  }>;
}

export const cvData: CVData = {
  personalInfo: {
    name: "Your Name",
    title: "Senior Software Developer & Linux System Administrator",
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "Your City, Country",
    website: "https://linux-id.net",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    summary: "Experienced software developer and Linux system administrator with 8+ years of expertise in full-stack development, DevOps practices, and infrastructure management. Passionate about open-source technologies, automation, and building scalable solutions."
  },
  
  experience: [
    {
      title: "Senior Software Developer",
      company: "Tech Company Inc.",
      location: "Remote",
      period: "2022 - Present",
      description: "Lead development of cloud-native applications and microservices architecture.",
      achievements: [
        "Architected and implemented microservices platform serving 1M+ users",
        "Reduced deployment time by 70% through CI/CD automation",
        "Led team of 5 developers in agile development practices",
        "Implemented monitoring and observability solutions using Prometheus and Grafana"
      ],
      technologies: ["React", "Node.js", "Docker", "Kubernetes", "AWS", "PostgreSQL"]
    },
    {
      title: "DevOps Engineer",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      period: "2020 - 2022",
      description: "Managed infrastructure and deployment pipelines for high-traffic web applications.",
      achievements: [
        "Designed and maintained AWS infrastructure serving 500K+ daily active users",
        "Implemented Infrastructure as Code using Terraform and Ansible",
        "Reduced infrastructure costs by 40% through optimization and automation",
        "Established monitoring and alerting systems with 99.9% uptime"
      ],
      technologies: ["AWS", "Terraform", "Ansible", "Jenkins", "Docker", "Linux"]
    },
    {
      title: "Full Stack Developer",
      company: "Digital Agency",
      location: "New York, NY",
      period: "2018 - 2020",
      description: "Developed web applications and e-commerce solutions for various clients.",
      achievements: [
        "Built 15+ responsive web applications using modern frameworks",
        "Improved application performance by 60% through optimization",
        "Mentored junior developers and conducted code reviews",
        "Collaborated with design teams to implement pixel-perfect UIs"
      ],
      technologies: ["JavaScript", "React", "Vue.js", "PHP", "MySQL", "WordPress"]
    }
  ],
  
  skills: {
    "Programming Languages": ["JavaScript", "TypeScript", "Python", "PHP", "Bash", "Go"],
    "Frontend": ["React", "Next.js", "Vue.js", "Tailwind CSS", "HTML5", "CSS3"],
    "Backend": ["Node.js", "Express", "FastAPI", "Laravel", "REST APIs", "GraphQL"],
    "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"],
    "DevOps & Cloud": ["AWS", "Docker", "Kubernetes", "Terraform", "Ansible", "Jenkins"],
    "System Administration": ["Linux", "Ubuntu", "CentOS", "Nginx", "Apache", "Shell Scripting"],
    "Tools & Others": ["Git", "GitHub Actions", "Prometheus", "Grafana", "ELK Stack", "Agile/Scrum"]
  },
  
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      location: "Your City, Country",
      period: "2014 - 2018",
      details: "Graduated Magna Cum Laude, GPA: 3.8/4.0"
    }
  ],
  
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      credentialId: "AWS-SAA-123456"
    },
    {
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "2022",
      credentialId: "CKA-123456"
    },
    {
      name: "Linux Professional Institute Certification (LPIC-2)",
      issuer: "Linux Professional Institute",
      date: "2021",
      credentialId: "LPIC-123456"
    }
  ],
  
  projects: [
    {
      name: "Linux-ID Blog Platform",
      description: "A high-performance static site generator built with Next.js for technical content.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Markdown"],
      link: "https://linux-id.net",
      github: "https://github.com/yourusername/linux-id"
    },
    {
      name: "Infrastructure Automation Suite",
      description: "Comprehensive automation tools for cloud infrastructure management.",
      technologies: ["Terraform", "Ansible", "Python", "AWS"],
      github: "https://github.com/yourusername/infra-automation"
    },
    {
      name: "Monitoring Dashboard",
      description: "Real-time monitoring and alerting system for microservices architecture.",
      technologies: ["Prometheus", "Grafana", "Docker", "Kubernetes"],
      github: "https://github.com/yourusername/monitoring-dashboard"
    }
  ]
}; 