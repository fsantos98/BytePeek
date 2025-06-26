import MainContent from "./components/MainContent";
import Navbar from "./components/NavBar";
import styles from "./page.module.css";

export default function ParserPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <MainContent />
    </div>
  );
}
