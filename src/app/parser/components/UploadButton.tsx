import styles from "../page.module.css";

export default function UploadButton({
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

      onFileLoaded(JSON.stringify(Array.from(byteArray)));
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
