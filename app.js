// ===========================
// REACT APP - MAIN ENTRY
// ===========================

// Note: This is a demonstration of what a React app structure would look like.
// For this sandboxed environment, we'll use vanilla JavaScript instead.
// The code below implements all the features using vanilla JS.

// ===========================
// THEME MANAGEMENT
// ===========================
class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || 'dark';
    this.applyTheme(this.theme);
  }

  getStoredTheme() {
    try {
      // Using a simple state variable instead of localStorage due to sandbox restrictions
      return window.currentTheme || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    window.currentTheme = theme;
  }

  toggle() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    return newTheme;
  }
}

const themeManager = new ThemeManager();

// ===========================
// TYPING ANIMATION
// ===========================
class TypingAnimation {
  constructor(element, texts, typingSpeed = 80, deletingSpeed = 50) {
    this.element = element;
    this.texts = texts;
    this.typingSpeed = typingSpeed;
    this.deletingSpeed = deletingSpeed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (!this.isDeleting) {
      this.element.innerHTML = currentText.substring(0, this.charIndex) + '<span class="cursor"></span>';
      this.charIndex++;

      if (this.charIndex > currentText.length) {
        // Finished typing, wait before starting to delete
        setTimeout(() => {
          this.isDeleting = true;
          this.type();
        }, 2000);
        return;
      }
    } else {
      this.element.innerHTML = currentText.substring(0, this.charIndex) + '<span class="cursor"></span>';
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.textIndex = (this.textIndex + 1) % this.texts.length;
      }
    }

    const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
    setTimeout(() => this.type(), speed);
  }

  start() {
    this.type();
  }
}

// ===========================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===========================
class ScrollAnimator {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  observe(elements) {
    elements.forEach(el => this.observer.observe(el));
  }
}

// ===========================
// NAVIGATION FUNCTIONALITY
// ===========================
class Navigation {
  constructor() {
    this.header = document.querySelector('.header');
    this.navLinks = document.querySelectorAll('.nav-menu a');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }

  init() {
    // Smooth scroll to sections
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu
            this.navMenu.classList.remove('active');
          }
        }
      });
    });

    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
      });
    }

    // Active section highlighting
    window.addEventListener('scroll', () => this.highlightActiveSection());
  }

  highlightActiveSection() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

