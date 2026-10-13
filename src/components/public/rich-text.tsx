function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-navy">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r\n/g, "\n").trim().split(/\n{2,}/).filter(Boolean);
  if (!blocks.length) return null;
  return (
    <div className={`space-y-4 break-words text-[15px] leading-7 text-ink/85 ${className}`}>
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="pt-2 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
              {inline(block.slice(3))}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={index} className="pt-2 text-2xl font-semibold tracking-tight text-navy">
              {inline(block.slice(2))}
            </h2>
          );
        }
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {lines.map((line) => (
                <li key={line}>{inline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{inline(block.replace(/\n/g, " "))}</p>;
      })}
    </div>
  );
}
