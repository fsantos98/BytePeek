import React, { useState } from "react";
import styles from "../page.module.css";

export default function BitsTable({
  bytes,
  selecteIndexesRange,
  setSelecteIndexesRange,
  instructions, // <-- Add this prop
}: {
  bytes: number[];
  selecteIndexesRange: number[];
  setSelecteIndexesRange: React.Dispatch<React.SetStateAction<number[]>>;
  instructions: {
    type: string;
    label: string;
    bytesLength: number;
    holdValue: number;
    color: string;
  }[];
}) {
  const bytesPerRow = 16;
  const rowsPerPage = 32;
  const bytesPerPage = bytesPerRow * rowsPerPage;

  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(bytes.length / bytesPerPage);

  // Slice the bytes for the current page
  const pageStart = page * bytesPerPage;
  const pageEnd = Math.min(pageStart + bytesPerPage, bytes.length);
  const pageBytes = bytes.slice(pageStart, pageEnd);

  const getHighlightProps = (byteIndex: number) => {
    if (
      byteIndex >= selecteIndexesRange[0] &&
      byteIndex <= selecteIndexesRange[1]
    ) {
      return { className: styles.byteSelected, style: {} };
    }
    let base_instruction_index = 0;
    for (const instruction of instructions) {
      const start = base_instruction_index + instruction.holdValue;
      const end =
        base_instruction_index +
        instruction.holdValue +
        instruction.bytesLength;
      base_instruction_index += instruction.bytesLength;
      if (byteIndex >= start && byteIndex < end) {
        return {
          className: styles.byteHighlight,
          style: { background: instruction.color },
        };
      }
    }
    // Default: no highlight
    return { className: "", style: {} };
  };

  const rows = [];
  for (let i = 0; i < pageBytes.length; i += bytesPerRow) {
    const rowBytes = pageBytes.slice(i, i + bytesPerRow);
    const globalRowStart = pageStart + i;

    rows.push(
      <tr key={globalRowStart}>
        <td className={styles.bitsMono}>{globalRowStart}</td>
        <td className={styles.bitsMono}>
          {rowBytes.map((b, idx) => {
            const byteIndex = globalRowStart + idx;
            const { className, style } = getHighlightProps(byteIndex);

            return (
              <React.Fragment key={byteIndex}>
                <span
                  className={className}
                  style={style}
                  onClick={() => {
                    setSelecteIndexesRange((prev) => [prev[1], byteIndex]);
                  }}
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
            const byteIndex = globalRowStart + idx;
            const char = b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
            const { className, style } = getHighlightProps(byteIndex);
            return (
              <span
                key={byteIndex}
                className={className}
                style={{ ...style, padding: "0 0.5px", cursor: "pointer" }}
                onClick={() => {
                  setSelecteIndexesRange((prev) => [prev[1], byteIndex]);
                }}
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

  // Optional: handle mouse wheel for page navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && page < totalPages - 1) {
      setPage(page + 1);
    } else if (e.deltaY < 0 && page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <section className={styles.bitsSection} onWheel={handleWheel} tabIndex={0}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          Previous
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page === totalPages - 1}
        >
          Next
        </button>
      </div>
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
