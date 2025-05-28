import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site';
import { cvData } from '@/lib/data/cv-data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Download, Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Curriculum Vitae',
  description: 'Professional CV and resume showcasing experience, skills, and achievements in software development and system administration.',
  keywords: ['cv', 'resume', 'curriculum vitae', 'software developer', 'system administrator', 'linux', 'devops'],
  openGraph: {
    title: 'Curriculum Vitae | ' + siteConfig.siteName,
    description: 'Professional CV and resume showcasing experience, skills, and achievements in software development and system administration.',
    type: 'website',
  },
};

export default function CVPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{cvData.personalInfo.name}</h1>
              <h2 className="text-xl text-blue-600 font-medium mb-4">{cvData.personalInfo.title}</h2>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <a href={`mailto:${cvData.personalInfo.email}`} className="hover:text-blue-600">
                {cvData.personalInfo.email}
              </a>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              <span>{cvData.personalInfo.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{cvData.personalInfo.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Globe className="w-4 h-4 mr-2" />
              <a href={cvData.personalInfo.website} className="hover:text-blue-600" target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </div>
          </div>
          
          <div className="flex gap-4 mb-6">
            <a href={cvData.personalInfo.github} className="inline-flex items-center text-gray-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
            <a href={cvData.personalInfo.linkedin} className="inline-flex items-center text-gray-600 hover:text-blue-600" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </a>
          </div>
          
          <p className="text-gray-700 leading-relaxed">{cvData.personalInfo.summary}</p>
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Experience</h3>
          <div className="space-y-8">
            {cvData.experience.map((job, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h4 className="text-xl font-semibold text-gray-900">{job.title}</h4>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{job.period}</span>
                  </div>
                </div>
                <div className="text-blue-600 font-medium mb-2">{job.company} • {job.location}</div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                  {job.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {job.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(cvData.skills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Education */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Education</h3>
            {cvData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                <div className="text-blue-600 font-medium">{edu.institution}</div>
                <div className="text-gray-600">{edu.location} • {edu.period}</div>
                {edu.details && <div className="text-gray-700 mt-1">{edu.details}</div>}
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Certifications</h3>
            <div className="space-y-4">
              {cvData.certifications.map((cert, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <div className="text-green-600 font-medium">{cert.issuer}</div>
                  <div className="text-gray-600 text-sm">{cert.date} • ID: {cert.credentialId}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvData.projects.map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h4>
                <p className="text-gray-700 mb-4 text-sm">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.link && (
                    <a href={project.link} className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a href={project.github} className="inline-flex items-center text-gray-600 hover:text-gray-700 text-sm" target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 