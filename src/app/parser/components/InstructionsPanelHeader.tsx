import styles from "../page.module.css";
import { Instruction } from "../types/types";

export default function InstructionsPanelHeader({
  instructions,
  setInstructions,
  setShowModal,
}: {
  instructions: Instruction[];
  setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.instructionSectionHeader}>
      <span style={{ fontWeight: "bold" }}>Instructions</span>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          className={styles.plusButton}
          onClick={() => setShowModal(true)}
          title="Add instruction"
        >
          +
        </button>
        <button
          type="button"
          className={styles.plusButton}
          title="Save configuration"
          onClick={() => {
            const data = {
              instructions,
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "demparser-config.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          💾
        </button>
        <label
          htmlFor="load-config"
          className={styles.plusButton}
          title="Load configuration"
          style={{ cursor: "pointer", margin: 0 }}
        >
          📂
          <input
            id="load-config"
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const json = JSON.parse(ev.target?.result as string);
                  if (json.instructions) {
                    setInstructions(json.instructions);
                  }
                } catch (err) {
                  alert("Invalid configuration file.");
                  console.error("Error parsing JSON:", err);
                }
              };
              reader.readAsText(file);
            }}
          />
        </label>
      </div>
    </div>
  );
}
