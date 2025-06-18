"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

function Navbar() {
  return <nav className={styles.navbar}>DemParser</nav>;
}

function UploadButton({
  onFileLoaded,
  fixedBottom = false,
}: {
  onFileLoaded: (bytes: string) => void;
  fixedBottom?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadstart = () => {
      console.log("Loading...");
    };
    reader.onerror = () => {
      console.log("Error reading file");
    };

    reader.onloadend = () => {
      console.log("File loaded successfully");
      const arrayBuffer = reader.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      console.log("Byte array:", byteArray);

      const previewBits = byteArray.slice(0, 512);
      onFileLoaded(JSON.stringify(Array.from(previewBits)));
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <label
      className={`${styles.uploadButton} ${
        fixedBottom ? styles.fixedBottom : ""
      }`}
    >
      Upload
      <input type="file" style={{ display: "none" }} onChange={handleChange} />
    </label>
  );
}

function BitsTable({
  bytes,
  selecteIndexesRange,
  setSelecteIndexesRange,
}: {
  bytes: number[];
  selecteIndexesRange: number[];
  setSelecteIndexesRange: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const bytesPerRow = 16;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const rows = [];
  for (let i = 0; i < bytes.length; i += bytesPerRow) {
    const rowBytes = bytes.slice(i, i + bytesPerRow);

    rows.push(
      <tr key={i}>
        <td className={styles.bitsMono}>{i}</td>
        <td className={styles.bitsMono}>
          {rowBytes.map((b, idx) => {
            const byteIndex = i + idx;
            let className = undefined;
            if (hoveredIndex === byteIndex) {
              className = styles.byteHighlight;
            } else if (
              byteIndex >= selecteIndexesRange[0] &&
              byteIndex <= selecteIndexesRange[1]
            ) {
              className = styles.byteSelected;
            }

            return (
              <React.Fragment key={byteIndex}>
                <span
                  className={className}
                  onMouseEnter={() => setHoveredIndex(byteIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => {
                    setSelecteIndexesRange((prev) => {
                      return [prev[1], byteIndex];
                    });
                  }}
                  style={{ padding: "0 2px", cursor: "pointer" }}
                  data-index={byteIndex}
                >
                  {b.toString(16).padStart(2, "0").toUpperCase()}
                </span>
                {idx < rowBytes.length - 1 ? " " : ""}
              </React.Fragment>
            );
          })}
        </td>
        <td className={styles.bitsMono}>
          {rowBytes.map((b, idx) => {
            const byteIndex = i + idx;
            const char = b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
            let className = undefined;
            if (hoveredIndex === byteIndex) {
              className = styles.byteHighlight;
            } else if (
              byteIndex >= selecteIndexesRange[0] &&
              byteIndex <= selecteIndexesRange[1]
            ) {
              className = styles.byteSelected;
            }

            return (
              <span
                key={byteIndex}
                className={className}
                onMouseEnter={() => setHoveredIndex(byteIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setSelecteIndexesRange((prev) => {
                    return [prev[1], byteIndex];
                  });
                }}
                style={{ padding: "0 2px", cursor: "pointer" }}
                data-index={byteIndex}
              >
                {char}
              </span>
            );
          })}
        </td>
      </tr>
    );
  }

  return (
    <section className={styles.bitsSection}>
      <table className={styles.bitsTable}>
        <thead>
          <tr>
            <th>Offset</th>
            <th>Hex</th>
            <th>Decoded Text</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </section>
  );
}

// Add a new component for the text box
function InstructionPanel() {
  const [showModal, setShowModal] = useState(false);
  const [instructionType, setInstructionType] = useState("");
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#000000");
  const [holdValue, setholdValue] = useState(0);
  const [bytesLength, setbytesLength] = useState(0);
  const [instructions, setInstructions] = useState<
    {
      type: string;
      label: string;
      bytesLength: number;
      holdValue: number;
      color: string;
    }[]
  >([]);

  const handleAdd = () => {
    setInstructions([
      ...instructions,
      { type: instructionType, label, bytesLength, holdValue, color },
    ]);
    setInstructionType("");
    setLabel("");
    setholdValue(0);
    setbytesLength(0);
    setColor("#000000");
    setShowModal(false);
  };

  return (
    <section className={styles.instructionSection}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold" }}>Instructions</span>
        <button
          type="button"
          className={styles.plusButton}
          onClick={() => setShowModal(true)}
          title="Add instruction"
        >
          +
        </button>
      </div>
      <table className={styles.instructionTable}>
        <thead>
          <tr>
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
          {instructions.map((inst, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{inst.type}</td>
              <td>{inst.label}</td>
              <td>{inst.bytesLength}</td>
              <td>{inst.holdValue}</td>
              <td>{inst.color}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Add Instruction</h3>
            <label>
              Type:
              <input
                type="text"
                value={instructionType}
                onChange={(e) => setInstructionType(e.target.value)}
                autoFocus
              />
            </label>
            <label>
              Label:
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
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
      )}
    </section>
  );
}

function MainContent() {
  const [bits, setBits] = useState<number[]>([]);
  const [selecteIndexesRange, setSelecteIndexesRange] = useState<number[]>([
    -1, -1,
  ]);

  return (
    <main className={styles.main} style={{ marginTop: 0 }}>
      {bits.length > 0 ? (
        <div
          style={{
            display: "flex",
            width: "70%",
            gap: "2rem",
            alignItems: "flex-start",
            marginTop: "1rem",
          }}
        >
          <BitsTable
            bytes={bits}
            selecteIndexesRange={selecteIndexesRange}
            setSelecteIndexesRange={setSelecteIndexesRange}
          />
          <InstructionPanel />
          <UploadButton
            onFileLoaded={(str) => setBits(JSON.parse(str))}
            fixedBottom
          />
        </div>
      ) : (
        <UploadButton onFileLoaded={(str) => setBits(JSON.parse(str))} />
      )}
      <StatusBar
        text={`Selected: ${selecteIndexesRange[0]} - ${selecteIndexesRange[1]}`}
      />
    </main>
  );
}

function StatusBar({ text }: { text: string }) {
  return <div className={styles.statusBar}>{text}</div>;
}

export default function ParserPage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <MainContent />
    </div>
  );
}
