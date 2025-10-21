import { useEffect, useRef } from "react";
import { createUniver, LocaleType } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreEnUS from "@univerjs/preset-sheets-core/locales/en-US";

// Import Univer CSS
import "@univerjs/preset-sheets-core/lib/index.css";

// Component styles
import "./UniverSheet.css";

export default function UniverSheet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerAPIRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) {
      console.error("Container ref is null");
      return;
    }

    // Prevent double initialization in StrictMode
    if (initializedRef.current) {
      console.log("⚠️ Univer already initialized, skipping...");
      return;
    }

    console.log("🚀 Initializing Univer with Preset...");
    initializedRef.current = true;

    // Initialize Univer using the official preset system
    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: UniverPresetSheetsCoreEnUS,
      },
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
      ],
    });

    // Create a new spreadsheet with initial data
    univerAPI.createUniverSheet({
      name: "AI Spreadsheet",
    });

    // Store the univerAPI reference
    univerAPIRef.current = univerAPI;

    // Expose API to window for AI chat panel to access
    (window as any).univerAPI = {
      // Core API
      univerAPI: univerAPI,

      // Helper methods
      getActiveWorkbook: () => {
        return univerAPI.getActiveWorkbook();
      },

      getActiveSheet: () => {
        return univerAPI.getActiveWorkbook()?.getActiveSheet();
      },

      // Row operations
      insertRowAfter: (rowIndex: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.insertRowAfter(rowIndex);
      },

      insertRowBefore: (rowIndex: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.insertRowBefore(rowIndex);
      },

      insertRows: (rowIndex: number, count: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.insertRows(rowIndex, count);
      },

      deleteRows: (rowIndex: number, count: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.deleteRows(rowIndex, count);
      },

      // Column operations
      insertColumnAfter: (colIndex: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.insertColumnAfter(colIndex);
      },

      insertColumnBefore: (colIndex: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.insertColumnBefore(colIndex);
      },

      insertColumns: (colIndex: number, count: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.insertColumns(colIndex, count);
      },

      deleteColumns: (colIndex: number, count: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        return sheet?.deleteColumns(colIndex, count);
      },

      // Cell operations
      getRange: (
        row: number,
        col: number,
        numRows?: number,
        numCols?: number
      ) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        if (typeof numRows === "number" && typeof numCols === "number") {
          return sheet?.getRange(row, col, numRows, numCols);
        }
        return sheet?.getRange(row, col);
      },

      setValue: (row: number, col: number, value: any) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        const range = sheet?.getRange(row, col);
        return range?.setValue(value);
      },

      getValue: (row: number, col: number) => {
        const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
        const range = sheet?.getRange(row, col);
        return range?.getValue();
      },

      // Utility to see available methods
      help: () => {
        console.log("🚀 Univer API Available:");
        console.log("\n📊 Core:");
        console.log("- univerAPI.univerAPI: Full Univer API");
        console.log("- univerAPI.getActiveWorkbook()");
        console.log("- univerAPI.getActiveSheet()");
        console.log("\n➕ Row Operations:");
        console.log("- univerAPI.insertRowAfter(rowIndex)");
        console.log("- univerAPI.insertRowBefore(rowIndex)");
        console.log("- univerAPI.insertRows(rowIndex, count)");
        console.log("- univerAPI.deleteRows(rowIndex, count)");
        console.log("\n➕ Column Operations:");
        console.log("- univerAPI.insertColumnAfter(colIndex)");
        console.log("- univerAPI.insertColumnBefore(colIndex)");
        console.log("- univerAPI.insertColumns(colIndex, count)");
        console.log("- univerAPI.deleteColumns(colIndex, count)");
        console.log("\n📝 Cell Operations:");
        console.log("- univerAPI.getRange(row, col, numRows?, numCols?)");
        console.log("- univerAPI.setValue(row, col, value)");
        console.log("- univerAPI.getValue(row, col)");
        console.log("\n⌨️  Keyboard shortcuts:");
        console.log("- F2: Enter edit mode");
        console.log("- Enter: Enter edit mode / Confirm & move down");
        console.log("- Double-click: Enter edit mode");
        console.log("- Escape: Exit edit mode");
        console.log("- Ctrl/Cmd + Z: Undo");
        console.log("- Ctrl/Cmd + Y: Redo");
        console.log("\n📖 Documentation: https://docs.univer.ai/");
      },
    };

    console.log("✅ Univer initialized with preset system!");
    console.log("📝 Try double-clicking on a cell to edit");
    console.log("⌨️  Or press F2 after selecting a cell");

    // Note: We don't dispose on cleanup due to StrictMode double-render issue
    // The univerAPI will persist across component re-renders
    return () => {
      console.log("🧹 Cleanup called (not disposing due to StrictMode)");
    };
  }, []);

  return (
    <div
      className="w-full h-full relative"
      style={{ width: "100%", height: "100%", minHeight: "100vh" }}
    >
      <div ref={containerRef} className="univer-container" />
    </div>
  );
}
