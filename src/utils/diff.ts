export const gitDiffToHtml = (
  s: string
): { html: string; modification: number } => {
  switch (s[0]) {
    case "+":
      return { html: `<ins>${s}</ins>`, modification: 1 };
    case "-":
      return { html: `<del>${s}</del>`, modification: -1 };
    default:
      return { html: s, modification: 0 };
  }
};

export const getDiffDataFromRawTextFile = (
  rawText: string
): {
  files: { html: string; filePath: string }[];
  ins: number;
  del: number;
  filesChanged: number;
} => {
  const files = rawText
    .split("diff --git ")
    .slice(1)
    .map((s) => {
      const [filePath, _1, _2, _3, _4, ...otherLines] = s.split("\n");
      const { html, ins, del } = otherLines.reduce(
        (acc, l) => {
          const sanatizedText = l
            .replaceAll("<", "&#60;")
            .replaceAll(">", "&#62;");
          const { html, modification } = gitDiffToHtml(sanatizedText);
          const ins = acc.ins + Number(modification === 1);
          const del = acc.del + Number(modification === -1);
          return {
            html: `${acc.html}\n${html}`,
            ins,
            del,
          };
        },
        { html: "", ins: 0, del: 0 }
      );
      return {
        html,
        filePath: filePath.split(" ")[0].split("/").slice(1).join("/"),
        del,
        ins,
      };
    });
  return {
    ...files.reduce(
      (acc, { del, ins }) => ({ del: acc.del + del, ins: acc.ins + ins }),
      { ins: 0, del: 0 }
    ),
    filesChanged: files.length,
    files,
  };
};
