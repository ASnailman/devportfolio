"use client";
// Renders the inner content of each app window from your data in
// src/content/portfolio.js. To change WHAT is shown, edit that data file.
// To change HOW it looks, tweak the small components below (and the
// `App content` styles in page.module.css).

import styles from '../app/page.module.css';
import { profile, links, skills, projects } from '../content/portfolio';

function initialsOf(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function ProfileApp() {
  return (
    <div className={styles.appContent}>
      <div className={styles.profileHeader}>
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.profileAvatar} src={profile.avatar} alt={profile.name} />
        ) : (
          <div className={`${styles.profileAvatar} ${styles.profileInitials}`}>
            {initialsOf(profile.name)}
          </div>
        )}
        <div>
          <h2 className={styles.profileName}>{profile.name}</h2>
          {profile.role && <p className={styles.profileRole}>{profile.role}</p>}
          {profile.location && <p className={styles.profileMeta}>📍 {profile.location}</p>}
        </div>
      </div>

      {profile.bio.map((paragraph, i) => (
        <p key={i} className={styles.bioParagraph}>{paragraph}</p>
      ))}

      {profile.facts?.length > 0 && (
        <dl className={styles.factList}>
          {profile.facts.map((fact) => (
            <div key={fact.label} className={styles.factRow}>
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function LinksApp() {
  return (
    <div className={styles.appContent}>
      <div className={styles.linkList}>
        {links.map((link) => (
          <a
            key={link.label}
            className={styles.linkItem}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.icon && <span className={styles.linkIcon}>{link.icon}</span>}
            <span className={styles.linkText}>
              <span className={styles.linkLabel}>{link.label}</span>
              {link.handle && <span className={styles.linkHandle}>{link.handle}</span>}
            </span>
            <span className={styles.linkArrow}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function SkillsApp() {
  return (
    <div className={styles.appContent}>
      {skills.map((group) => (
        <div key={group.group} className={styles.skillGroup}>
          <h3 className={styles.skillGroupTitle}>{group.group}</h3>
          <div className={styles.chipRow}>
            {group.items.map((item) => (
              <span key={item} className={styles.chip}>{item}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsApp() {
  return (
    <div className={styles.appContent}>
      <div className={styles.projectList}>
        {projects.map((project) => {
          const Card = project.href ? 'a' : 'div';
          const linkProps = project.href
            ? { href: project.href, target: '_blank', rel: 'noopener noreferrer' }
            : {};
          return (
            <Card key={project.name} className={styles.projectCard} {...linkProps}>
              <div className={styles.projectHead}>
                <h3 className={styles.projectName}>{project.name}</h3>
                {project.href && <span className={styles.linkArrow}>↗</span>}
              </div>
              <p className={styles.projectDesc}>{project.description}</p>
              {project.tags?.length > 0 && (
                <div className={styles.chipRow}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.chip}>{tag}</span>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Maps an app id (from APPS_CONFIG in page.js) to its content component.
const REGISTRY = {
  profile: ProfileApp,
  links: LinksApp,
  skills: SkillsApp,
  projects: ProjectsApp,
};

export default function AppContent({ appId }) {
  const Component = REGISTRY[appId];
  if (!Component) {
    return <p className={styles.appContent}>No content yet for this app.</p>;
  }
  return <Component />;
}
