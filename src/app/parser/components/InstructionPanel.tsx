import { useState } from "react";
import styles from "../page.module.css";
import { Instruction } from "../types/types";
import InstructionsModal from "./InstructionsModal";

export default function InstructionPanel({
  instructions,
  setInstructions,
  bytes,
}: {
  instructions: Instruction[];
  setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
  bytes: number[];
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className={styles.instructionSection}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
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
      <table className={styles.instructionTable}>
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Type</th>
            <th>Label</th>
            <th>Length</th>
            <th>Hold Value</th>
            <th>Color</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            let currentIndex = 0;
            return instructions.map((inst, idx) => {
              const start = currentIndex;
              const end = currentIndex + inst.bytesLength;
              const bytesSlice = bytes.slice(start, end);
              const resultStr = bytesSlice
                .map((b) =>
                  b >= 32 && b <= 126 ? String.fromCharCode(b) : "."
                )
                .join("");
              currentIndex = end;

              const handleDelete = () => {
                setInstructions((prev) => prev.filter((_, i) => i !== idx));
              };

              return (
                <tr key={idx}>
                  <td>
                    <span onClick={handleDelete}>🗑️</span>
                  </td>
                  <td>{idx + 1}</td>
                  <td>{inst.type}</td>
                  <td>{inst.label}</td>
                  <td>{inst.bytesLength}</td>
                  <td>{start}</td>
                  <td>{inst.color}</td>
                  <td>{resultStr}</td>
                </tr>
              );
            });
          })()}
        </tbody>
      </table>
      {showModal && (
        <InstructionsModal
          setShowModal={setShowModal}
          setInstructions={setInstructions}
        />
      )}
    </section>
  );
}
