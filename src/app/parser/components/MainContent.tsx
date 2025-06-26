import { useState } from "react";
import BitsTable from "./BitsTable";
import InstructionPanel from "./InstructionPanel";
import UploadButton from "./UploadButton";
import StatusBar from "./StatusBar";
import styles from "../page.module.css";

export default function MainContent() {
  const [bits, setBits] = useState<number[]>([]);
  const [selecteIndexesRange, setSelecteIndexesRange] = useState<number[]>([
    -1, -1,
  ]);
  const [instructions, setInstructions] = useState<
    {
      type: string;
      label: string;
      bytesLength: number;
      holdValue: number;
      color: string;
    }[]
  >([]);

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
            <InstructionPanel
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
