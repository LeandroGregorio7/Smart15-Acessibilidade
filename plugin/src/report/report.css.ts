export const REPORT_CSS = `
  :root {
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
    background: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #eef1f4;
  }

  .report {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 18mm;
    background: #ffffff;
  }

  .report-header {
    border-bottom: 3px solid #263746;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }

  .report-header h1 {
    margin: 0 0 8px;
    font-size: 25px;
  }

  .report-header p {
    margin: 3px 0;
    color: #536273;
  }

  h2 {
    margin-top: 28px;
    padding-bottom: 6px;
    border-bottom: 1px solid #cbd5e1;
    font-size: 19px;
  }

  h3 {
    margin-top: 20px;
    font-size: 16px;
  }

  p,
  li,
  td,
  th {
    font-size: 11pt;
    line-height: 1.5;
  }

  table {
    width: 100%;
    margin: 12px 0 20px;
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid #cbd5e1;
    padding: 8px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background: #edf2f7;
    font-weight: 600;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin: 16px 0;
  }

  .metric {
    border: 1px solid #cbd5e1;
    border-radius: 5px;
    padding: 12px;
  }

  .metric-label {
    color: #536273;
    font-size: 9pt;
  }

  .metric-value {
    display: block;
    margin-top: 5px;
    font-size: 17px;
    font-weight: 700;
  }

  .factor {
    margin: 14px 0;
    padding: 12px 14px;
    border-left: 5px solid #64748b;
    background: #f8fafc;
    page-break-inside: avoid;
  }

  .factor-positive {
    border-left-color: #237a4b;
  }

  .factor-moderate {
    border-left-color: #c28318;
  }

  .factor-high,
  .factor-critical {
    border-left-color: #a53b37;
  }

  .classification {
    display: inline-block;
    margin-left: 8px;
    padding: 3px 8px;
    border-radius: 10px;
    background: #e2e8f0;
    font-size: 9pt;
  }

  .map-figure {
    margin: 18px 0;
    page-break-inside: avoid;
  }

  .map-figure img {
    display: block;
    width: 100%;
    max-height: 170mm;
    object-fit: contain;
    border: 1px solid #cbd5e1;
  }

  .map-figure figcaption {
    margin-top: 6px;
    color: #536273;
    font-size: 9pt;
  }

  .limitations {
    padding: 12px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
  }

  .report-footer {
    margin-top: 32px;
    padding-top: 12px;
    border-top: 1px solid #cbd5e1;
    color: #64748b;
    font-size: 9pt;
  }

  .report-actions {
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    width: 210mm;
    margin: 0 auto;
    padding: 12px 18mm;
    background: #ffffff;
    border-bottom: 1px solid #cbd5e1;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
  }

  .report-action-button {
    appearance: none;
    border: 0;
    border-radius: 6px;
    padding: 10px 16px;
    background: #263746;
    color: #ffffff;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .report-action-button:hover {
    background: #17222d;
  }

  .report-action-button:focus-visible {
    outline: 3px solid rgba(38, 55, 70, 0.35);
    outline-offset: 2px;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {

    .report-actions {
      display: none !important;
    }

    body {
      background: #ffffff;
    }

    .report {
      width: auto;
      min-height: auto;
      margin: 0;
      box-shadow: none;
    }

    h2 {
      page-break-after: avoid;
    }

    table,
    figure,
    .factor {
      page-break-inside: avoid;
    }
  }
`;
