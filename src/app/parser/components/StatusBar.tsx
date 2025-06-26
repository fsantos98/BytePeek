import styles from "../page.module.css";

export default function StatusBar({ text }: { text: string }) {
  return <div className={styles.statusBar}>{text}</div>;
}
