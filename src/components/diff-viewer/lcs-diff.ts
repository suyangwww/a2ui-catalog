export interface DiffLine {
  type: 'context' | 'add' | 'remove';
  text: string;
  oldNum?: number | undefined;
  newNum?: number | undefined;
}

export function computeLineDiff(before: string, after: string): DiffLine[] {
  const a = before.replace(/\n$/, '').split('\n');
  const b = after.replace(/\n$/, '').split('\n');
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  for (let i = m - 1; i >= 0; i--) {
    const row = dp[i]!;
    const nextRow = dp[i + 1]!;
    for (let j = n - 1; j >= 0; j--) {
      row[j] =
        a[i] === b[j]
          ? 1 + (nextRow[j + 1] ?? 0)
          : Math.max(nextRow[j] ?? 0, row[j + 1] ?? 0);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      result.push({ type: 'context', text: a[i] ?? '', oldNum: i + 1, newNum: j + 1 });
      i++;
      j++;
    } else if ((dp[i + 1]?.[j] ?? 0) >= (dp[i]?.[j + 1] ?? 0)) {
      result.push({ type: 'remove', text: a[i] ?? '', oldNum: i + 1 });
      i++;
    } else {
      result.push({ type: 'add', text: b[j] ?? '', newNum: j + 1 });
      j++;
    }
  }
  while (i < m) {
    result.push({ type: 'remove', text: a[i] ?? '', oldNum: i + 1 });
    i++;
  }
  while (j < n) {
    result.push({ type: 'add', text: b[j] ?? '', newNum: j + 1 });
    j++;
  }
  return result;
}
