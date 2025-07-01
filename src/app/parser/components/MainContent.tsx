import { useState } from "react";
import BitsTable from "./BitsTable";
import UploadButton from "./UploadButton";
import StatusBar from "./StatusBar";
import styles from "../page.module.css";
import InstructionsPanel from "./InstructionsPanel";
import { Instruction } from "../types/types";

export default function MainContent() {
  const [bits, setBits] = useState<number[]>([]);
  const [selecteIndexesRange, setSelecteIndexesRange] = useState<number[]>([
    -1, -1,
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  return (
    <main className={styles.main} style={{ marginTop: 0 }}>
      <div className={styles.tablesWrapper}>
        {bits.length > 0 ? (
          <>
            <BitsTable
              bytes={bits}
              selecteIndexesRange={selecteIndexesRange}
              setSelecteIndexesRange={setSelecteIndexesRange}
              instructions={instructions}
            />
            <InstructionsPanel
              instructions={instructions}
              setInstructions={setInstructions}
              bytes={bits}
            />
            <UploadButton
              onFileLoaded={(str) => setBits(JSON.parse(str))}
              fixedBottom
            />
          </>
        ) : (
          <UploadButton onFileLoaded={(str) => setBits(JSON.parse(str))} />
        )}
      </div>
      <StatusBar
        text={`Selected: ${selecteIndexesRange[0]} - ${selecteIndexesRange[1]}`}
      />
    </main>
  );
}
