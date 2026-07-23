import { useState } from "react";
import { openPrintableReport } from "../report.generator";
import { ReportData } from "../report.types";

interface ReportButtonProps {
  reportData: ReportData | null;
}

export function ReportButton({
  reportData,
}: ReportButtonProps) {
  const [error, setError] = useState<string | null>(null);

  function handleGenerateReport(): void {
    setError(null);

    if (!reportData) {
      setError(
        "Execute uma simulação antes de gerar o relatório.",
      );
      return;
    }

    try {
      openPrintableReport(reportData);
    } catch (exception) {
      const message =
        exception instanceof Error
          ? exception.message
          : "Ocorreu um erro ao gerar o relatório.";

      setError(message);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGenerateReport}
        disabled={!reportData}
      >
        Gerar relatório
      </button>

      {error && (
        <p role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
