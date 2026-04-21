import Background from '../components/background';
import styles from './page.module.css';

export default function Home() {
  return (
    <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Background />
      
      <div className={styles.screenContainer}>
  
        <div className={styles.widgetGrid}>
            
            <div className={`${styles.glassEffect} ${styles.profileWidget}`}>
                <h2>Profile</h2>
            </div>
            <div className={`${styles.glassEffect} ${styles.smallWidget}`}>
                <p>Links</p>
            </div>
            <div className={`${styles.glassEffect} ${styles.smallWidget}`}>
                <p>Skills</p>
            </div>
            <div className={`${styles.glassEffect} ${styles.smallWidget}`}>
                <p>Apps</p>
            </div>
        </div>

        
        <div className={`${styles.glassEffect} ${styles.dock}`}>
             <div className={`${styles.glassEffect} ${styles.dockIcon}`}></div>
             <div className={`${styles.glassEffect} ${styles.dockIcon}`}></div>
             <div className={`${styles.glassEffect} ${styles.dockIcon}`}></div>
        </div>

      </div>
    </main>
  );
}