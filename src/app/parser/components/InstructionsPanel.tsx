import React, { useState } from "react";
import styles from "../page.module.css";
import { Instruction, InstructionType } from "../types/types";
import InstructionsModal from "./InstructionsModal";
import InstructionsPanelHeader from "./InstructionsPanelHeader";

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
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDelete = (idx: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveInstruction = (from: number, to: number) => {
    if (to < 0 || to >= instructions.length) return;
    setInstructions((prev) => {
      const newInstructions = [...prev];
      const [moved] = newInstructions.splice(from, 1);
      newInstructions.splice(to, 0, moved);
      return newInstructions;
    });
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);

  const handleDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDragLeave = () => setDragOverIdx(null);

  const handleDrop = (idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    setInstructions((prev) => {
      const newInstructions = [...prev];
      const [removed] = newInstructions.splice(draggedIdx, 1);
      newInstructions.splice(idx, 0, removed);
      return newInstructions;
    });
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const generateResultString = (
    bytesSlice: number[],
    instructionType: InstructionType
  ) => {
    if (instructionType === InstructionType.STRING) {
      return bytesSlice.map((b) => String.fromCharCode(b)).join("");
    } else if (instructionType === InstructionType.DECIMAL) {
      return bytesSlice.reduce((acc, b) => acc + b, 0).toString();
    } else if (instructionType === InstructionType.RAW) {
      return bytesSlice.join(" ");
    }
    return "";
  };

  return (
    <section className={styles.instructionSection}>
      <InstructionsPanelHeader
        instructions={instructions}
        setInstructions={setInstructions}
        setShowModal={setShowModal}
      />
      <table className={styles.instructionTable}>
        <thead>
          <tr>
            <th>Offset</th>
            <th>Type</th>
            <th>Label</th>
            <th>Length</th>
            <th>Color</th>
            <th>Result</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            let currentIndex = 0;
            return instructions.map((inst: Instruction, idx) => {
              const currentOffset = currentIndex;
              const end = currentIndex + inst.bytesLength;
              const resultStr = generateResultString(
                bytes.slice(currentOffset, end),
                inst.type
              );

              currentIndex = end;

              return (
                <tr
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(idx, e)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={handleDragEnd}
                  style={{
                    background:
                      dragOverIdx === idx
                        ? "#2d8cff55"
                        : draggedIdx === idx
                        ? "#444"
                        : undefined,
                  }}
                >
                  <td>{currentOffset}</td>
                  <td>{inst.type}</td>
                  <td>{inst.label}</td>
                  <td>{inst.bytesLength}</td>
                  <td>{inst.color}</td>
                  <td>{resultStr}</td>
                  <td>
                    <span onClick={() => handleDelete(idx)}>🗑️</span>
                    <span onClick={() => moveInstruction(idx, idx - 1)}>
                      ⬆️
                    </span>
                    <span onClick={() => moveInstruction(idx, idx + 1)}>
                      ⬇️
                    </span>
                  </td>
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
