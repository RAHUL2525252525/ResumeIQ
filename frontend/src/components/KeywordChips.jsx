export default function KeywordChips({
  title,
  keywords = [],
  variant = 'matched',
  emptyText,
}) {
  return (
    <div className="keyword-section">
      <h4 className="keyword-title">{title}</h4>

      {keywords.length === 0 ? (
        <p className="keyword-empty">
          {emptyText || 'None found.'}
        </p>
      ) : (
        <div className="keyword-chips">
          {keywords.map((kw) => (
            <span
              key={kw}
              className={`keyword-chip keyword-${variant}`}
            >
              {kw}
            </span>
          ))}
        </div>
      )}

      <style>{`
        .keyword-section {
          width: 100%;
        }

        .keyword-title {
          margin: 0 0 11px;
          color: #475569;
          font-size: 13px;
          line-height: 1.4;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .keyword-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .keyword-chip {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 6px 11px;
          border-radius: 999px;
          box-sizing: border-box;

          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
          font-size: 12px;
          line-height: 1;
          font-weight: 600;

          border: 1px solid transparent;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }

        /* Matched keywords */
        .keyword-matched {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: #bfdbfe;
        }

        .keyword-matched:hover {
          background: #dbeafe;
          border-color: #93c5fd;
          transform: translateY(-1px);
        }

        /* Missing keywords */
        .keyword-missing {
          background: #fff7ed;
          color: #c2410c;
          border-color: #fed7aa;
        }

        .keyword-missing:hover {
          background: #ffedd5;
          border-color: #fdba74;
          transform: translateY(-1px);
        }

        /* Extra / neutral keywords */
        .keyword-extra {
          background: #f8fafc;
          color: #475569;
          border-color: #e2e8f0;
        }

        .keyword-extra:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        /* Generic fallback for any other variant */
        .keyword-chip:not(
          .keyword-matched,
          .keyword-missing,
          .keyword-extra
        ) {
          background: #f8fafc;
          color: #475569;
          border-color: #e2e8f0;
        }

        .keyword-empty {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.5;
        }

        @media (max-width: 480px) {
          .keyword-title {
            font-size: 12.5px;
            margin-bottom: 9px;
          }

          .keyword-chips {
            gap: 6px;
          }

          .keyword-chip {
            min-height: 28px;
            padding: 6px 9px;
            font-size: 11.5px;
          }

          .keyword-empty {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}