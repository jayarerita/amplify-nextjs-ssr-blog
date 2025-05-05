import React from "react";
import { cn } from "@/lib/utils";

type Line = {
  text: string;
  type: "output" | "input";
};

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  lines?: Line[];
  showFileSystem?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function TerminalLines({
  title = "",
  lines = [],
  showFileSystem = true,
  className,
  width = "100%",
  height = "100%",
  ...props
}: TerminalProps) {
  return (
    <div
      className={cn("rounded-lg overflow-hidden shadow-2xl", className)}
      style={{ width, height }}
      {...props}
    >
      {/* Terminal Header */}
      <div className="h-8 bg-gray-800 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-white text-xs mx-auto font-mono">{title}</div>
      </div>

      {/* Terminal Body */}
      <div className="bg-black h-[calc(100%-32px)] p-6 font-mono text-white">
        {lines.length > 0 && (
          <>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {line.type === "input" && (
                  <div key={index + "input"}>
                    <div className="flex flex-wrap">
                      <span className="text-green-400">user@book</span>
                      <span className="text-white">:</span>
                      <span className="text-blue-400">~</span>
                      <span className="text-white">$ </span>
                      <span className="ml-2">{line.text}</span>
                    </div>
                  </div>
                )}
                {line.type === "output" && (
                  <div key={index + "output"}>
                    <span className="ml-2">{line.text}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        )}

        <div className="flex flex-wrap mt-6" key={lines.length + "cursor"}>
          <span className="text-green-400">user@book</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <span className="ml-2 animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}