// ===========================
// FORM VALIDATION & SUBMISSION
// ===========================
class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    if (isValid) {
      formGroup.classList.remove('error');
    } else {
      formGroup.classList.add('error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
      }
    }

    return isValid;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  showStatus(type, message) {
    const statusElement = document.getElementById('form-status');
    if (statusElement) {
      statusElement.className = `form-status ${type}`;
      statusElement.textContent = message;
      statusElement.style.display = 'block';

      // Auto-hide after 5 seconds
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 5000);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.showStatus('error', 'Please fix the errors before submitting');
      return;
    }

    const submitBtn = this.form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';

    // Get form data
    const formData = {
      name: this.form.querySelector('#name').value,
      email: this.form.querySelector('#email').value,
      subject: this.form.querySelector('#subject').value,
      message: this.form.querySelector('#message').value,
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    try {
      // Firebase integration would go here
      // For demo purposes, we'll simulate a successful submission
      await this.simulateSubmission(formData);
      
      this.showStatus('success', '✓ Message sent successfully! I\'ll get back to you soon.');
      this.form.reset();
    } catch (error) {
      this.showStatus('error', '✗ Failed to send message. Please try again or email me directly.');
      console.error('Form submission error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  simulateSubmission(data) {
    return new Promise((resolve) => {
      console.log('Form data:', data);
      // Simulate network delay
      setTimeout(resolve, 1500);
    });
  }
}

// ===========================
// SKILL BARS ANIMATION
// ===========================
class SkillBarsAnimator {
  constructor() {
    this.skills = document.querySelectorAll('.skill-card');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const progress = entry.target.querySelector('.skill-progress');
            if (progress) {
              const width = progress.getAttribute('data-width');
              progress.style.setProperty('--skill-width', width);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
  }

  observe() {
    this.skills.forEach(skill => this.observer.observe(skill));
  }
}

// ===========================
// DATA
// ===========================
const portfolioData = {
  personalInfo: {
    name: 'Nigel Berewere',
    title: 'Full-Stack Developer',
    email: 'nigelberewere@gmail.com',
    location: 'Harare, Zimbabwe',
    bio: 'Passionate full-stack developer with expertise in building scalable web and mobile applications. Skilled in modern technologies and committed to delivering innovative solutions that solve real-world problems.'
  },
  
  socialLinks: {
    github: 'https://github.com/NigelBerewere',
    linkedin: 'https://www.linkedin.com/in/nigel-berewere',
    twitter: 'https://twitter.com/NigelBerewere',
    instagram: 'https://www.instagram.com/nigelberewere',
    email: 'mailto:nigelberewere@gmail.com'
  },
  
  skills: [
    { name: 'HTML', proficiency: 95, category: 'Frontend', icon: 'fab fa-html5' },
    { name: 'CSS', proficiency: 90, category: 'Frontend', icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', proficiency: 92, category: 'Frontend', icon: 'fab fa-js' },
    { name: 'Java', proficiency: 85, category: 'Backend', icon: 'fab fa-java' },
    { name: 'Flutter (Dart)', proficiency: 88, category: 'Mobile', icon: 'fas fa-mobile-alt' },
    { name: 'Firebase', proficiency: 87, category: 'Backend', icon: 'fas fa-fire' }
  ],
  
  featuredProjects: [
    {
      title: 'School Portal',
      description: 'A comprehensive student management and results system for educational institutions',
      problem: 'Schools need efficient digital solutions for managing student data and academic records',
      solution: 'Built a full-stack portal with user authentication, grade tracking, attendance management, and automated reporting features',
      impact: 'Streamlined operations for 500+ students and reduced administrative workload by 40%',
      techStack: ['HTML', 'CSS', 'JavaScript', 'Firebase'],
      github: 'https://github.com/NigelBerewere',
      demo: '#',
      icon: 'fas fa-school'
    },
    {
      title: 'Interns & Companies Connector',
      description: 'Platform connecting students with internship opportunities at companies',
      problem: 'Significant gap between students seeking internships and companies looking to hire talent',
      solution: 'Created a matching platform with user profiles, job listings, application tracking, and communication features',
      impact: 'Successfully connected 100+ students with internship opportunities and facilitated 50+ placements',
      techStack: ['Flutter', 'Firebase', 'JavaScript'],
      github: 'https://github.com/NigelBerewere',
      demo: '#',
      icon: 'fas fa-handshake'
    },
    {
      title: 'Numbers',
      description: 'Personal finance management application helping users track and plan their finances',
      problem: 'Users struggle to track daily expenses and create effective budget plans',
      solution: 'Developed mobile app with expense tracking, budget planning, financial insights, and spending analytics',
      impact: 'Helped users save an average of 20% more monthly through better financial awareness',
      techStack: ['Flutter (Dart)', 'Firebase'],
      github: 'https://github.com/NigelBerewere',
      demo: '#',
      icon: 'fas fa-chart-line'
    },
    {
      title: 'Project & Staff Manager',
      description: 'Company tool for project management and staff organization',
      problem: 'Companies need centralized systems for managing projects, tasks, and team members',
      solution: 'Built collaborative platform with task assignment, progress tracking, team communication, and reporting dashboards',
      impact: 'Increased team productivity by 30% and improved project completion rates',
      techStack: ['Java', 'JavaScript', 'Firebase'],
      github: 'https://github.com/NigelBerewere',
      demo: '#',
      icon: 'fas fa-tasks'
    }
  ],
  
  otherProjects: [
    { title: 'Weather App', description: 'Real-time weather application with forecasts', tech: 'JavaScript, API', github: 'https://github.com/NigelBerewere', icon: 'fas fa-cloud-sun' },
    { title: 'Todo List Pro', description: 'Feature-rich task management application', tech: 'React, Firebase', github: 'https://github.com/NigelBerewere', icon: 'fas fa-list-check' },
    { title: 'Chat Application', description: 'Real-time messaging platform', tech: 'Flutter, Firebase', github: 'https://github.com/NigelBerewere', icon: 'fas fa-comments' },
    { title: 'E-commerce Store', description: 'Full-featured online shopping platform', tech: 'React, Java, Firebase', github: 'https://github.com/NigelBerewere', icon: 'fas fa-shopping-cart' },
    { title: 'Blog Platform', description: 'Content management and blogging system', tech: 'JavaScript, Firebase', github: 'https://github.com/NigelBerewere', icon: 'fas fa-blog' },
    { title: 'API Integration Hub', description: 'Centralized API management dashboard', tech: 'Java, JavaScript', github: 'https://github.com/NigelBerewere', icon: 'fas fa-plug' }
  ],
  
  resume: {
    education: [
      { degree: 'Bachelor of Science in Computer Science', institution: 'National University of Science and technology', year: '2024-2028' }
    ],
    experience: [
      { role: 'Full-Stack Developer', company: 'Tech Company', period: '2023-Present', description: 'Developed web and mobile applications' },
      { role: 'Junior Developer', company: 'Startup Inc', period: '2022-2023', description: 'Built responsive websites and APIs' }
    ],
    certifications: [
      { name: 'Firebase Certified Developer', year: '2024' },
      { name: 'Flutter Development', year: '2023' }
    ]
  }
};

// ===========================
// RENDER FUNCTIONS
// ===========================
function renderHeader() {
  return `
    <a href="#main" class="skip-to-main">Skip to main content</a>
    <header class="header">
      <nav class="nav-container" role="navigation" aria-label="Main navigation">
        <div class="logo">{'NB'}</div>
        <ul class="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#resume">Resume</a></li>
          <li><a href="#contact">Contact</a></li>
          <li>
            <button class="theme-toggle" aria-label="Toggle theme">
              <i class="fas fa-moon"></i>
            </button>
          </li>
        </ul>
        <button class="mobile-menu-toggle" aria-label="Toggle mobile menu">
          <i class="fas fa-bars"></i>
        </button>
      </nav>
    </header>
  `;
}

function renderHero() {
  return `
    <section id="home" class="hero" role="banner">
      <div id="particles-js" aria-hidden="true"></div>
      <button id="particles-toggle" class="particles-toggle" title="Change background style" aria-label="Change hero background">Style</button>
      <div class="hero-content fade-in">
        <div class="terminal-window">
          <div class="terminal-header">
            <span class="terminal-btn red"></span>
            <span class="terminal-btn yellow"></span>
            <span class="terminal-btn green"></span>
          </div>
          <div class="terminal-body">
            <div class="terminal-prompt">&gt; nigel-berewere.init()</div>
            <div class="typing-text" id="typing-text">
              <span class="cursor"></span>
            </div>
          </div>
        </div>
        <div class="hero-buttons">
          <a href="#projects" class="btn btn-primary">
            <i class="fas fa-code"></i> View Projects
          </a>
          <a href="#contact" class="btn btn-secondary">
            <i class="fas fa-envelope"></i> Contact Me
          </a>
        </div>
      </div>
    </section>
  `;
}

function renderAbout() {
  const { personalInfo } = portfolioData;
  return `
    <section id="about" class="section" role="region" aria-labelledby="about-title">
      <h2 id="about-title" class="section-title fade-in">About Me</h2>
      <div class="about-content">
        <div class="about-text fade-in">
          <p>${personalInfo.bio}</p>
          <p>With a strong foundation in both frontend and backend technologies, I create seamless user experiences and robust server-side solutions. My passion lies in turning complex problems into elegant, user-friendly applications.</p>
          <p>When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.</p>
        </div>
        <div class="about-image fade-in">
          <div class="profile-img">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderSkills() {
  const { skills } = portfolioData;
  return `
    <section id="skills" class="section" role="region" aria-labelledby="skills-title">
      <h2 id="skills-title" class="section-title fade-in">Skills</h2>
      <div class="skills-grid">
        ${skills.map(skill => `
          <div class="skill-card fade-in">
            <div class="skill-header">
              <i class="skill-icon ${skill.icon}"></i>
              <h3 class="skill-name">${skill.name}</h3>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" data-width="${skill.proficiency}%"></div>
            </div>
            <div class="skill-percentage">${skill.proficiency}%</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderProjects() {
  const { featuredProjects } = portfolioData;
  return `
    <section id="projects" class="section" role="region" aria-labelledby="projects-title">
      <h2 id="projects-title" class="section-title fade-in">Featured Projects</h2>
      <div class="projects-grid">
        ${featuredProjects.map(project => `
          <article class="project-card fade-in">
            <div class="project-image">
              <i class="${project.icon}"></i>
            </div>
            <div class="project-content">
              <h3 class="project-title">${project.title}</h3>
              <p class="project-description">${project.description}</p>
              <div class="project-details">
                <p><strong>Problem:</strong> ${project.problem}</p>
                <p><strong>Solution:</strong> ${project.solution}</p>
                <p><strong>Impact:</strong> ${project.impact}</p>
              </div>
              <div class="tech-stack">
                ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
              </div>
              <div class="project-links">
                <a href="${project.github}" class="btn btn-primary btn-small" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-github"></i> GitHub
                </a>
                <a href="${project.demo}" class="btn btn-secondary btn-small">
                  <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderOtherProjects() {
  const { otherProjects } = portfolioData;
  return `
    <section class="section" role="region" aria-labelledby="other-projects-title">
      <h2 id="other-projects-title" class="section-title fade-in">Other Projects</h2>
      <div class="other-projects-grid">
        ${otherProjects.map(project => `
          <article class="other-project-card fade-in">
            <i class="${project.icon}" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 1rem;"></i>
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="tech-stack">
              <span class="tech-tag">${project.tech}</span>
            </div>
            <a href="${project.github}" class="btn btn-secondary btn-small mt-1" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-github"></i> View Code
            </a>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

function renderResume() {
  const { resume } = portfolioData;
  return `
    <section id="resume" class="section" role="region" aria-labelledby="resume-title">
      <h2 id="resume-title" class="section-title fade-in">Resume</h2>
      <div class="resume-content">
        <div class="resume-download fade-in">
          <a href="/Nigel_Berewere_Resume.pdf" class="btn btn-primary" download>
            <i class="fas fa-download"></i> Download Resume
          </a>
        </div>
        
        <div class="timeline fade-in">
          <h3 style="margin-bottom: 2rem; color: var(--accent);">Education</h3>
          ${resume.education.map(edu => `
            <div class="timeline-item">
              <h4>${edu.degree}</h4>
              <p class="subtitle">${edu.institution} • ${edu.year}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="timeline fade-in">
          <h3 style="margin-bottom: 2rem; color: var(--accent);">Experience</h3>
          ${resume.experience.map(exp => `
            <div class="timeline-item">
              <h4>${exp.role}</h4>
              <p class="subtitle">${exp.company} • ${exp.period}</p>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="timeline fade-in">
          <h3 style="margin-bottom: 2rem; color: var(--accent);">Certifications</h3>
          ${resume.certifications.map(cert => `
            <div class="timeline-item">
              <h4>${cert.name}</h4>
              <p class="subtitle">${cert.year}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderContact() {
  const { personalInfo } = portfolioData;
  return `
    <section id="contact" class="section" role="region" aria-labelledby="contact-title">
      <h2 id="contact-title" class="section-title fade-in">Get In Touch</h2>
      <div class="contact-content">
        <div class="contact-info fade-in">
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h4>Email</h4>
              <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
            </div>
          </div>
          <div class="contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h4>Location</h4>
              <p>${personalInfo.location}</p>
            </div>
          </div>
        </div>
        
        <form id="contact-form" class="contact-form fade-in">
          <div id="form-status" class="form-status"></div>
          
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" name="name" required aria-required="true">
            <span class="form-error"></span>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required aria-required="true">
            <span class="form-error"></span>
          </div>
          
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject">
            <span class="form-error"></span>
          </div>
          
          <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" required aria-required="true"></textarea>
            <span class="form-error"></span>
          </div>
          
          <button type="submit" class="btn-submit">Send Message</button>
        </form>
      </div>
    </section>
  `;
}

function renderFooter() {
  const { socialLinks, personalInfo } = portfolioData;
  return `
    <footer class="footer" role="contentinfo">
      <div class="footer-content">
        <div class="footer-section">
          <h4>${personalInfo.name}</h4>
          <p>Full-Stack Developer passionate about creating innovative solutions.</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Connect</h4>
          <div class="social-links">
            <a href="${socialLinks.github}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <i class="fab fa-github"></i>
            </a>
            <a href="${socialLinks.linkedin}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="${socialLinks.twitter}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="${socialLinks.instagram}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="${socialLinks.email}" class="social-link" aria-label="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2025 ${personalInfo.name}. All rights reserved.</p>
        <p>Built with <i class="fas fa-heart" style="color: var(--accent);"></i> using HTML, CSS & JavaScript</p>
      </div>
    </footer>
  `;
}

// ===========================
// INITIALIZE APP
// ===========================
function initApp() {
  const app = document.getElementById('root');
  
  // Render all sections
  app.innerHTML = `
    ${renderHeader()}
    <main id="main">
      ${renderHero()}
      ${renderAbout()}
      ${renderSkills()}
      ${renderProjects()}
      ${renderOtherProjects()}
      ${renderResume()}
      ${renderContact()}
    </main>
    ${renderFooter()}
  `;
  
  // Initialize components
  const navigation = new Navigation();
  const contactForm = new ContactForm('contact-form');
  const skillBarsAnimator = new SkillBarsAnimator();
  skillBarsAnimator.observe();
  
  // Initialize scroll animations
  const scrollAnimator = new ScrollAnimator();
  const fadeElements = document.querySelectorAll('.fade-in');
  scrollAnimator.observe(fadeElements);
  
  // Initialize typing animation
  const typingElement = document.getElementById('typing-text');
  const typingTexts = [
    'hi, i\'m <span class="highlight">Nigel Berewere</span> — full-stack developer',
    'i build <span class="highlight">web apps</span> with html, css, javascript',
    'i create <span class="highlight">mobile apps</span> with flutter & dart',
    'i work with <span class="highlight">firebase</span> & java backends'
  ];
  const typing = new TypingAnimation(typingElement, typingTexts);
  typing.start();

  // Initialize particles background (if the library loaded)
  // particle presets and helpers
  const particlePresets = {
    network: {
      particles: {
        number: { value: 45, density: { enable: true, value_area: 800 } },
        color: { value: '#00ffc6' },
        shape: { type: 'circle' },
        opacity: { value: 0.72, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#00ffc6',
          opacity: 0.2,
          width: 1
        },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    },
    bubbles: {
      particles: {
        number: { value: 28, density: { enable: true, value_area: 700 } },
        color: { value: '#8be9c7' },
        shape: { type: 'circle' },
        opacity: { value: 0.55, random: true },
        size: { value: 6, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1, direction: 'top', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'repulse' }, resize: true },
        modes: { bubble: { distance: 120, size: 12, duration: 1 }, repulse: { distance: 120 } }
      },
      retina_detect: true
    },
    stars: {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 900 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.9, random: false },
        size: { value: 1.2, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.4, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    }
    ,
    nebula: {
      particles: {
        number: { value: 36, density: { enable: true, value_area: 1000 } },
        color: { value: ['#6EE7B7', '#60A5FA', '#C084FC', '#FDE68A'] },
        shape: { type: 'circle' },
        opacity: { value: 0.45, random: true, anim: { enable: true, speed: 1, opacity_min: 0.15, sync: false } },
        size: { value: 18, random: true, anim: { enable: true, speed: 4, size_min: 6, sync: false } },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.6, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'repulse' }, resize: true },
        modes: { bubble: { distance: 180, size: 36, duration: 1.2 }, repulse: { distance: 140 } }
      },
      retina_detect: true
    }
    ,
    comet: {
      particles: {
        number: { value: 28, density: { enable: true, value_area: 800 } },
        color: { value: '#FFD166' },
        shape: { type: 'circle' },
        opacity: { value: 0.85 },
        size: { value: 4, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 6, direction: 'bottom-right', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    },
    snow: {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.85, random: true },
        size: { value: 4, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1, direction: 'bottom', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    },
    confetti: {
      particles: {
        number: { value: 40, density: { enable: true, value_area: 800 } },
        color: { value: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C084FC'] },
        shape: { type: 'triangle' },
        opacity: { value: 0.95 },
        size: { value: 6, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 3, direction: 'bottom', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: true, mode: 'push' }, resize: true }, modes: { push: { particles_nb: 6 } } },
      retina_detect: true
    },
    matrix: {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 1200 } },
        color: { value: '#00FF41' },
        shape: { type: 'circle' },
        opacity: { value: 0.55 },
        size: { value: 2, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 4, direction: 'bottom', random: true, straight: true, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    },
    aurora: {
      particles: {
        number: { value: 30, density: { enable: true, value_area: 1000 } },
        color: { value: ['#34D399', '#60A5FA', '#A78BFA'] },
        shape: { type: 'circle' },
        opacity: { value: 0.35, random: true },
        size: { value: 28, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.4, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'repulse' }, resize: true }, modes: { bubble: { distance: 200, size: 40, duration: 1.2 } } },
      retina_detect: true
    },
    cloud: {
      particles: {
        number: { value: 20, density: { enable: true, value_area: 1400 } },
        color: { value: '#E6F7FF' },
        shape: { type: 'circle' },
        opacity: { value: 0.2, random: true },
        size: { value: 60, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    },
    sparkles: {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#FFE4A3' },
        shape: { type: 'circle' },
        opacity: { value: 0.95, random: true, anim: { enable: true, speed: 2, opacity_min: 0.2, sync: false } },
        size: { value: 1.6, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 0.9, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
      retina_detect: true
    },
    galaxy: {
      particles: {
        number: { value: 120, density: { enable: true, value_area: 1500 } },
        color: { value: ['#FFD166', '#FF6B6B', '#6BCB77', '#60A5FA'] },
        shape: { type: 'circle' },
        opacity: { value: 0.6, random: true },
        size: { value: 2.5, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 1.2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }, modes: { repulse: { distance: 120 }, push: { particles_nb: 6 } } },
      retina_detect: true
    }
  };

  const destroyParticles = () => {
    try {
      if (window.pJSDom && window.pJSDom.length) {
        // destroy all pJSDom instances (uses internal API)
        window.pJSDom.forEach((p) => {
          if (p && p.pJS && p.pJS.fn && p.pJS.fn.vendors && p.pJS.fn.vendors.destroypJS) {
            p.pJS.fn.vendors.destroypJS();
          }
        });
        window.pJSDom = [];
      }
    } catch (err) {
      // ignore destroy errors
    }
  };

  const initParticlesWithPreset = (presetName) => {
    try {
      if (!window.particlesJS) return;
      const cfg = particlePresets[presetName] || particlePresets.network;
      destroyParticles();
      particlesJS('particles-js', cfg);
    } catch (e) {
      console.warn('particles.js init failed', e);
    }
  };

  // start with network preset
  if (window.particlesJS) initParticlesWithPreset('network');

  // wire up toggle button to cycle presets
  const toggleBtn = document.getElementById('particles-toggle');
  if (toggleBtn) {
    const presets = ['network', 'bubbles', 'stars', 'nebula', 'comet', 'snow', 'confetti', 'matrix', 'aurora', 'cloud', 'sparkles', 'galaxy'];
    let current = 0;
    toggleBtn.addEventListener('click', () => {
      current = (current + 1) % presets.length;
      initParticlesWithPreset(presets[current]);
      // tiny visual feedback
      toggleBtn.textContent = presets[current];
      setTimeout(() => { toggleBtn.textContent = 'Style'; }, 1400);
    });
  }
  
  // Theme toggle functionality
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const updateThemeIcon = () => {
      const icon = themeToggle.querySelector('i');
      if (themeManager.theme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    };
    
    updateThemeIcon();
    
    themeToggle.addEventListener('click', () => {
      themeManager.toggle();
      updateThemeIcon();
    });
  }
  
  console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #00ffc6; font-size: 16px; font-weight: bold;');
  console.log('%cBuilt by Nigel Berewere', 'color: #8b949e; font-size: 12px;');
}

// Wait for DOM to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}