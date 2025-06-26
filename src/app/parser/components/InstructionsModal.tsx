import { useState } from "react";
import { Instruction, InstructionType } from "../types/types";
import styles from "../page.module.css";

export default function InstructionsModal({
  setInstructions,
  setShowModal,
}: {
  setInstructions: React.Dispatch<React.SetStateAction<Instruction[]>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [instructionType, setInstructionType] = useState("");
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("green");
  const [holdValue, setholdValue] = useState(0);
  const [bytesLength, setbytesLength] = useState(0);

  const handleAdd = () => {
    setInstructions((prev) => [
      ...prev,
      { type: instructionType, label, bytesLength, holdValue, color },
    ]);
    setInstructionType("");
    setLabel("");
    setholdValue(0);
    setbytesLength(0);
    setColor("green");
    setShowModal(false);
  };
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add Instruction</h3>
        <label>
          Type:
          <select
            value={instructionType}
            onChange={(e) =>
              setInstructionType(e.target.value as InstructionType)
            }
            autoFocus
          >
            <option value="">Select type</option>
            {Object.values(InstructionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label>
          Label:
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </label>
        <label>
          Number of Bytes:
          <input
            type="text"
            value={bytesLength}
            onChange={(e) => setbytesLength(parseInt(e.target.value))}
            autoFocus
          />
        </label>
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{
              marginLeft: "0.5rem",
              width: "2.5rem",
              height: "2rem",
              padding: 0,
              border: "none",
              background: "none",
            }}
            autoFocus
          />
        </label>
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            gap: "1rem",
          }}
        >
          <button onClick={handleAdd} disabled={!instructionType || !label}>
            Add
          </button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
