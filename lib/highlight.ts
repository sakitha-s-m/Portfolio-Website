export type Lang = "tsx" | "java" | "python" | "yaml";

export type Token = { text: string; cls: string };

const KEYWORDS: Record<Lang, string[]> = {
  tsx: ["export", "default", "function", "return", "const", "let", "import", "from", "async", "await", "type", "interface", "new"],
  java: ["public", "private", "var", "new", "return", "throw", "if", "else", "void", "class", "extends", "this"],
  python: ["async", "def", "await", "if", "elif", "else", "not", "and", "or", "return", "self", "None", "True", "False", "import", "from"],
  yaml: ["true", "false", "on", "name", "jobs", "steps", "uses", "run", "push", "branches"],
};

const CLS = {
  com: "tok-com",
  str: "tok-str",
  kw: "tok-kw",
  num: "tok-num",
  fn: "tok-fn",
  type: "tok-type",
  plain: "tok-plain",
};

/** Tiny deterministic tokenizer — just enough to make the editor look real. */
export function tokenizeLine(line: string, lang: Lang): Token[] {
  const kw = KEYWORDS[lang].join("|");
  const comment = lang === "python" || lang === "yaml" ? "#[^\\n]*" : "//[^\\n]*";
  const re = new RegExp(
    `(?<com>${comment})|(?<str>"[^"]*"|'[^']*'|\`[^\`]*\`)|(?<kw>\\b(?:${kw})\\b)|(?<num>\\b\\d[\\d._]*\\b)|(?<fn>[a-z_][\\w]*(?=\\())|(?<type>\\b[A-Z][\\w]*\\b)`,
    "g",
  );
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: line.slice(last, i), cls: CLS.plain });
    const g = m.groups ?? {};
    const cls = g.com ? CLS.com : g.str ? CLS.str : g.kw ? CLS.kw : g.num ? CLS.num : g.fn ? CLS.fn : CLS.type;
    out.push({ text: m[0], cls });
    last = i + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last), cls: CLS.plain });
  // yaml keys: colour `key:` heads
  if (lang === "yaml") {
    return out.map((t) =>
      t.cls === CLS.plain
        ? { ...t, text: t.text } // keep
        : t,
    );
  }
  return out;
}

export function tokenize(code: string, lang: Lang): Token[][] {
  return code.split("\n").map((l) => {
    if (lang === "yaml") {
      const m = l.match(/^(\s*-?\s*)([\w.→ -]+)(:)(.*)$/);
      if (m) {
        return [
          { text: m[1], cls: CLS.plain },
          { text: m[2], cls: CLS.fn },
          { text: m[3], cls: CLS.plain },
          ...tokenizeLine(m[4], lang),
        ];
      }
    }
    return tokenizeLine(l, lang);
  });
}

export type EditorDoc = {
  file: string;
  lang: Lang;
  badge: string;
  code: string;
};

export const EDITOR_DOCS: EditorDoc[] = [
  {
    file: "profile.tsx",
    lang: "tsx",
    badge: "TypeScript React",
    code: `// ~/sakitha/profile.tsx
export const profile = {
  name: "Sakitha Manamperi",
  role: "Software Engineering Student",
  base: "Melbourne, VIC",
  degree: "BSE @ RMIT · class of 2027",
  focus: ["full-stack", "cloud", "ai"],
  openTo: "internships",
};

export default function Hello() {
  return (
    <Terminal user="sakitha" status="online">
      <Cursor blink />
    </Terminal>
  );
}`,
  },
  {
    file: "MazeRunner.java",
    lang: "java",
    badge: "Java",
    code: `// MazeRunner — validation pipeline
public MazeReport validate(Maze maze) {
    var entrances = maze.findEntrances();
    if (entrances.size() != 2) {
        throw new InvalidMazeException(maze);
    }

    var visited = depthFirstSearch(maze.start());
    var cycles  = detectCycles(maze, visited);

    // 100% detection · ~40% less debugging
    return new MazeReport(visited, cycles)
        .withPath(breadthFirstSearch(maze));
}`,
  },
  {
    file: "trading_bot.py",
    lang: "python",
    badge: "Python",
    code: `# smart-bot — RSI strategy · binance testnet
async def tick(self) -> None:
    candles = await self.client.klines("BTCUSDT", "15m")
    rsi = compute_rsi(candles, period=14)

    if rsi < 30 and not self.position:
        await self.buy(size=self.balance * 0.95)
    elif rsi > 70 and self.position:
        await self.sell(reason="overbought")

    # csv log + analytics, 24/7 on the droplet
    self.log_trade(rsi, self.position)`,
  },
  {
    file: "deploy.yml",
    lang: "yaml",
    badge: "YAML",
    code: `# .github/workflows/deploy.yml
name: ship-to-cloud
on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: test
        run: pytest -q --maxfail=1
      - name: deploy → digitalocean
        run: ssh bot@droplet "tmux respawn bot"`,
  },
];
