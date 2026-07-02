const KNOWN_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "protonmail.com",
];

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Suggests a correction when an email's domain looks like a near-miss typo
// of a well-known provider (e.g. "gamil.com" -> "gmail.com"). Returns null
// when the domain is already a known provider, unrecognisable, or too far
// from any known domain to be a confident suggestion — never blocks
// submission, this is a soft hint only.
export function suggestEmailCorrection(email) {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;

  const domain = email.slice(at + 1).toLowerCase().trim();
  if (!domain || KNOWN_DOMAINS.includes(domain)) return null;

  let best = null;
  let bestDist = Infinity;
  for (const known of KNOWN_DOMAINS) {
    const d = levenshtein(domain, known);
    if (d < bestDist) {
      bestDist = d;
      best = known;
    }
  }

  return bestDist > 0 && bestDist <= 2 ? `${email.slice(0, at + 1)}${best}` : null;
}
