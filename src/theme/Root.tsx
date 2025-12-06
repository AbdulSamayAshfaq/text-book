import React, {useState} from 'react';
import {useLocation} from '@docusaurus/router';
import Chatbot from '@site/src/components/Chatbot/Chatbot';
import styles from './Root.module.css';

export default function Root({children}: {children: React.ReactNode}) {
  const location = useLocation();
  const isDocs = location.pathname.startsWith('/docs');
  const [open, setOpen] = useState(false);

  return (
    <>
      {children}
      {isDocs && (
        <div className={styles.widgetContainer}>
          {!open && (
            <button
              aria-label="Open Textbook Assistant"
              className={styles.openButton}
              onClick={() => setOpen(true)}
            >
              📚
            </button>
          )}

          {open && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <span>Textbook Assistant</span>
                <button aria-label="Close" className={styles.closeButton} onClick={() => setOpen(false)}>✕</button>
              </div>
              <div className={styles.panelBody}>
                <Chatbot compact />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
