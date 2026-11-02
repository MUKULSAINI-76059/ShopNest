
import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import "../style/About.css";

const socialLinks = [
  {
    name: "GitHub",
    username: "MukulSaini-76059",
    description: "Explore my projects and code",
    url: "https://github.com/MukulSaini-76059",
    icon: <FaGithub />,
  },
  {
    name: "LinkedIn",
    username: "Connect professionally",
    description: "Let's connect and grow together",
    url: "https://www.linkedin.com/in/mukul-saini-603346321/",
    icon: <FaLinkedin />,
  },
  {
    name: "Instagram",
    username: "@mukulsaini202",
    description: "A little more about me",
    url: "https://www.instagram.com/mukulsaini202",
    icon: <FaInstagram />,
  },
];

function About() {
  return (
    <main className="about-page">
      <div className="about-glow about-glow-one"></div>
      <div className="about-glow about-glow-two"></div>

      <div className="about-container">
        {/* Profile Section */}
        <section className="about-hero">
          <div className="about-image-wrapper">
            <div className="about-image-ring">
              <img
                src="/dp.jpeg"
                alt="Mukul Saini"
                className="about-profile-image"
              />
            </div>
            <span className="about-status-dot"></span>
          </div>

          <div className="about-intro">

            <h1>
              Hi, I'm <span className="about-name">Mukul Saini</span>
            </h1>

            <h2>Aspiring Backend Developer</h2>

            <p className="about-description">
              I'm a B.Tech student passionate about building reliable
              backend applications and learning how scalable systems
              work. I enjoy turning ideas into practical projects,
              solving problems, and improving my development skills
              every day.
            </p>

            <div className="about-tags">
              <span>Node.js</span>
              <span>Express.js</span>
              <span>MongoDB</span>
              <span>REST APIs</span>
            </div>
          </div>
        </section>

        {/* Social Links Section */}
        <section className="about-social-section">
          <div className="section-heading">
            <div>
              <span className="section-label">LET'S CONNECT</span>
              <h3>Find me online</h3>
            </div>

            <p>
              Explore my work, connect with me, or follow my journey.
            </p>
          </div>

          <div className="social-grid">
            {socialLinks.map((social) => (
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card"
                key={social.name}
              >
                <div className="social-card-top">
                  <div className="social-icon">{social.icon}</div>

                  <FaArrowUpRightFromSquare className="social-arrow" />
                </div>

                <div className="social-card-info">
                  <h4>{social.name}</h4>
                  <span className="social-username">
                    {social.username}
                  </span>
                  <p>{social.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="about-footer">
          <div className="footer-line"></div>       
        </footer>
      </div>
    </main>
  );
}

export default About;
