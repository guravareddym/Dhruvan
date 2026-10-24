// Gyaan Arena content: one skill per NCERT chapter (Ganita Prakash, Curiosity, Poorvi, Ganita Manjari, Exploration, Kaveri, Class 10 books), question banks and maths generators.
(function () {
  const R = {
    int: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
    nz: (a, b) => { let v; do { v = R.int(a, b); } while (v === 0); return v; },
    pick: (a) => a[Math.floor(Math.random() * a.length)],
    shuffle: (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  };
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = (n) => String(n).split("").map((c) => SUP[c] || c).join("");
  const neg = (n) => (n < 0 ? "−" + Math.abs(n) : String(n));
  const par = (n) => (n < 0 ? "(" + neg(n) + ")" : String(n));
  const signed = (n) => (n < 0 ? "− " + Math.abs(n) : "+ " + n);
  function frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1; n /= g; d /= g;
    return d === 1 ? neg(n) : neg(n) + "/" + d;
  }

  // Build a multiple-choice item, dropping duplicate distractors.
  function mc(q, ans, wrongs) {
    const a = String(ans);
    const seen = new Set([a]);
    const w = [];
    for (const x of wrongs) {
      const s = String(x);
      if (!seen.has(s)) { seen.add(s); w.push(s); }
      if (w.length === 3) break;
    }
    return { q, a, opts: R.shuffle([a, ...w]) };
  }
  // Numeric item: plausible mistakes first, then near misses to fill.
  function num(q, ans, mistakes = [], fmt = neg) {
    const near = R.shuffle([ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, ans * 2, ans + 5]);
    const pool = mistakes.filter((x) => Number.isFinite(x) && x !== ans).concat(near.filter((x) => x !== ans));
    return mc(q, fmt(ans), pool.map(fmt));
  }
  const d1 = (n) => (n / 10).toFixed(1);

  // ---------- Maths generators (by NCERT chapter) ----------
  const G = {
    hcfLcm() {
      if (R.int(0, 1)) {
        const h = R.int(2, 9), x = R.int(2, 6); let y;
        do { y = R.int(2, 7); } while (y === x || gcd(x, y) !== 1);
        return num(`What is the HCF of ${h * x} and ${h * y}?`, h, [h * 2, Math.min(h * x, h * y), x * y]);
      }
      const a = R.int(2, 12); let b; do { b = R.int(2, 12); } while (b === a);
      const l = (a * b) / gcd(a, b);
      return num(`What is the LCM of ${a} and ${b}?`, l, [a * b === l ? l + a : a * b, gcd(a, b), l * 2]);
    },
    int6() {
      const a = R.nz(-20, 20), b = R.nz(-20, 20);
      if (R.int(0, 1)) return num(`${par(a)} + ${par(b)} = ?`, a + b, [a - b, -(a + b), Math.abs(a) + Math.abs(b)]);
      return num(`${par(a)} − ${par(b)} = ?`, a - b, [a + b, b - a, -(a + b)]);
    },
    frac6() {
      if (R.int(0, 1)) {
        const d = R.int(3, 12), a = R.int(1, d - 1), b = R.int(1, d - 1);
        return mc(`${a}/${d} + ${b}/${d} = ?`, frac(a + b, d), [frac(a + b, 2 * d), frac(a * b, d), frac(a + b + 1, d), frac(Math.abs(a - b) || 1, d + 1)]);
      }
      let a = R.int(1, 5), b; do { b = R.int(a + 1, 9); } while (gcd(a, b) !== 1);
      const k = R.int(2, 6);
      return mc(`Which fraction is equivalent to ${a}/${b}?`, `${a * k}/${b * k}`, [`${a + k}/${b + k}`, `${a * k}/${b}`, `${a}/${b * k}`, `${a * k + 1}/${b * k}`]);
    },
    dec6() {
      const a = R.int(11, 99), b = R.int(11, 99);
      if (R.int(0, 1)) return mc(`${d1(a)} + ${d1(b)} = ?`, d1(a + b), [d1(a + b + 10), d1(a + b - 1), d1(a + b + 1), d1(a + b - 10)]);
      const hi = Math.max(a, b), lo = Math.min(a, b);
      return mc(`${d1(hi)} − ${d1(lo)} = ?`, d1(hi - lo), [d1(hi - lo + 10), d1(hi - lo + 1), d1(hi + lo), d1(Math.abs(hi - lo - 1))]);
    },
    ratio6() {
      if (R.int(0, 1)) {
        let x = R.int(1, 9), y; do { y = R.int(1, 9); } while (y === x || gcd(x, y) !== 1);
        const k = R.int(2, 8);
        return mc(`Simplify the ratio ${x * k} : ${y * k}`, `${x}:${y}`, [`${y}:${x}`, `${x + 1}:${y}`, `${x}:${y + 1}`, `${x * 2}:${y}`]);
      }
      const n = R.int(2, 6), p = R.int(4, 25) , m = R.int(3, 12);
      return num(`If ${n} notebooks cost ₹${n * p}, how much do ${m} notebooks cost (in ₹)?`, m * p, [n * p * m, m * p + p, m * n]);
    },
    mens6() {
      const l = R.int(4, 20), b = R.int(3, l);
      if (R.int(0, 1)) return num(`Perimeter of a rectangle ${l} cm by ${b} cm (in cm)?`, 2 * (l + b), [l * b, l + b, 2 * l + b]);
      return num(`Area of a rectangle ${l} cm by ${b} cm (in cm²)?`, l * b, [2 * (l + b), l + b, l * b + l]);
    },
    int7() {
      const a = R.nz(-12, 12), b = R.nz(-9, 9);
      if (R.int(0, 1)) return num(`${par(a)} × ${par(b)} = ?`, a * b, [-a * b, a + b, a * b + b]);
      return num(`${par(a * b)} ÷ ${par(b)} = ?`, a, [-a, a * b - b, b]);
    },
    eq7() {
      const x = R.int(-5, 15), a = R.int(2, 9), b = R.nz(-20, 20), c = a * x + b;
      return num(`Solve for x: ${a}x ${signed(b)} = ${neg(c)}`, x, [(c + b) / a, -x, c - b, x + 1]);
    },
    pct7() {
      const p = R.pick([5, 10, 15, 20, 25, 40, 50, 75]), y = 20 * R.int(1, 20), ans = (p * y) / 100;
      return num(`What is ${p}% of ${y}?`, ans, [y - ans, ans * 10, ans + p]);
    },
    exp7() {
      if (R.int(0, 1)) {
        const a = R.int(2, 5), n = R.int(2, a <= 3 ? 5 : 4);
        return num(`Evaluate ${a}${sup(n)}`, a ** n, [a * n, a ** (n - 1), a ** (n + 1)]);
      }
      const b = R.int(2, 7), m = R.int(2, 9), n = R.int(2, 9);
      return mc(`${b}${sup(m)} × ${b}${sup(n)} = ?`, b + sup(m + n), [b + sup(m * n), b + sup(Math.abs(m - n) || 1), b * b + sup(m + n), b + sup(m + n + 1), b * 2 + sup(m + n)]);
    },
    area7() {
      if (R.int(0, 1)) {
        const b = 2 * R.int(2, 12), h = R.int(3, 15);
        return num(`Area of a triangle with base ${b} cm and height ${h} cm (in cm²)? `, (b * h) / 2, [b * h, b + h, (b * h) / 2 + h]);
      }
      const k = R.int(1, 4), r = 7 * k;
      if (R.int(0, 1)) return num(`Circumference of a circle of radius ${r} cm? (π = 22/7, in cm)`, 44 * k, [22 * k, 154 * k * k, 44 * k + 7]);
      return num(`Area of a circle of radius ${r} cm? (π = 22/7, in cm²)`, 154 * k * k, [44 * k, 22 * r, 154 * k]);
    },
    lin8() {
      const x = R.int(-6, 12), a = R.int(2, 6), b = R.nz(-5, 9), c = a * (x + b);
      if (R.int(0, 1)) return num(`Solve: ${a}(x ${signed(b)}) = ${neg(c)}`, x, [c / a + b, c - b, x + 2, -x]);
      const p = R.int(3, 9); let q; do { q = R.int(1, 8); } while (q === p);
      const r = R.int(-10, 10), s = (p - q) * x + r;
      return num(`Solve: ${p}x ${signed(r)} = ${q}x ${signed(s)}`, x, [(s + r) / (p - q), x + 1, -x, s - r]);
    },
    sq8() {
      const n = R.int(11, 30);
      if (R.int(0, 1)) return num(`√${n * n} = ?`, n, [n + 1, n - 1, Math.round((n * n) / 2)]);
      return num(`${n}² = ?`, n * n, [n * 2, n * n + n, (n + 1) * (n + 1), n * n - 10]);
    },
    cube8() {
      const n = R.int(2, 15);
      if (R.int(0, 1)) return num(`∛${n ** 3} = ?`, n, [n + 1, n - 1, n * 3]);
      return num(`${n}³ = ?`, n ** 3, [n * 3, n * n, (n + 1) ** 3]);
    },
    cq8() {
      if (R.int(0, 1)) {
        const mp = 100 * R.int(2, 50), d = R.pick([5, 10, 15, 20, 25]), sp = (mp * (100 - d)) / 100;
        return num(`Marked price ₹${mp}, discount ${d}%. Selling price (₹)?`, sp, [(mp * d) / 100, mp - d, sp + 50]);
      }
      const p = 500 * R.int(2, 20), r = R.int(4, 12), t = R.int(1, 5), si = (p * r * t) / 100;
      return num(`Simple interest on ₹${p} at ${r}% per year for ${t} years (₹)?`, si, [p + si, (p * r) / 100, si + 100]);
    },
    alg8() {
      const a = R.int(2, 9), t = R.int(0, 2);
      if (t === 0) return num(`(x + ${a})² = x² + __x + ${a * a}. Fill the blank.`, 2 * a, [a, a * a, 4 * a]);
      if (t === 1) return num(`(x + ${a})(x − ${a}) = x² − __. Fill the blank.`, a * a, [2 * a, a, 0]);
      const m = R.int(1, 9), n = 100 + m;
      return num(`Using (a + b)², find ${n}²`, n * n, [10000 + m * m, 10000 + 100 * m + m * m, n * n + 100]);
    },
    exp8() {
      const a = R.int(2, 5), n = R.int(2, 4), v = a ** n;
      return mc(`${a}${sup(-n)} = ?`, `1/${v}`, [`−${v}`, `${v}`, `−1/${v}`, `1/${a * n}`]);
    },
    ns9() {
      if (R.int(0, 1)) {
        const [b, p, q, ans] = R.pick([[8, 2, 3, 4], [27, 2, 3, 9], [16, 3, 4, 8], [32, 2, 5, 4], [125, 1, 3, 5], [64, 1, 2, 8], [81, 1, 4, 3], [64, 2, 3, 16], [9, 3, 2, 27]]);
        return num(`Simplify ${b}^(${p}/${q})`, ans, [ans * 2, Math.round((b * p) / q), ans + 1]);
      }
      const [a, b] = R.pick([[2, 8], [3, 12], [5, 20], [2, 18], [3, 27], [6, 24], [2, 32], [7, 28]]);
      const ans = Math.round(Math.sqrt(a * b));
      return mc(`√${a} × √${b} = ?`, String(ans), [`√${a + b}`, String(a * b), String(ans + 1), `${ans}√2`]);
    },
    poly9() {
      const b = R.int(-5, 5), c = R.int(-9, 9), a = R.nz(-3, 4), v = a * a + b * a + c;
      const div = a < 0 ? `x + ${-a}` : `x − ${a}`;
      const pb = b === 0 ? "" : ` ${signed(b)}x`, pc = c === 0 ? "" : ` ${signed(c)}`;
      return num(`Remainder when x²${pb}${pc} is divided by (${div})?`, v, [a * a - b * a + c, c, v + a]);
    },
    lin2() {
      const a = R.int(1, 6), b = R.int(1, 5), p = R.int(-4, 6), k = R.int(-5, 9), c = a * p + b * k;
      return num(`If (${p}, k) lies on the line ${a}x + ${b}y = ${neg(c)}, find k.`, k, [c - a * p, -k, k + 1, c / b]);
    },
    coord9() {
      const x = R.nz(-9, 9), y = R.nz(-9, 9);
      if (R.int(0, 4) === 0) {
        const onX = R.int(0, 1);
        return mc(`The point (${onX ? neg(x) : 0}, ${onX ? 0 : neg(y)}) lies on the…`, onX ? "x-axis" : "y-axis", [onX ? "y-axis" : "x-axis", "Quadrant I", "Quadrant III"]);
      }
      const q = x > 0 ? (y > 0 ? "I" : "IV") : y > 0 ? "II" : "III";
      return mc(`In which quadrant does (${neg(x)}, ${neg(y)}) lie?`, "Quadrant " + q, ["I", "II", "III", "IV"].filter((z) => z !== q).map((z) => "Quadrant " + z));
    },
    ang9() {
      const t = R.int(0, 2);
      if (t === 0) { const a = R.int(30, 90), b = R.int(20, 150 - a); return num(`Two angles of a triangle are ${a}° and ${b}°. The third angle (°)?`, 180 - a - b, [90 - a, 360 - a - b, 180 - a]); }
      if (t === 1) { const a = R.int(15, 165); return num(`Supplement of ${a}° (in degrees)?`, 180 - a, [90 - a, 360 - a, a]); }
      const a = R.int(10, 80); return num(`Complement of ${a}° (in degrees)?`, 90 - a, [180 - a, a, 100 - a]);
    },
    stat9() {
      if (R.int(0, 1)) {
        const m = R.int(10, 60), devs = R.shuffle([-6, -3, 0, 4, 5]);
        const xs = devs.map((d) => m + d);
        return num(`Mean of ${xs.join(", ")}?`, m, [m + 1, xs[2], Math.max(...xs) - Math.min(...xs)]);
      }
      const xs = Array.from({ length: 7 }, () => R.int(1, 40));
      const s = xs.slice().sort((a, b) => a - b);
      return num(`Median of ${xs.join(", ")}?`, s[3], [xs[3], s[2], s[4], Math.round(xs.reduce((a, b) => a + b) / 7)]);
    },
    real10() {
      const h = R.int(2, 12), x = R.int(2, 7); let y; do { y = R.int(2, 9); } while (y === x || gcd(x, y) !== 1);
      const a = h * x, b = h * y, l = h * x * y;
      if (R.int(0, 1)) return num(`HCF of two numbers is ${h} and their LCM is ${l}. One number is ${a}. The other?`, b, [l / a, h * a, l / h]);
      return num(`LCM of ${a} and ${b}?`, l, [a * b, h, l * 2]);
    },
    pair10() {
      const x = R.int(-5, 12), y = R.int(-5, 12);
      if (R.int(0, 1)) return num(`x + y = ${neg(x + y)} and x − y = ${neg(x - y)}. Find x.`, x, [y, x + y, x - y]);
      const a = R.int(1, 5), b = R.int(1, 5), c = R.int(1, 5), d = R.nz(-4, 4);
      if (a * d - b * c === 0) return G.pair10();
      return num(`${a}x + ${b}y = ${neg(a * x + b * y)} and ${c}x ${signed(d)}y = ${neg(c * x + d * y)}. Find y.`, y, [x, -y, y + 1]);
    },
    quad10() {
      const p = R.nz(-6, 9); let q; do { q = R.nz(-6, 9); } while (q === p);
      const b = -(p + q), c = p * q;
      const eq = `x²${b === 0 ? "" : " " + signed(b) + "x"}${c === 0 ? "" : " " + signed(c)} = 0`;
      const fmt = (u, v) => `${neg(Math.min(u, v))}, ${neg(Math.max(u, v))}`;
      if (R.int(0, 2) === 0) return num(`Sum of the roots of ${eq}?`, p + q, [-(p + q), c, p * q + 1]);
      return mc(`Solve ${eq}`, fmt(p, q), [fmt(-p, -q), fmt(p, -q), fmt(-p, q), fmt(p + 1, q - 1)]);
    },
    ap10() {
      const a = R.int(-5, 20), d = R.nz(-4, 9);
      const seq = [a, a + d, a + 2 * d].map(neg).join(", ");
      if (R.int(0, 1)) { const n = R.int(8, 25); return num(`Find the ${n}th term of the AP ${seq}, …`, a + (n - 1) * d, [a + n * d, a * n, a + (n - 2) * d]); }
      const n = R.int(5, 15), S = (n * (2 * a + (n - 1) * d)) / 2;
      return num(`Sum of the first ${n} terms of the AP ${seq}, …?`, S, [a + (n - 1) * d, n * (a + n * d), S + d]);
    },
    trig10() {
      const pool = ["0", "1", "1/2", "√3/2", "1/√2", "√3", "1/√3", "2"];
      const [q, a] = R.pick([["sin 30°", "1/2"], ["cos 60°", "1/2"], ["tan 45°", "1"], ["sin 90°", "1"], ["cos 0°", "1"], ["tan 60°", "√3"], ["sin 60°", "√3/2"], ["cos 30°", "√3/2"], ["tan 30°", "1/√3"], ["sin 45°", "1/√2"], ["cos 90°", "0"], ["sin²θ + cos²θ", "1"], ["sec²θ − tan²θ", "1"], ["sec 60°", "2"], ["cosec 30°", "2"]]);
      return mc(`Value of ${q}?`, a, R.shuffle(pool.filter((p) => p !== a)));
    },
    prob10() {
      if (R.int(0, 2) === 0) {
        const r = R.int(2, 9), b = R.int(2, 9);
        return mc(`A bag has ${r} red and ${b} blue balls. P(red) = ?`, frac(r, r + b), [frac(b, r + b), frac(r, b), frac(1, r + b), frac(r + 1, r + b + 1), frac(r, r + b + 1), frac(r - 1, r + b)]);
      }
      const [q, a] = R.pick([["P(even number) when a die is rolled", "1/2"], ["P(number greater than 4) on a die", "1/3"], ["P(a king) from a deck of 52 cards", "1/13"], ["P(a red card) from a deck of 52", "1/2"], ["P(a heart) from a deck of 52", "1/4"], ["P(two heads) when 2 coins are tossed", "1/4"], ["P(at least one head) in 2 coin tosses", "3/4"], ["P(prime number) on a die", "1/2"], ["P(a sure event)", "1"], ["P(an impossible event)", "0"], ["P(a 6) on a die", "1/6"]]);
      return mc(`${q}?`, a, R.shuffle(["1/2", "1/3", "1/4", "1/6", "1/13", "3/4", "1", "0", "2/3"].filter((x) => x !== a)));
    },
    coord10() {
      const [p, q, h] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15]]);
      const x = R.int(-5, 5), y = R.int(-5, 5), sx = R.pick([1, -1]), sy = R.pick([1, -1]);
      return num(`Distance between (${neg(x)}, ${neg(y)}) and (${neg(x + sx * p)}, ${neg(y + sy * q)})?`, h, [p + q, h * h, h + 1]);
    },
    pctC() {
      const t = R.int(0, 2);
      if (t === 0) { const cp = 20 * R.int(10, 100), p = R.pick([5, 10, 15, 20, 25, 30, 40]), sp = (cp * (100 + p)) / 100; return num(`Cost price ₹${cp}, profit ${p}%. Selling price (₹)?`, sp, [(cp * p) / 100, cp - (cp * p) / 100, sp + p]); }
      if (t === 1) { const cp = 20 * R.int(10, 100), p = R.pick([5, 10, 20, 25]), sp = (cp * (100 - p)) / 100; return mc(`Bought for ₹${cp}, sold for ₹${sp}. Profit or loss %?`, `${p}% loss`, [`${p}% profit`, `${p * 2}% loss`, `${(cp - sp)}% loss`, `${p + 5}% loss`, `${p / 2}% loss`]); }
      const p = R.pick([10, 20, 25, 30, 50]), net = -(p * p) / 100;
      return mc(`A price rises ${p}% and then falls ${p}%. Net change?`, `${Math.abs(net)}% decrease`, ["No change", `${Math.abs(net)}% increase`, `${p / 10}% decrease`, `${p / 5}% decrease`, `${p}% decrease`]);
    },
    twC() {
      const [a, b, t] = R.pick([[12, 24, 8], [10, 15, 6], [20, 30, 12], [6, 12, 4], [4, 12, 3], [30, 60, 20], [18, 9, 6], [24, 8, 6], [15, 30, 10], [20, 5, 4]]);
      return num(`A can finish a job in ${a} days and B in ${b} days. Working together, how many days?`, t, [(a + b) / 2, a + b, Math.abs(a - b)].map((v) => Math.round(v)));
    },
    intC() {
      if (R.int(0, 1)) { const p = 1000 * R.int(1, 20), r = R.int(3, 12), t = R.int(2, 6), si = (p * r * t) / 100; return num(`Simple interest on ₹${p} at ${r}% p.a. for ${t} years (₹)?`, si, [p + si, (p * r) / 100, si * 2]); }
      const p = 400 * R.int(2, 25), r = R.pick([5, 10, 20]), ci = Math.round(p * ((1 + r / 100) ** 2 - 1)), si = (p * r * 2) / 100;
      return num(`Compound interest on ₹${p} at ${r}% p.a. for 2 years, compounded yearly (₹)?`, ci, [si, p + ci, ci + r]);
    },
    logC() {
      if (R.int(0, 3) === 0) return mc("log₁₀ 2 + log₁₀ 5 = ?", "1", ["log₁₀ 7", "10", "0", "7"]);
      const b = R.pick([2, 3, 5, 10]), k = R.int(2, b === 2 ? 7 : 4), sub = { 2: "₂", 3: "₃", 5: "₅", 10: "₁₀" }[b];
      return num(`log${sub} ${b ** k} = ?`, k, [b * k, k + 1, b ** (k - 1)]);
    },
    derC() {
      if (R.int(0, 3) === 0) {
        const [f, d] = R.pick([["sin x", "cos x"], ["cos x", "−sin x"], ["eˣ", "eˣ"], ["ln x", "1/x"]]);
        return mc(`d/dx (${f}) = ?`, d, R.shuffle(["cos x", "−sin x", "eˣ", "1/x", "sin x", "x eˣ⁻¹", "−cos x"].filter((z) => z !== d)));
      }
      const a = R.int(2, 9), n = R.int(2, 6), c = a * n;
      const term = (k, p) => (p === 1 ? `${k}x` : `${k}x${sup(p)}`);
      return mc(`d/dx (${term(a, n)}) = ?`, term(c, n - 1), [term(a, n - 1), term(c, n), term(a * (n - 1), n - 1), term(n, a)]);
    },
    seriesC() {
      const t = R.int(0, 3);
      if (t === 0) { const a = R.int(1, 30), d = R.int(2, 12), s = [0, 1, 2, 3].map((i) => a + i * d); return num(`Next number: ${s.join(", ")}, ?`, a + 4 * d, [a + 5 * d, a + 3 * d + 1, a + 4 * d + 2]); }
      if (t === 1) { const a = R.int(1, 5), r = R.pick([2, 3]), s = [0, 1, 2, 3].map((i) => a * r ** i); return num(`Next number: ${s.join(", ")}, ?`, a * r ** 4, [a * r ** 3 + r, a * r ** 4 + a, a * r ** 3 * 2 + 1]); }
      if (t === 2) { const k = R.int(1, 8), s = [0, 1, 2, 3].map((i) => (k + i) ** 2); return num(`Next number: ${s.join(", ")}, ?`, (k + 4) ** 2, [(k + 4) ** 2 + 1, s[3] + 2 * (k + 3), (k + 5) ** 2]); }
      const a = R.int(1, 20), s = [a, a + 1, a + 3, a + 6, a + 10];
      return num(`Next number: ${s.join(", ")}, ?`, a + 15, [a + 14, a + 16, a + 20]);
    },
    avgC() {
      if (R.int(0, 1)) { const a = R.int(5, 60), n = R.pick([5, 7, 9]); return num(`Average of ${n} consecutive numbers starting at ${a}?`, a + (n - 1) / 2, [a + n, a + (n + 1) / 2, a + n / 2 + 1].map(Math.round)); }
      const avg = R.int(15, 40), drop = R.int(2, 6), newAvg = avg - drop, x = 5 * avg - 4 * newAvg;
      return num(`The average of 5 numbers is ${avg}. Removing one makes the average of the rest ${newAvg}. The removed number?`, x, [avg + drop, 5 * avg - newAvg, x - drop]);
    },
  };

  // ---------- Pair-list generators ----------
  function pairGen(list, ask) {
    return () => {
      const [w, m] = R.pick(list);
      const others = R.shuffle(list.filter((p) => p[1] !== m)).map((p) => p[1]);
      return mc(ask(w), m, others);
    };
  }
  const SYN = [["happy", "glad"], ["big", "huge"], ["small", "tiny"], ["fast", "quick"], ["begin", "start"], ["shut", "close"], ["brave", "bold"], ["smart", "clever"], ["end", "finish"], ["easy", "simple"], ["silent", "quiet"], ["rich", "wealthy"], ["gift", "present"], ["afraid", "scared"], ["angry", "furious"]];
  const ANT = [["hot", "cold"], ["early", "late"], ["heavy", "light"], ["strong", "weak"], ["ancient", "modern"], ["accept", "refuse"], ["give", "take"], ["empty", "full"], ["loud", "quiet"], ["victory", "defeat"], ["friend", "enemy"], ["arrive", "depart"], ["generous", "selfish"], ["shallow", "deep"], ["rough", "smooth"]];
  const SPELL = [["necessary", "neccessary", "necesary", "nessesary"], ["beautiful", "beautifull", "beutiful", "beatiful"], ["separate", "seperate", "separete", "seprate"], ["believe", "beleive", "belive", "beleave"], ["February", "Febuary", "Februry", "Febraury"], ["receive", "recieve", "receve", "riceive"], ["government", "goverment", "governmint", "govermant"], ["environment", "enviroment", "envirnoment", "enviornment"], ["tomorrow", "tommorow", "tomorow", "tommorrow"], ["library", "libary", "liberary", "librery"], ["knowledge", "knowlege", "knowledg", "nowledge"], ["restaurant", "restaraunt", "resturant", "restorant"], ["definitely", "definately", "definitly", "defenitely"], ["occasion", "ocassion", "occassion", "ocasion"], ["calendar", "calender", "calandar", "calander"]];
  const IDIOM = [["A piece of cake", "Very easy"], ["Break the ice", "Start a conversation in an awkward situation"], ["Once in a blue moon", "Very rarely"], ["Hit the books", "Study hard"], ["Under the weather", "Feeling ill"], ["Spill the beans", "Reveal a secret"], ["Cost an arm and a leg", "Very expensive"], ["Bite off more than you can chew", "Take on too much"], ["Burn the midnight oil", "Work late into the night"], ["In hot water", "In trouble"]];
  const VOCAB10 = [["reluctant", "unwilling"], ["abundant", "plentiful"], ["fragile", "easily broken"], ["vivid", "bright and clear"], ["obstacle", "a hindrance"], ["sincere", "genuine"], ["anxious", "worried"], ["courteous", "polite"], ["vast", "very large"], ["humble", "modest"], ["curious", "eager to know"], ["tranquil", "calm and peaceful"]];
  const VOCABC = [["ubiquitous", "found everywhere"], ["ephemeral", "lasting a very short time"], ["benevolent", "kind and generous"], ["candid", "frank and honest"], ["meticulous", "very careful about details"], ["pragmatic", "practical and realistic"], ["ambiguous", "having more than one meaning"], ["diligent", "hard-working"], ["eloquent", "fluent and persuasive"], ["frugal", "careful with money"], ["resilient", "able to recover quickly"], ["verbose", "using too many words"], ["lethargic", "sluggish and tired"], ["impeccable", "flawless"]];
  const OWS = [["One who cannot read or write", "Illiterate"], ["A person who loves books", "Bibliophile"], ["The study of birds", "Ornithology"], ["Government by the people", "Democracy"], ["One who knows everything", "Omniscient"], ["Life story written by oneself", "Autobiography"], ["That which cannot be seen", "Invisible"], ["A place where bees are kept", "Apiary"], ["One who walks in their sleep", "Somnambulist"], ["Fear of heights", "Acrophobia"], ["A speech made without preparation", "Extempore"], ["An animal that eats only plants", "Herbivore"]];
  const PHRASAL = [["give up", "stop trying; quit"], ["look after", "take care of"], ["put off", "postpone"], ["call off", "cancel"], ["run out of", "have none left"], ["turn down", "reject"], ["carry on", "continue"], ["look up", "search for information"], ["get along", "have a friendly relationship"], ["break down", "stop working"]];


  // ---------- More generators for the new NCERT books (Ganita Prakash, Ganita Manjari) ----------
  const fmtIN = (n) => { const s = String(n); if (s.length <= 3) return s; const last = s.slice(-3); return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last; };
  const ROMAN = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  const roman = (n) => { let s = ""; for (const [v, r] of ROMAN) while (n >= v) { s += r; n -= v; } return s; };
  const isPrime = (n) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const factorise = (n) => { const f = {}; for (let p = 2; n > 1; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } return Object.entries(f).map(([p, e]) => (e > 1 ? p + sup(e) : p)).join(" × "); };
  Object.assign(G, {
    pat6() {
      const t = R.int(0, 4);
      if (t === 0) { const n = R.int(3, 12); return num(`1 + 3 + 5 + … adding the first ${n} odd numbers gives?`, n * n, [2 * n, n * (n + 1), n * n + 1]); }
      if (t === 1) { const k = R.int(1, 6), s = [0, 1, 2, 3].map((i) => ((k + i) * (k + i + 1)) / 2); return num(`Triangular numbers: ${s.join(", ")}, ?`, ((k + 4) * (k + 5)) / 2, [s[3] + 4, s[3] * 2, ((k + 5) * (k + 6)) / 2]); }
      if (t === 2) { const k = R.int(0, 4), s = [0, 1, 2, 3].map((i) => 2 ** (k + i)); return num(`Powers of 2: ${s.join(", ")}, ?`, 2 ** (k + 4), [s[3] + 2, s[3] * 3, s[3] + s[2] + 1]); }
      if (t === 3) { const k = R.int(1, 8), s = [0, 1, 2, 3].map((i) => (k + i) ** 2); return num(`Square numbers: ${s.join(", ")}, ?`, (k + 4) ** 2, [s[3] + 2, (k + 4) * 2, (k + 5) ** 2]); }
      const n = R.int(5, 20); return num(`1 + 2 + 3 + … + ${n} = ?`, (n * (n + 1)) / 2, [n * n, n * (n - 1) / 2, n * (n + 1)]);
    },
    ang6() {
      const t = R.int(0, 2);
      if (t === 0) {
        const d = R.pick([R.int(10, 89), 90, R.int(91, 179), 180, R.int(181, 350)]);
        const a = d < 90 ? "Acute angle" : d === 90 ? "Right angle" : d < 180 ? "Obtuse angle" : d === 180 ? "Straight angle" : "Reflex angle";
        return mc(`An angle of ${d}° is a…`, a, ["Acute angle", "Right angle", "Obtuse angle", "Straight angle", "Reflex angle"].filter((x) => x !== a));
      }
      if (t === 1) { const h = R.int(1, 11), v = Math.min(30 * h, 360 - 30 * h); return num(`Smaller angle between the hands of a clock at ${h} o'clock (°)?`, v, [30 * h === v ? 360 - v : 30 * h, h * 6, v + 30].filter((x) => x !== v)); }
      const [n, v] = R.pick([["a quarter turn", 90], ["a half turn", 180], ["three-quarters of a turn", 270], ["a full turn", 360], ["one-third of a full turn", 120], ["one-sixth of a full turn", 60]]);
      return num(`How many degrees in ${n}?`, v, [v / 2, v * 2, 360 - v, v + 90]);
    },
    play6() {
      const t = R.int(0, 3);
      if (t === 0) { const n = R.int(100, 9999); const s = String(n).split("").reduce((a, b) => a + Number(b), 0); return num(`Sum of the digits of ${n}?`, s, [s + 1, s - 1, String(n).length * 9]); }
      if (t === 1) { const n = R.int(5, 60); const nx = n % 2 ? 3 * n + 1 : n / 2; return num(`Collatz rule (even → halve it, odd → 3 × it + 1). What comes after ${n}?`, nx, [n % 2 ? n / 2 : 3 * n + 1, n + 1, n * 2].map((x) => Math.round(x))); }
      if (t === 2) { const a = R.int(1, 9), b = R.int(0, 9), p = `${a}${b}${a}`, w = new Set(); while (w.size < 3) { const x = String(R.int(100, 999)); if (x !== x.split("").reverse().join("")) w.add(x); } return mc("Which of these is a palindrome?", p, [...w]); }
      return mc("Kaprekar's routine on most 4-digit numbers always reaches…", "6174", ["1729", "4321", "9999", "1089"]);
    },
    data6() {
      const t = R.int(0, 2);
      if (t === 0) { const k = R.pick([2, 5, 10, 20, 50]), n = R.int(3, 9); return num(`In a pictograph, one 🍎 stands for ${k} apples. How many apples do ${n} 🍎 show?`, k * n, [n, k + n, k * (n + 1)]); }
      if (t === 1) { const k = R.pick([2, 4, 10]), n = R.int(2, 8); return num(`One ⭐ means ${k} students. A row shows ${n} full ⭐ and a half ⭐. How many students?`, k * n + k / 2, [k * n, k * (n + 1), n + 1]); }
      const vals = R.shuffle([R.int(1, 9), R.int(10, 19), R.int(20, 29), R.int(30, 39)]); const top = vals[0], xs = R.shuffle([top, top, top, vals[1], vals[1], vals[2], vals[3]]);
      return num(`Shoe sizes recorded: ${xs.join(", ")}. Which value occurs most often?`, top, [vals[1], vals[2], vals[3]]);
    },
    prime6() {
      const t = R.int(0, 3);
      if (t === 0) { let p; do { p = R.int(11, 97); } while (!isPrime(p)); const w = R.shuffle([15, 21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91]).slice(0, 3); return mc("Which of these is a prime number?", String(p), w.map(String)); }
      if (t === 1) { const n = R.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 60, 72, 84, 90, 96, 100]); const f = factorise(n); return mc(`Prime factorisation of ${n}?`, f, [factorise(n * 2), factorise(n % 2 ? n * 3 : n / 2), f.replace(/ × /, " + ")]); }
      if (t === 2) { const [a, b] = R.pick([[8, 15], [9, 14], [4, 9], [25, 12], [7, 20], [16, 27]]); return mc("Which pair is co-prime (HCF = 1)?", `${a} and ${b}`, ["6 and 9", "8 and 12", "10 and 15", "14 and 21"]); }
      return G.hcfLcm();
    },
    large7() {
      const t = R.int(0, 2);
      if (t === 0) { const c = R.int(1, 9), l = R.int(10, 99), n = c * 1e7 + l * 1e5; return mc(`Which is ${c} crore ${l} lakh?`, fmtIN(n), [fmtIN(n / 10), fmtIN(n * 10), fmtIN(c * 1e7 + l * 1e4)]); }
      if (t === 1) { const [q, a, w] = R.pick([["1 crore = ? lakh", "100", ["10", "1000", "1,00,000"]], ["1 lakh = ? thousand", "100", ["10", "1000", "50"]], ["1 million = ? lakh", "10", ["100", "1", "1000"]], ["1 billion = ? crore", "100", ["10", "1000", "1"]], ["10 lakh = ? million", "1", ["10", "100", "0.1"]]]); return mc(q, a, w); }
      const n = R.int(1, 9) * 1e7 + R.int(0, 99) * 1e5 + R.int(0, 99) * 1e3 + R.int(100, 999); return mc(`In ${fmtIN(n)}, the digit in the crore place is…`, String(Math.floor(n / 1e7)), [Math.floor(n / 1e5) % 10, Math.floor(n / 1e6) % 10, n % 10, ...R.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])].map(String));
    },
    arith7() {
      const a = R.int(2, 20), b = R.int(2, 9), c = R.int(2, 9), t = R.int(0, 3);
      if (t === 0) return num(`${a} + ${b} × ${c} = ?`, a + b * c, [(a + b) * c, a * b + c, a + b + c]);
      if (t === 1) return num(`(${a} + ${b}) × ${c} = ?`, (a + b) * c, [a + b * c, a * c + b, a + b + c]);
      if (t === 2) { const x = a + b + c; return num(`${x} − ${b} − ${c} = ?`, x - b - c, [x - (b - c), x - b + c, x]); }
      return num(`${a * c} ÷ ${c} + ${b} = ?`, a + b, [(a * c) / (c + b), a * b, a + b + c].map((v) => Math.round(v)));
    },
    letter7() {
      const t = R.int(0, 2), x = R.int(2, 9), a = R.int(2, 9), b = R.int(1, 15);
      if (t === 0) return num(`Value of ${a}x + ${b} when x = ${x}?`, a * x + b, [a + x + b, a * (x + b), Number(`${a}${x}`) + b]);
      if (t === 1) { const p = R.int(4, 9), q = R.int(1, p - 1), r = R.int(1, 5); return mc(`Simplify ${p}a + ${r}a − ${q}a`, `${p + r - q}a`, [`${p + r + q}a`, `${p - r - q === 0 ? 1 : Math.abs(p - r - q)}a`, `${p + r - q}a²`]); }
      return mc(`A pencil costs ₹p. What do ${a} pencils and one ₹${b} eraser cost?`, `${a}p + ${b}`, [`${a + b}p`, `${a}(p + ${b})`, `p + ${a + b}`]);
    },
    par7() {
      const a = R.int(35, 145), t = R.int(0, 4);
      const [q, v] = [[`Two parallel lines are cut by a transversal. One angle is ${a}°. Its corresponding angle?`, a], [`Parallel lines cut by a transversal: an angle is ${a}°. Its alternate interior angle?`, a], [`Parallel lines cut by a transversal: one interior angle is ${a}°. The co-interior angle on the same side?`, 180 - a], [`Two lines intersect. One angle is ${a}°. The vertically opposite angle?`, a], [`Two lines intersect. One angle is ${a}°. The angle next to it (linear pair)?`, 180 - a]][t];
      return num(q + " (°)", v, [180 - v, 90 - a > 0 ? 90 - a : 360 - a, v + 10]);
    },
    tri7() {
      const t = R.int(0, 2);
      if (t === 0) return G.ang9();
      if (t === 1) { const a = R.int(3, 9), b = R.int(3, 9), ok = R.int(0, 1), c = ok ? R.int(Math.abs(a - b) + 1, a + b - 1) : a + b + R.int(0, 4); return mc(`Can sides ${a} cm, ${b} cm and ${c} cm make a triangle?`, ok ? "Yes" : "No", ["Yes", "No", "Only a right triangle", "Only if two sides are equal"].filter((x) => x !== (ok ? "Yes" : "No"))); }
      const a = R.int(30, 80), b = R.int(30, 80); return num(`Two interior angles of a triangle are ${a}° and ${b}°. The exterior angle at the third vertex (°)?`, a + b, [180 - a - b, 360 - a - b, a + b + 10]);
    },
    frac7() {
      const t = R.int(0, 3);
      if (t === 0) { const a = R.int(1, 5), b = R.int(a + 1, 9), c = R.int(1, 5), d = R.int(c + 1, 9); return mc(`${a}/${b} × ${c}/${d} = ?`, frac(a * c, b * d), [frac(a + c, b + d), frac(a * d, b * c), frac(a * c, b + d), frac(a * c + 1, b * d), frac(a * c, b * d + 1)]); }
      if (t === 1) { const d = R.pick([3, 4, 5, 6, 8]), n = R.int(1, d - 1), k = R.int(2, 12), q = d * k; return num(`${n}/${d} of ${q} = ?`, n * k, [k, q - n * k, n * q]); }
      if (t === 2) { const a = R.int(1, 8), b = R.int(2, 9); if (a === b) return G.frac7(); return mc(`Reciprocal of ${a}/${b}?`, frac(b, a), [frac(a, b), `−${a}/${b}`, frac(1, a * b), frac(b, a + 1), frac(b + 1, a)]); }
      const a = R.int(1, 5), b = R.int(a + 1, 9), c = R.int(1, 5), d = R.int(c + 1, 9);
      return mc(`${a}/${b} ÷ ${c}/${d} = ?`, frac(a * d, b * c), [frac(a * c, b * d), frac(b * c, a * d), frac(a + d, b + c), frac(a * d + 1, b * c), frac(a * d, b * c + 1), frac(2 * a * d, b * c)]);
    },
    dec7() {
      const t = R.int(0, 2);
      if (t === 0) { const a = R.int(1, 9), b = R.int(1, 9); return mc(`0.${a} × 0.${b} = ?`, (a * b / 100).toFixed(2).replace(/0$/, "").replace(/\.$/, ""), [String(a * b / 10), (a * b / 1000).toFixed(3), `0.${a * b}`, `0.${a + b}`, String((a + b) / 100), (a * b / 100 + 0.01).toFixed(2), String(a * b)].filter((x) => x !== (a * b / 100).toFixed(2))); }
      if (t === 1) { const q = R.int(2, 12), d = R.int(2, 9); return num(`${(q * d / 10).toFixed(1)} ÷ 0.${d} = ?`, q, [q / 10, q * 10, q + 1].map((v) => Number(v.toFixed(1))), String); }
      const a = R.int(11, 99), k = R.pick([10, 100]); return mc(`${(a / 10).toFixed(1)} × ${k} = ?`, String((a * k) / 10), [String((a * k) / 100), String(a * k), (a / 100).toFixed(2)]);
    },
    data7() {
      const t = R.int(0, 2);
      if (t < 2) return G.stat9();
      const xs = Array.from({ length: 6 }, () => R.int(5, 60)); return num(`Range of ${xs.join(", ")}?`, Math.max(...xs) - Math.min(...xs), [Math.max(...xs), Math.round(xs.reduce((a, b) => a + b) / 6), Math.max(...xs) + Math.min(...xs)]);
    },
    sqcube8() { return R.int(0, 1) ? G.sq8() : G.cube8(); },
    power8() {
      const t = R.int(0, 3);
      if (t === 0) return G.exp7();
      if (t === 1) return G.exp8();
      if (t === 2) { const m = R.int(11, 99), e = R.int(3, 8); const n = m * 10 ** (e - 1); return mc(`Standard form of ${fmtIN(n).replace(/,/g, "")}?`, `${(m / 10).toFixed(1)} × 10${sup(e)}`, [`${m} × 10${sup(e)}`, `${(m / 10).toFixed(1)} × 10${sup(e - 1)}`, `${(m / 10).toFixed(1)} × 10${sup(e + 1)}`]); }
      const a = R.int(2, 9), m = R.int(5, 9), n = R.int(2, 4); return mc(`${a}${sup(m)} ÷ ${a}${sup(n)} = ?`, a + sup(m - n), [a + sup(m + n), a + sup(Math.round(m / n) + (Math.round(m / n) === m - n ? 1 : 0)), "1" + sup(m - n), a + sup(m * n), a * 2 + sup(m - n)]);
    },
    story8() {
      const t = R.int(0, 2);
      if (t === 0) { const n = R.int(4, 1999); return mc(`${n} in Roman numerals?`, roman(n), [roman(n + 1), roman(n + 10 > 3999 ? n - 10 : n + 10), roman(Math.max(1, n - 1))]); }
      if (t === 1) { const n = R.int(5, 31); return mc(`${n} written in base 2 (binary)?`, n.toString(2), [(n + 1).toString(2), (n - 1).toString(2), n.toString(2).split("").reverse().join("") === n.toString(2) ? (n + 2).toString(2) : n.toString(2).split("").reverse().join("")]); }
      const n = R.int(5, 63); return num(`Binary ${n.toString(2)} in our usual base 10?`, n, [Number(n.toString(2)) % 1000, n + 1, n * 2]);
    },
    quad8() {
      const a = R.int(60, 120), b = R.int(60, 120), c = R.int(60, 110), d = 360 - a - b - c;
      if (d <= 20 || d >= 180 || R.int(0, 2) === 0) { const x = R.int(40, 140); return num(`In a parallelogram one angle is ${x}°. The adjacent angle (°)?`, 180 - x, [x, 360 - x, 90 - x > 0 ? 90 - x : x + 10]); }
      return num(`Three angles of a quadrilateral are ${a}°, ${b}° and ${c}°. The fourth (°)?`, d, [180 - (d > 180 ? 0 : d), 540 - a - b - c, d + 10].filter((x) => x > 0));
    },
    play8() {
      const t = R.int(0, 2);
      if (t === 0) { const a = R.int(3, 40), n = R.pick([3, 5]); const s = n * a + (n * (n - 1)) / 2; return num(`Sum of ${n} consecutive numbers starting at ${a}?`, s, [n * a, s + n, s - 1]); }
      if (t === 1) { const k = R.int(1, 111), n = 9 * k + R.int(0, 1); const ok = n % 9 === 0; return mc(`Is ${n} divisible by 9? (Hint: digit sum)`, ok ? "Yes" : "No", ["Yes", "No", "Only if it is even", "Only if it ends in 9"].filter((x) => x !== (ok ? "Yes" : "No"))); }
      const odd = R.int(2, 6), even = R.int(1, 5); return mc(`Add ${odd} odd numbers and ${even} even numbers. The sum is…`, odd % 2 ? "Odd" : "Even", ["Odd", "Even", "Always a multiple of 4", "Cannot say"].filter((x) => x !== (odd % 2 ? "Odd" : "Even")));
    },
    dist8() {
      const t = R.int(0, 2);
      if (t === 0) return G.alg8();
      if (t === 1) { const a = R.pick([25, 12, 15, 35, 45]), m = R.int(1, 9); return num(`Use distribution: ${a} × ${100 + m} = ${a} × 100 + ${a} × ${m} = ?`, a * (100 + m), [a * 100 + m, a * (100 + m) + a, a * m * 100]); }
      const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9); return mc(`${a}(x + ${b}) + ${c}x = ?`, `${a + c}x + ${a * b}`, [`${a + c}x + ${b}`, `${a * c}x + ${a * b}`, `${a + b + c}x`, `${a + c}x + ${a * b + c}`, `${a + c + 1}x + ${a * b}`]);
    },
    prop8() {
      const t = R.int(0, 2);
      if (t === 0) return G.ratio6();
      if (t === 1) { const [q, a, w] = R.pick([["1 km = ? m", 1000, [100, 10000]], ["1 kg = ? g", 1000, [100, 10]], ["1 hour = ? seconds", 3600, [60, 360]], ["1 m = ? mm", 1000, [100, 10]], ["1 L = ? mL", 1000, [100, 10]]]); return num(q, a, w); }
      const s = R.pick([36, 54, 72, 90, 18]); return num(`${s} km/h = ? m/s`, (s * 5) / 18, [s / 6, (s * 18) / 5, s / 3.6 + 1].map((x) => Math.round(x)));
    },
    pct8() {
      const t = R.int(0, 3);
      if (t === 0) return G.pct7();
      if (t === 1) return G.cq8();
      if (t === 2) { const [f, p] = R.pick([["1/2", 50], ["1/4", 25], ["3/4", 75], ["1/5", 20], ["2/5", 40], ["1/8", 12.5], ["3/20", 15], ["7/10", 70], ["1/20", 5]]); return mc(`${f} as a percentage?`, p + "%", [p * 2 + "%", p / 2 + "%", 100 - p + "%", p + 10 + "%"]); }
      const total = R.pick([20, 25, 40, 50]), got = R.int(Math.ceil(total / 3), total - 1); return num(`Scored ${got} out of ${total}. Percentage?`, (got / total) * 100, [got, total - got, (got / total) * 10].map((v) => Math.round(v * 10) / 10));
    },
    pyth8() {
      const [p, q, h] = R.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [12, 16, 20]]);
      if (R.int(0, 1)) return num(`Right triangle with legs ${p} and ${q}. Hypotenuse?`, h, [p + q, h + 1, p * q / 2]);
      return num(`Right triangle: hypotenuse ${h}, one leg ${p}. The other leg?`, q, [h - p, q + 1, h + p]);
    },
    prop8b() {
      const t = R.int(0, 2);
      if (t === 0) { const a = R.int(1, 5), b = R.int(1, 5), k = R.int(10, 60); const tot = (a + b) * k; return num(`Share ₹${tot} in the ratio ${a} : ${b}. The first share (₹)?`, a * k, [b * k, tot / 2, a * k + k]); }
      if (t === 1) { const w = R.int(2, 8), d = R.int(3, 12), w2 = R.pick([w * 2, w * 3, Math.max(1, w / 2)].filter(Number.isInteger)); const ans = (w * d) / w2; if (!Number.isInteger(ans)) return G.prop8b(); return num(`${w} workers build a wall in ${d} days. How many days for ${w2} workers (same pace)?`, ans, [(d * w2) / w, d, d + w2 - w].map(Math.round)); }
      const s = R.pick([2, 5, 10, 25]), cm = R.int(2, 12); return num(`Map scale 1 cm : ${s} km. ${cm} cm on the map is how many km?`, s * cm, [s + cm, cm, s * cm * 10]);
    },
    dots8() {
      if (R.int(0, 1)) return G.stat9();
      const n = R.int(4, 9), m = R.int(10, 40); return num(`The mean of ${n} numbers is ${m}. Their sum?`, n * m, [n + m, m, n * m + n]);
    },
    algplay8() {
      const t = R.int(0, 2);
      if (t === 0) { const c = R.int(9, 22); return num(`On a calendar, a 3×3 block of dates has ${c} in the centre. Sum of all 9 dates?`, 9 * c, [8 * c, 9 * c + 9, 3 * c]); }
      if (t === 1) { const a = R.int(1, 9), b = R.int(1, 9), c = R.int(1, 9); return num(`Number pyramid: each block = sum of the two below. Bottom row ${a}, ${b}, ${c}. Top?`, a + 2 * b + c, [a + b + c, 2 * (a + b + c), a + b + 2 * c]); }
      const x = R.int(2, 20); return num(`Think of a number, double it, add 10, halve it, subtract your number. If you start with ${x}, you get?`, 5, [x, 10, x + 5]);
    },
    area8() {
      const t = R.int(0, 3), a = R.int(4, 20), b = R.int(3, 15), h = 2 * R.int(2, 9);
      if (t === 0) return num(`Area of a parallelogram, base ${a} cm and height ${b} cm (cm²)?`, a * b, [2 * (a + b), (a * b) / 2, a + b]);
      if (t === 1) return num(`Area of a trapezium, parallel sides ${a} and ${b} cm, height ${h} cm (cm²)?`, ((a + b) * h) / 2, [(a + b) * h, a * b, a * b * h / 2]);
      if (t === 2) { const d1 = 2 * R.int(2, 9), d2 = R.int(3, 14); return num(`Area of a rhombus with diagonals ${d1} cm and ${d2} cm (cm²)?`, (d1 * d2) / 2, [d1 * d2, d1 + d2, 2 * (d1 + d2)]); }
      return G.area7();
    },
    lpoly9() {
      const t = R.int(0, 2), a = R.nz(-6, 7), b = R.nz(-9, 9);
      const p = `${a === 1 ? "" : a === -1 ? "−" : neg(a)}x ${signed(b)}`;
      if (t === 0) { const x = R.int(-4, 6); return num(`p(x) = ${p}. Find p(${neg(x)}).`, a * x + b, [a * x - b, a + x + b, -(a * x + b)]); }
      if (t === 1) { const k = R.int(-6, 6), c = -a * k; const q = `${a === 1 ? "" : a === -1 ? "−" : neg(a)}x${c === 0 ? "" : " " + signed(c)}`; return num(`Zero of the linear polynomial ${q}?`, k, [-k, c, k + 1]); }
      const m = R.int(2, 9), c = R.int(10, 99); return num(`A taxi charges ₹${c} plus ₹${m} per km. Cost for ${b < 0 ? -b : b} km (₹)?`, c + m * Math.abs(b), [(c + m) * Math.abs(b), c * Math.abs(b) + m, c + m]);
    },
    ident9() {
      const t = R.int(0, 3), a = R.int(2, 9);
      if (t === 0) return G.alg8();
      if (t === 1) { const m = R.int(1, 9); return num(`Using a² − b²: ${50 + m} × ${50 - m} = ?`, 2500 - m * m, [2500, 2500 + m * m, 2500 - 2 * m]); }
      if (t === 2) return mc(`(x + ${a})³ = x³ + __x² + ${3 * a * a}x + ${a ** 3}. Fill the blank.`, String(3 * a), [String(a), String(a * a), String(3 * a * a), String(2 * a), String(3 * a + 3)]);
      return mc(`Factorise x² − ${a * a}`, `(x + ${a})(x − ${a})`, [`(x − ${a})²`, `(x + ${a})²`, `(x − ${a * a})(x + 1)`]);
    },
    circle9() {
      const [q, a, w] = R.pick([
        ["The longest chord of a circle is the…", "Diameter", ["Radius", "Arc", "Tangent"]],
        ["The perpendicular from the centre to a chord…", "Bisects the chord", ["Equals the radius", "Is parallel to it", "Doubles the chord"]],
        ["Equal chords of a circle are ___ from the centre.", "Equidistant", ["At different distances", "Always touching", "Twice as far"]],
        ["The angle in a semicircle is…", "90°", ["180°", "60°", "45°"]],
        ["Angles in the same segment of a circle are…", "Equal", ["Supplementary", "Complementary", "Always 90°"]],
        ["Opposite angles of a cyclic quadrilateral add up to…", "180°", ["90°", "360°", "270°"]],
        ["How many circles pass through three non-collinear points?", "Exactly one", ["None", "Two", "Infinitely many"]],
        ["Lines of symmetry of a circle:", "Infinitely many", ["1", "2", "4"]],
      ]);
      if (R.int(0, 2) === 0) { const c = R.int(30, 80); return num(`An arc subtends ${2 * c}° at the centre. The angle it subtends on the remaining part of the circle (°)?`, c, [2 * c, 180 - 2 * c, 4 * c].filter((x) => x > 0)); }
      return mc(q, a, w);
    },
    meas9() {
      const t = R.int(0, 3);
      if (t === 0) return G.area7();
      if (t === 1) { const [a, b, c, ar] = R.pick([[13, 14, 15, 84], [5, 12, 13, 30], [6, 8, 10, 24], [9, 10, 17, 36], [7, 15, 20, 42], [10, 10, 12, 48]]); return num(`Heron's formula: area of a triangle with sides ${a}, ${b}, ${c} cm (cm²)?`, ar, [a * b / 2, (a + b + c) / 2, ar * 2]); }
      if (t === 2) { const k = R.int(1, 4), r = 7 * k, th = R.pick([90, 180, 60]); return num(`Arc length of a ${th}° sector, radius ${r} cm (π = 22/7, cm)?`, (44 * k * th) / 360, [(154 * k * k * th) / 360, 44 * k, (22 * k * th) / 360].map((v) => Math.round(v * 100) / 100)); }
      return mc("π is a(n)…", "Irrational number", ["Integer", "Exactly 22/7", "Terminating decimal"]);
    },
    prob9() {
      if (R.int(0, 1)) return G.prob10();
      const n = R.pick([20, 25, 40, 50, 100]), h = R.int(Math.floor(n / 4), Math.floor((3 * n) / 4));
      return mc(`A coin tossed ${n} times shows heads ${h} times. Experimental P(heads)?`, frac(h, n), [frac(n - h, n), "1/2", frac(h, n - h), frac(h + 1, n), frac(h, 2 * n), frac(h - 1, n)]);
    },
    seq9() {
      const t = R.int(0, 2);
      if (t < 2) return G.ap10();
      const a = R.int(1, 5), r = R.pick([2, 3]), n = R.int(4, 6); return num(`Geometric progression ${a}, ${a * r}, ${a * r * r}, … The ${n}th term?`, a * r ** (n - 1), [a * r ** n, a + (n - 1) * r, a * r * (n - 1)]);
    },
    vol9() {
      const t = R.int(0, 3), l = R.int(2, 12), b = R.int(2, 10), h = R.int(2, 9);
      if (t === 0) return num(`Volume of a cuboid ${l} × ${b} × ${h} cm (cm³)?`, l * b * h, [2 * (l * b + b * h + h * l), l + b + h, l * b]);
      if (t === 1) return num(`Total surface area of a cuboid ${l} × ${b} × ${h} cm (cm²)?`, 2 * (l * b + b * h + h * l), [l * b * h, l * b + b * h + h * l, 4 * (l + b + h)]);
      if (t === 2) { const k = R.int(1, 3), r = 7 * k; return num(`Volume of a cylinder, radius ${r} cm and height ${h} cm (π = 22/7, cm³)?`, 154 * k * k * h, [44 * k * h, 154 * k * h, 154 * k * k]); }
      const a = R.int(2, 10); return num(`Volume of a cube of side ${a} cm (cm³)?`, a ** 3, [6 * a * a, a * a, 12 * a]);
    },
    algo9() {
      const t = R.int(0, 2);
      if (t === 0) { const [a, b] = R.pick([[48, 18], [84, 36], [56, 42], [120, 75], [91, 65], [270, 192]]); return num(`Euclid's algorithm: HCF of ${a} and ${b}?`, gcd(a, b), [gcd(a, b) * 2, a - b, gcd(a, b) / 2].map(Math.round)); }
      if (t === 1) { const xs = Array.from({ length: 5 }, () => R.int(1, 50)); return num(`An algorithm keeps the largest so far while scanning ${xs.join(", ")}. What does it output?`, Math.max(...xs), [xs[xs.length - 1], Math.min(...xs), xs[0] === Math.max(...xs) ? xs[1] : xs[0]]); }
      const n = R.pick([8, 16, 32, 64, 128]); return num(`Binary search on a sorted list of ${n} items needs at most how many halvings to reach 1 item?`, Math.log2(n), [n / 2, n, Math.log2(n) + 2]);
    },
    quad9() {
      const [q, a, w] = R.pick([
        ["Diagonals of a parallelogram…", "Bisect each other", ["Are always equal", "Are always perpendicular", "Never meet"]],
        ["A parallelogram with all sides equal is a…", "Rhombus", ["Trapezium", "Kite", "Rectangle"]],
        ["Diagonals of a rectangle are…", "Equal", ["Perpendicular", "Unequal", "Parallel"]],
        ["The diagonals of a rhombus meet at…", "Right angles", ["60°", "45°", "120°"]],
        ["The line joining the mid-points of two sides of a triangle is parallel to the third side and…", "Half of it", ["Equal to it", "Twice it", "A third of it"]],
        ["A quadrilateral with exactly one pair of parallel sides is a…", "Trapezium", ["Parallelogram", "Rhombus", "Square"]],
      ]);
      return R.int(0, 2) === 0 ? G.quad8() : mc(q, a, w);
    },
    prop9() {
      const [q, a, w] = R.pick([
        ["The converse of 'If p, then q' is…", "If q, then p", ["If not p, then not q", "p and q", "If not q, then not p"]],
        ["'If a number is divisible by 4, it is even.' Its converse is…", "False", ["True", "Always true for primes", "Meaningless"]],
        ["The contrapositive of 'If p, then q' is…", "If not q, then not p", ["If q, then p", "If not p, then not q", "q or p"]],
        ["A statement that is proved from axioms is a…", "Theorem", ["Conjecture", "Definition", "Guess"]],
        ["A single example that shows a statement is false is a…", "Counterexample", ["Proof", "Axiom", "Converse"]],
        ["'All primes are odd.' A counterexample is…", "2", ["3", "9", "11"]],
        ["Statements accepted as true without proof are called…", "Axioms", ["Theorems", "Converses", "Corollaries"]],
        ["Converse of 'If two angles are vertically opposite, they are equal':", "If two angles are equal, they are vertically opposite (false)", ["Equal angles are always supplementary", "It is the same statement", "Vertically opposite angles add to 180°"]],
      ]);
      return mc(q, a, w);
    },
  });
  // ---------- Question banks: "question|answer|wrong|wrong|wrong" ----------
  const B = (lines) => lines.map((l) => l.split("|"));
  const BANK = {
    food6: B(["Which nutrient do rice and wheat mainly provide?|Carbohydrates|Proteins|Vitamins|Minerals", "Deficiency of vitamin C causes…|Scurvy|Rickets|Beriberi|Night blindness", "Iodine solution turns starch…|Blue-black|Red|Yellow|Green", "Which is a good source of protein?|Pulses (dal)|Sugar|Butter|Rice", "Lack of iodine in the diet causes…|Goitre|Anaemia|Scurvy|Rickets", "Roughage in food mainly helps to…|Remove undigested food|Build muscles|Clot blood|Improve eyesight", "Deficiency of vitamin D causes…|Rickets|Scurvy|Goitre|Beriberi"]),
    sep6: B(["Separating husk from grain using wind is…|Winnowing|Sieving|Filtration|Evaporation", "Salt is obtained from sea water by…|Evaporation|Filtration|Sedimentation|Threshing", "Tea leaves are removed from tea by…|Filtration|Winnowing|Handpicking|Evaporation", "Heavier particles settling at the bottom is called…|Sedimentation|Decantation|Condensation|Sublimation", "Pouring off water without disturbing the settled mud is…|Decantation|Sedimentation|Sieving|Threshing", "Separating grain from stalks is called…|Threshing|Winnowing|Churning|Filtration", "Butter is separated from curd by…|Churning|Sieving|Winnowing|Evaporation"]),
    motion6: B(["SI unit of length is the…|Metre|Centimetre|Kilometre|Foot", "1 km equals…|1000 m|100 m|10 m|10000 m", "A swinging pendulum shows…|Periodic motion|Rectilinear motion|No motion|Random motion", "A car moving on a straight road shows…|Rectilinear motion|Circular motion|Periodic motion|Rotational motion", "The tip of a clock's hand shows…|Circular motion|Rectilinear motion|Random motion|No motion", "1 metre equals how many centimetres?|100|10|1000|50"]),
    light6: B(["An object that gives out its own light is…|Luminous|Opaque|Transparent|Translucent", "A shadow forms when light is blocked by…|An opaque object|A transparent object|Clear air|A beam of light", "A pinhole camera forms an image that is…|Inverted|Erect and larger|Not formed|A different colour", "Which of these is transparent?|Clear glass|Wood|Butter paper|Cardboard", "Light travels in…|Straight lines|Curves|Circles|Zig-zags", "Butter paper is…|Translucent|Transparent|Opaque|Luminous"]),
    elec6: B(["An electric cell has…|Two terminals|One terminal|Three terminals|No terminals", "A material that lets current flow is a…|Conductor|Insulator|Resistor of rubber|Vacuum", "Which is an insulator?|Rubber|Copper|Iron|Aluminium", "A device used to open or close a circuit is a…|Switch|Bulb|Cell|Wire", "The thin wire inside a bulb that glows is the…|Filament|Terminal|Switch|Fuse", "A bulb glows only when the circuit is…|Closed|Open|Broken|Without a cell"]),
    nutri7: B(["The process by which plants make food is…|Photosynthesis|Respiration|Transpiration|Digestion", "The green pigment in leaves is…|Chlorophyll|Haemoglobin|Melanin|Carotene", "Which gas do plants take in for photosynthesis?|Carbon dioxide|Oxygen|Nitrogen|Hydrogen", "Tiny pores on leaves are called…|Stomata|Root hairs|Veins|Petals", "Cuscuta (Amarbel) is a…|Parasite|Autotroph|Insectivorous plant|Saprotroph", "Insectivorous plants like the pitcher plant trap insects to get…|Nitrogen|Oxygen|Water|Sunlight", "Fungi that feed on dead matter are…|Saprotrophs|Parasites|Autotrophs|Producers"]),
    acid7: B(["Blue litmus in an acid turns…|Red|Blue|Green|Yellow", "Turmeric paper with a base turns…|Red|Yellow|Blue|Green", "Lemon contains…|Citric acid|Lactic acid|Acetic acid|Formic acid", "Curd contains…|Lactic acid|Citric acid|Formic acid|Oxalic acid", "An ant sting contains…|Formic acid|Acetic acid|Citric acid|Tartaric acid", "Acid + base → salt + water is called…|Neutralisation|Evaporation|Oxidation|Rusting", "Milk of magnesia (an antacid) is a…|Base|Acid|Salt solution|Neutral liquid"]),
    heat7: B(["Normal human body temperature is about…|37 °C|47 °C|27 °C|100 °C", "In solids, heat travels mainly by…|Conduction|Convection|Radiation|Evaporation", "Heat from the Sun reaches Earth by…|Radiation|Conduction|Convection|Reflection", "A sea breeze blows during the…|Day|Night|Monsoon only|Winter only", "Dark-coloured clothes absorb…|More heat|Less heat|No heat|Only sound", "In liquids and gases, heat travels mainly by…|Convection|Conduction|Radiation|Insulation"]),
    resp7: B(["Anaerobic respiration in yeast produces…|Alcohol|Lactic acid|Oxygen|Starch", "Muscle cramps after exercise are due to…|Lactic acid|Alcohol|Citric acid|Excess oxygen", "Fish breathe through…|Gills|Lungs|Skin only|Spiracles", "An earthworm breathes through its…|Skin|Gills|Lungs|Spiracles", "Insects take in air through holes called…|Spiracles|Stomata|Gills|Alveoli", "During inhalation the chest cavity…|Expands|Contracts|Stays the same|Fills with water"]),
    curr7: B(["An electric fuse works on the…|Heating effect of current|Magnetic effect|Chemical effect|Lighting effect", "Current through a coil wound on iron makes…|An electromagnet|A battery|A bulb|A fuse", "An electric heater's element gets hot because of the…|Heating effect of current|Magnetic effect|Chemical effect|Sound effect", "A combination of two or more cells is a…|Battery|Circuit|Switch|Fuse", "LED bulbs are preferred because they…|Use less electricity|Are heavier|Get hotter|Need no current", "A compass needle near a current-carrying wire…|Gets deflected|Stays still|Melts|Glows"]),
    crop8: B(["Kharif crops are sown in the…|Rainy season (June–July)|Winter|Late spring|Autumn only", "Which is a rabi crop?|Wheat|Paddy|Maize|Cotton", "Loosening and turning the soil is…|Ploughing|Sowing|Harvesting|Threshing", "Rhizobium bacteria in legume roots fix…|Nitrogen|Oxygen|Carbon|Phosphorus", "Unwanted plants growing with a crop are…|Weeds|Manure|Fodder|Seeds", "Grains are stored on a large scale in…|Silos and granaries|Ponds|Open fields|Rivers"]),
    micro8: B(["Curd is formed from milk by…|Lactobacillus bacteria|Yeast|Viruses|Algae", "Yeast is used in making…|Bread|Curd|Vaccines|Fertiliser", "Penicillin was discovered by…|Alexander Fleming|Edward Jenner|Louis Pasteur|Robert Koch", "Malaria is caused by a…|Protozoan (Plasmodium)|Virus|Bacterium|Fungus", "The common cold is caused by a…|Virus|Bacterium|Protozoan|Fungus", "The smallpox vaccine was discovered by…|Edward Jenner|Alexander Fleming|Louis Pasteur|Marie Curie"]),
    force8: B(["Pressure equals…|Force ÷ Area|Force × Area|Area ÷ Force|Mass × Area", "SI unit of force is the…|Newton|Pascal|Joule|Watt", "SI unit of pressure is the…|Pascal|Newton|Joule|Watt", "The force between two magnets is a…|Non-contact force|Muscular force|Frictional force|Contact force", "Wide straps on a school bag…|Reduce pressure on shoulders|Increase pressure|Increase the weight|Reduce the mass", "Atmospheric pressure decreases as height…|Increases|Decreases|Stays fixed|Becomes zero"]),
    fric8: B(["Friction always acts…|Opposite to motion|Along the motion|Upwards|Nowhere", "Ball bearings reduce friction by…|Changing sliding to rolling|Increasing area|Adding weight|Heating parts", "Friction produces…|Heat|Light only|Magnetism|Electric current", "Lubricants such as oil…|Reduce friction|Increase friction|Increase weight|Stop motion", "Friction exerted by fluids is called…|Drag|Thrust|Lift|Tension", "Treads on tyres…|Increase grip|Reduce grip|Reduce weight|Only look good"]),
    sound8: B(["Sound cannot travel through…|Vacuum|Water|Air|Steel", "Sound is produced by…|Vibrations|Light|Magnetism|Heat", "The unit of frequency is the…|Hertz|Decibel|Metre|Newton", "The audible range for humans is about…|20 Hz to 20,000 Hz|2 Hz to 200 Hz|20,000 Hz to 50,000 Hz|1 Hz to 10 Hz", "Loudness is measured in…|Decibels|Hertz|Metres|Newtons", "In humans, sound is produced by the…|Larynx (voice box)|Lungs|Tongue only|Ear drum"]),
    matter9: B(["Solid changing directly into gas is…|Sublimation|Evaporation|Condensation|Fusion", "Boiling point of water at sea level is…|100 °C|0 °C|50 °C|273 °C", "0 °C on the Kelvin scale is…|273 K|0 K|100 K|373 K", "Evaporation causes…|Cooling|Heating|No change|Freezing", "Which substance sublimes?|Camphor|Salt|Sugar|Sand", "Latent heat is absorbed without a change in…|Temperature|State|Volume|Arrangement of particles"]),
    cell9: B(["The powerhouse of the cell is the…|Mitochondrion|Nucleus|Ribosome|Golgi apparatus", "Cells were first observed by…|Robert Hooke|Robert Brown|Charles Darwin|Gregor Mendel", "The nucleus was discovered by…|Robert Brown|Robert Hooke|Purkinje|Virchow", "Found in plant cells but not animal cells:|Cell wall|Nucleus|Cell membrane|Mitochondria", "'Suicide bags' of the cell are…|Lysosomes|Ribosomes|Plastids|Vacuoles", "Proteins are made at the…|Ribosomes|Lysosomes|Vacuoles|Cell wall"]),
    mot9: B(["SI unit of velocity is…|m/s|m/s²|km|N", "Speed in a given direction is…|Velocity|Acceleration|Distance|Displacement", "Rate of change of velocity is…|Acceleration|Speed|Momentum|Displacement", "Area under a velocity–time graph gives…|Displacement|Acceleration|Force|Mass", "Uniform circular motion is…|Accelerated motion|Motion at constant velocity|Rest|Motion in a straight line", "v = u + at is the…|First equation of motion|Second equation of motion|Third equation of motion|Law of gravitation"]),
    laws9: B(["Force equals…|Mass × acceleration|Mass × velocity|Mass ÷ acceleration|Weight × time", "Inertia of a body depends on its…|Mass|Velocity|Shape|Colour", "'Every action has an equal and opposite reaction' is Newton's…|Third law|First law|Second law|Law of gravitation", "Momentum equals…|Mass × velocity|Mass × acceleration|Force × time²|Weight ÷ speed", "SI unit of momentum is…|kg m/s|N|kg m/s²|J", "Passengers lurch forward when a bus suddenly stops because of…|Inertia of motion|Inertia of rest|Friction|Gravity"]),
    grav9: B(["The value of g on Earth's surface is about…|9.8 m/s²|98 m/s²|0.98 m/s²|1.6 m/s²", "The universal gravitational constant G is…|6.67 × 10⁻¹¹ N m²/kg²|9.8 m/s²|3 × 10⁸ m/s|6.02 × 10²³", "Your weight on the Moon is about…|One-sixth of that on Earth|The same|Double|Zero", "Mass of an object on the Moon is…|The same as on Earth|One-sixth|Six times|Zero", "Weight is measured in…|Newtons|Kilograms|Joules|Pascals", "The upward force exerted by a liquid is…|Buoyant force|Friction|Tension|Gravity"]),
    chem10: B(["Rusting of iron is an example of…|Oxidation|Reduction|Neutralisation|Sublimation", "CaO + H₂O → Ca(OH)₂ is a…|Combination reaction|Decomposition reaction|Displacement reaction|Double displacement", "Fe + CuSO₄ → FeSO₄ + Cu is a…|Displacement reaction|Combination reaction|Decomposition reaction|Neutralisation", "Rancidity of chips is slowed by…|Flushing packets with nitrogen|Adding water|Adding oxygen|Heating", "Electrolysis of water gives H₂ and O₂ in the volume ratio…|2 : 1|1 : 2|1 : 1|3 : 1", "Silver chloride turning grey in sunlight is…|Photolytic decomposition|Combination|Displacement|Neutralisation"]),
    acid10: B(["pH of a neutral solution is…|7|0|14|1", "Chemical name of baking soda:|Sodium hydrogen carbonate|Sodium carbonate|Calcium carbonate|Sodium chloride", "Plaster of Paris is…|CaSO₄·½H₂O|CaSO₄·2H₂O|CaCO₃|CaOCl₂", "Bleaching powder is…|CaOCl₂|NaCl|Na₂CO₃|CaCO₃", "A solution with pH less than 7 is…|Acidic|Basic|Neutral|Salty", "Washing soda is…|Na₂CO₃·10H₂O|NaHCO₃|NaOH|CaSO₄"]),
    life10: B(["The functional unit of the kidney is the…|Nephron|Neuron|Alveolus|Villus", "Blood vessels that carry blood away from the heart are…|Arteries|Veins|Capillaries|Lymph vessels", "The enzyme in saliva is…|Salivary amylase|Pepsin|Trypsin|Lipase", "The human heart has…|4 chambers|2 chambers|3 chambers|5 chambers", "In plants, xylem transports…|Water and minerals|Food|Oxygen only|Hormones only", "Photosynthesis takes place in the…|Chloroplast|Mitochondrion|Nucleus|Ribosome"]),
    ray10: B(["Dentists and torches use a…|Concave mirror|Convex mirror|Plane mirror|Prism", "Vehicle rear-view mirrors are…|Convex|Concave|Plane|Cylindrical", "SI unit of the power of a lens is the…|Dioptre|Watt|Metre|Joule", "A convex lens of focal length 0.5 m has power…|+2 D|−2 D|+0.5 D|+5 D", "Refractive index of water is about…|1.33|1.00|2.42|0.75", "The mirror formula is…|1/v + 1/u = 1/f|v = u + at|P = 1/f²|m = u/v"]),
    elec10: B(["Ohm's law is…|V = IR|P = VI²|V = I/R|R = VI", "SI unit of resistance is the…|Ohm|Volt|Ampere|Watt", "1 kWh equals…|3.6 × 10⁶ J|1000 J|3600 J|3.6 × 10³ J", "Resistors in series have total resistance…|R₁ + R₂|1/R₁ + 1/R₂|R₁ × R₂|R₁ − R₂", "Electric power P equals…|V × I|V ÷ I|I ÷ V|V × R", "Current is measured with an…|Ammeter|Voltmeter|Galvanometer only|Odometer"]),
    phyC: B(["Speed of light in vacuum is about…|3 × 10⁸ m/s|3 × 10⁶ m/s|340 m/s|9.8 m/s", "SI unit of power is the…|Watt|Joule|Newton|Pascal", "E = mc² was proposed by…|Albert Einstein|Isaac Newton|Niels Bohr|Max Planck", "SI unit of electric charge is the…|Coulomb|Ampere|Volt|Ohm", "The subatomic particle with no charge is the…|Neutron|Proton|Electron|Positron", "Kinetic energy equals…|½mv²|mgh|mv|ma"]),
    chemC: B(["Avogadro's number is about…|6.022 × 10²³|3 × 10⁸|6.67 × 10⁻¹¹|1.6 × 10⁻¹⁹", "Atomic number of carbon is…|6|12|8|14", "The most electronegative element is…|Fluorine|Oxygen|Chlorine|Nitrogen", "Normal pH of human blood is about…|7.4|6.0|8.5|5.5", "Which is a noble gas?|Argon|Nitrogen|Chlorine|Hydrogen", "The formula of ozone is…|O₃|O₂|CO₂|H₂O₂"]),
    bioC: B(["The double-helix model of DNA was proposed by…|Watson and Crick|Mendel and Darwin|Hooke and Brown|Pasteur and Koch", "Insulin is produced by the…|Pancreas|Liver|Kidney|Thyroid", "The universal blood donor group is…|O negative|AB positive|A positive|B negative", "The largest organ of the human body is the…|Skin|Liver|Brain|Lungs", "Human body cells have how many chromosomes?|46|23|44|48", "Sunlight helps the skin make vitamin…|D|A|C|K"]),
    csC: B(["5 in binary is…|101|110|111|100", "1 byte equals…|8 bits|4 bits|16 bits|1024 bits", "CPU stands for…|Central Processing Unit|Computer Power Unit|Central Program Utility|Core Processing Usage", "HTTP stands for…|HyperText Transfer Protocol|High Transfer Text Process|Hyperlink Text Transport Program|Home Tool Transfer Protocol", "RAM is…|Volatile memory|Permanent storage|An input device|A printer", "Python is a…|Programming language|Web browser|Operating system|Database"]),

    noun6: B(["Find the proper noun: 'My sister visited Jaipur last week.'|Jaipur|sister|week|visited", "Which is an abstract noun?|Honesty|Table|River|Teacher", "A ___ of fish|school|herd|pack|flock", "A ___ of wolves|pack|bunch|school|swarm", "Plural of 'child'|children|childs|childes|childrens", "Plural of 'mouse'|mice|mouses|mices|meese", "Rahul is my friend. ___ plays cricket.|He|Him|His|Them", "Find the pronoun: 'They went to the park.'|They|went|park|the"]),
    art6: B(["She is ___ honest girl.|an|a|the|no article", "I saw ___ elephant at the zoo.|an|a|the|no article", "___ sun rises in the east.|The|A|An|No article", "He wants to be ___ engineer.|an|a|the|no article", "This is ___ university in Delhi.|a|an|the|no article", "___ Ganga is a holy river.|The|A|An|No article", "I have ___ umbrella.|an|a|the|no article", "She plays ___ violin beautifully.|the|a|an|no article"]),
    tense7: B(["She ___ to school every day.|goes|go|going|gone", "They ___ football yesterday.|played|play|plays|playing", "I ___ my homework already.|have finished|finished have|has finished|am finish", "Look! It ___.|is raining|rains|rained|rain", "We ___ Delhi next week.|will visit|visited|visits|have visited", "He ___ a letter when the phone rang.|was writing|is writing|writes|has written", "By next year, she ___ her degree.|will have completed|completes|completed|has complete"]),
    prep7: B(["The book is ___ the table.|on|in|at|of", "He was born ___ 2012.|in|on|at|by", "We will meet ___ Monday.|on|in|at|since", "The train arrives ___ 5 o'clock.|at|in|on|for", "She is good ___ maths.|at|in|on|with", "The cat jumped ___ the wall.|over|at|of|since", "I have lived here ___ 2015.|since|for|from|by", "He has been waiting ___ two hours.|for|since|from|at"]),
    adj7: B(["Find the adverb: 'She sings beautifully.'|beautifully|sings|she|none of these", "Find the adjective: 'The tall boy won the race.'|tall|boy|won|race", "Comparative of 'good'|better|gooder|best|more good", "Superlative of 'bad'|worst|baddest|worse|most bad", "This is the ___ building in the city.|tallest|taller|tall|most tall", "He runs ___ than his brother.|faster|fastest|more fast|fast", "Adverb form of 'happy'|happily|happyly|happiness|happier"]),
    voice8: B(["Passive of 'Ravi wrote a letter.'|A letter was written by Ravi.|A letter is written by Ravi.|A letter has written by Ravi.|Ravi was written a letter.", "Passive of 'She sings a song.'|A song is sung by her.|A song was sung by her.|A song is sang by her.|A song sung by her.", "Passive of 'They are building a house.'|A house is being built by them.|A house is built by them.|A house was being built by them.|A house has been built by them.", "Passive of 'The cat killed the rat.'|The rat was killed by the cat.|The rat is killed by the cat.|The cat was killed by the rat.|The rat killed by the cat.", "Passive of 'Who wrote this book?'|By whom was this book written?|Who was written this book?|By whom this book was written?|Whom wrote this book?", "Passive of 'Close the door.'|Let the door be closed.|The door closed.|The door is close.|Let closed the door."]),
    sva8: B(["Each of the students ___ a book.|has|have|are having|were having", "The news ___ good.|is|are|were|have been", "Neither Ram nor his friends ___ coming.|are|is|was|has", "Mathematics ___ my favourite subject.|is|are|were|have", "Either the teacher or the students ___ wrong.|are|is|was|has been", "Bread and butter ___ my breakfast.|is|are|were|have", "One of my friends ___ in Chennai.|lives|live|are living|have lived"]),
    homo8: B(["I can't ___ the music.|hear|here|heer|hare", "___ going to the market.|They're|Their|There|Theyre", "The wind ___ the leaves away.|blew|blue|blewed|blow", "She ate a ___ of cake.|piece|peace|peice|pees", "I ___ the answer.|knew|new|gnu|knowed", "We waited for an ___.|hour|our|hower|owr", "Please ___ your name here.|write|right|rite|wright"]),
    rep9: B(["He said, \"I am tired.\"|He said that he was tired.|He said that I am tired.|He said that he is tired.|He told that he was tired.", "She said, \"I will come tomorrow.\"|She said that she would come the next day.|She said that she will come tomorrow.|She said that I would come tomorrow.|She told that she will come the next day.", "He asked me, \"Where do you live?\"|He asked me where I lived.|He asked me where do I live.|He asked me where did I live.|He asked where I live me.", "The teacher said, \"The earth goes round the sun.\"|The teacher said that the earth goes round the sun.|The teacher said that the earth went round the sun.|The teacher said that the earth had gone round the sun.|The teacher said the earth is going round the sun.", "\"Please help me,\" she said to him.|She requested him to help her.|She said him to help her.|She told him please help me.|She requested him to help me.", "He said, \"I have finished my work.\"|He said that he had finished his work.|He said that he has finished his work.|He said that I had finished my work.|He said he finished my work."]),
    modal9: B(["You ___ obey traffic rules.|must|might|could|would", "___ I come in, sir?|May|Must|Should|Would", "She ___ speak five languages.|can|must|shall|ought", "You look unwell. You ___ see a doctor.|should|shall|would|might not", "Take an umbrella; it ___ rain today.|may|must not|shall|need", "We ___ to respect our elders.|ought|should|must|can"]),
    det9: B(["There isn't ___ milk left.|much|many|few|a few", "There are ___ apples in the basket.|a few|a little|much|little", "He has ___ money, so he can't buy it.|little|few|many|a few", "___ child must wear a uniform.|Every|All|Many|Few", "I have ___ friends here, so I'm not lonely.|a few|few|little|much", "Would you like ___ tea?|some|many|few|a few"]),
    bee9: B(["'The Fun They Had' was written by…|Isaac Asimov|R.K. Narayan|Ruskin Bond|Katherine Mansfield", "In 'The Fun They Had', Margie was taught by a…|Mechanical teacher|Village teacher|Tutor from abroad|Radio programme", "Evelyn Glennie in 'The Sound of Music' is a deaf…|Percussionist|Singer|Dancer|Painter", "Ustad Bismillah Khan played the…|Shehnai|Sitar|Tabla|Flute", "'The Road Not Taken' was written by…|Robert Frost|William Wordsworth|Rabindranath Tagore|John Keats", "'My Childhood' is an extract from the life of…|A.P.J. Abdul Kalam|Jawaharlal Nehru|Mahatma Gandhi|C.V. Raman", "'The Little Girl' was written by…|Katherine Mansfield|Isaac Asimov|Ruskin Bond|Anton Chekhov"]),
    ff10: B(["In 'A Letter to God', Lencho asked God for…|100 pesos|1000 pesos|70 pesos|50 pesos", "'Long Walk to Freedom' is the autobiography of…|Nelson Mandela|Mahatma Gandhi|Martin Luther King Jr.|Barack Obama", "In 'His First Flight', the young bird is a…|Seagull|Eagle|Sparrow|Parrot", "Anne Frank named her diary…|Kitty|Margot|Peter|Miep", "In Goa, the traditional baker is called a…|Pader|Paowala|Khansama|Halwai", "'Dust of Snow' was written by…|Robert Frost|Robin Klein|Leslie Norris|Carolyn Wells", "Who claimed to have a hundred dresses?|Wanda Petronski|Peggy|Maddie|Miss Mason"]),
    conn10: B(["I stayed home ___ it was raining.|because|although|unless|so", "___ he worked hard, he failed.|Although|Because|Since|So", "You will miss the bus ___ you hurry.|unless|if|because|although", "This is the boy ___ won the prize.|who|which|whom|whose", "I know the place ___ he lives.|where|which|who|when", "She was tired, ___ she went to bed early.|so|but|although|unless"]),
    errC: B(["Choose the correct sentence.|He doesn't like coffee.|He don't like coffee.|He not like coffee.|He doesn't likes coffee.", "Choose the correct sentence.|She has been working here since 2019.|She is working here since 2019.|She has been working here for 2019.|She works here since 2019.", "Choose the correct sentence.|I look forward to meeting you.|I look forward to meet you.|I am looking forward to meet you.|I look forward meeting you.", "Choose the correct sentence.|The furniture in this room is new.|The furnitures in this room are new.|The furnitures is new.|The furniture are new.", "Choose the correct sentence.|Scarcely had I reached the station when the train left.|Scarcely had I reached the station than the train left.|Scarcely I had reached the station when the train left.|Scarcely did I reached the station when the train left.", "Choose the correct sentence.|Please return the book by Friday.|Please return back the book by Friday.|Please return the book till Friday.|Please return back the book till Friday."]),

    gkIndia: B(["The capital of India is…|New Delhi|Mumbai|Kolkata|Chennai", "India's national animal is the…|Tiger|Lion|Elephant|Peacock", "India's national bird is the…|Peacock|Parrot|Sparrow|Swan", "India's national flower is the…|Lotus|Rose|Marigold|Jasmine", "India's national song is…|Vande Mataram|Jana Gana Mana|Saare Jahan Se Achha|Ae Mere Watan", "How many states does India have?|28|29|30|25", "The Indian flag's chakra has how many spokes?|24|12|18|32"]),
    gkWorld: B(["The largest ocean is the…|Pacific Ocean|Atlantic Ocean|Indian Ocean|Arctic Ocean", "The largest continent is…|Asia|Africa|Europe|Antarctica", "The tallest mountain on Earth is…|Mount Everest|K2|Kangchenjunga|Mount Kilimanjaro", "The largest hot desert is the…|Sahara|Thar|Gobi|Kalahari", "How many continents are there?|7|5|6|8", "The Nile flows mainly through…|Africa|Asia|South America|Europe"]),
    gkSport: B(["How many players does a cricket team field?|11|9|10|12", "How many rings are on the Olympic flag?|5|4|6|7", "Major Dhyan Chand is famous for…|Hockey|Cricket|Football|Wrestling", "India's first individual Olympic gold medal was won by…|Abhinav Bindra|Neeraj Chopra|P.V. Sindhu|Milkha Singh", "Neeraj Chopra won Olympic gold in…|Javelin throw|Shot put|High jump|Discus throw", "Viswanathan Anand is a world champion in…|Chess|Badminton|Tennis|Carrom", "P.V. Sindhu plays…|Badminton|Tennis|Table tennis|Squash"]),
    gkPeople: B(["Who is called the Father of the Nation in India?|Mahatma Gandhi|Jawaharlal Nehru|Subhas Chandra Bose|Sardar Patel", "India's first Prime Minister was…|Jawaharlal Nehru|Lal Bahadur Shastri|Rajendra Prasad|Indira Gandhi", "The 'Missile Man of India' is…|A.P.J. Abdul Kalam|Vikram Sarabhai|Homi Bhabha|C.V. Raman", "India's first woman Prime Minister was…|Indira Gandhi|Sarojini Naidu|Pratibha Patil|Sushma Swaraj", "Who wrote 'Gitanjali' and won the Nobel Prize?|Rabindranath Tagore|Bankim Chandra Chatterjee|Premchand|Sarojini Naidu", "The first Indian to travel to space was…|Rakesh Sharma|Kalpana Chawla|Sunita Williams|Shubhanshu Shukla"]),
    gkHistory: B(["The First War of Independence took place in…|1857|1757|1947|1919", "The Battle of Plassey was fought in…|1757|1857|1764|1526", "The Dandi (Salt) March was in…|1930|1920|1942|1919", "The Jallianwala Bagh massacre happened in…|1919|1929|1909|1942", "The Quit India Movement began in…|1942|1930|1947|1920", "The Taj Mahal was built by…|Shah Jahan|Akbar|Babur|Aurangzeb"]),
    gkSpace: B(["Chandrayaan-3 landed near the Moon's…|South pole|North pole|Equator|Far side centre", "ISRO's headquarters are in…|Bengaluru|Sriharikota|Thiruvananthapuram|New Delhi", "The first artificial satellite was…|Sputnik 1|Aryabhata|Explorer 1|Apollo 11", "The first person to walk on the Moon was…|Neil Armstrong|Yuri Gagarin|Buzz Aldrin|Rakesh Sharma", "The telephone was invented by…|Alexander Graham Bell|Thomas Edison|Nikola Tesla|James Watt", "The largest planet in our solar system is…|Jupiter|Saturn|Earth|Neptune", "The Red Planet is…|Mars|Venus|Mercury|Jupiter"]),
    gkConst: B(["The Constitution of India came into effect on…|26 January 1950|15 August 1947|26 November 1949|2 October 1950", "Chairman of the Drafting Committee of the Constitution:|B.R. Ambedkar|Jawaharlal Nehru|Rajendra Prasad|Sardar Patel", "Fundamental Rights are in which Part of the Constitution?|Part III|Part IV|Part I|Part V", "The minimum voting age in India is…|18|21|16|25", "How many Fundamental Duties are there?|11|10|6|12", "The head of the Indian state is the…|President|Prime Minister|Chief Justice|Speaker"]),
    gkGeo: B(["The longest river in India is the…|Ganga|Godavari|Yamuna|Brahmaputra", "The largest Indian state by area is…|Rajasthan|Madhya Pradesh|Maharashtra|Uttar Pradesh", "The southernmost point of India is…|Indira Point|Kanyakumari|Rameswaram|Port Blair", "The Sundarbans delta is in…|West Bengal|Odisha|Kerala|Gujarat", "The Thar Desert is mainly in…|Rajasthan|Punjab|Haryana|Madhya Pradesh", "The 'Silicon Valley of India' is…|Bengaluru|Hyderabad|Pune|Chennai"]),
    gkOrg: B(["The United Nations was founded in…|1945|1919|1950|1939", "UN headquarters are in…|New York|Geneva|Paris|London", "WHO headquarters are in…|Geneva|New York|Rome|Vienna", "The currency of Japan is the…|Yen|Yuan|Won|Ringgit", "India hosted the G20 summit in…|2023|2021|2019|2025", "IMF headquarters are in…|Washington, D.C.|New York|Geneva|Brussels"]),
    gkDaily: B(["Sunlight helps our skin make vitamin…|D|A|C|B12", "The universal recipient blood group is…|AB positive|O negative|A positive|B negative", "The gas that makes soft drinks fizzy is…|Carbon dioxide|Oxygen|Nitrogen|Helium", "LPG used for cooking is mainly…|Butane and propane|Methane only|Hydrogen|Ethanol", "The hardest natural substance is…|Diamond|Iron|Granite|Quartz", "Pure water has a pH of…|7|5|9|0"]),
    gkEcon: B(["The Reserve Bank of India was established in…|1935|1947|1950|1969", "GST was introduced in India on…|1 July 2017|1 April 2016|26 January 2018|15 August 2017", "NITI Aayog replaced the…|Planning Commission|Finance Commission|Election Commission|RBI", "The repo rate is set by the…|RBI|SEBI|Finance Ministry|NITI Aayog", "SEBI regulates…|Securities markets|Banks' interest rates|Telecom|Railways", "The ₹1 note is signed by the…|Finance Secretary|RBI Governor|Prime Minister|President"]),
    gkTech: B(["The World Wide Web was invented by…|Tim Berners-Lee|Bill Gates|Steve Jobs|Vint Cerf", "UPI was developed by…|NPCI|RBI|SBI|ISRO", "Infosys was co-founded by…|N.R. Narayana Murthy|Ratan Tata|Azim Premji|Shiv Nadar", "Linux was created by…|Linus Torvalds|Dennis Ritchie|Guido van Rossum|Larry Page", "Bitcoin's creator used the name…|Satoshi Nakamoto|Vitalik Buterin|Hal Finney|Nick Szabo", "AI stands for…|Artificial Intelligence|Automated Internet|Advanced Interface|Applied Information"]),
  };

  // ---------- Science banks for Curiosity (6–8), Exploration (9) and the Class 10 textbook ----------
  Object.assign(BANK, {
    wonder6: B(["The first step of the scientific method is usually to…|Ask a question|Write the conclusion|Skip observation|Guess the answer key", "A testable possible explanation is a…|Hypothesis|Result|Law|Fact sheet", "In a fair test you change…|Only one thing at a time|Everything at once|Nothing at all|Only the result", "Careful noting of what we see, hear or measure is…|Observation|Imagination|Copying|Prediction only", "Scientists repeat an experiment to…|Check the results are reliable|Waste time|Change the question|Avoid recording data", "Recording results in a table helps to…|Spot patterns|Hide mistakes|Skip measuring|Remove units"]),
    div6: B(["Plants with a soft green stem, usually short, are…|Herbs|Shrubs|Trees|Climbers", "A plant with a main root and smaller side roots has a…|Taproot|Fibrous root|Prop root|No root", "Grass and wheat have…|Fibrous roots|Taproots|No roots|Aerial roots", "Leaves with a net-like pattern of veins show…|Reticulate venation|Parallel venation|No venation|Spiral venation", "The natural home of an organism is its…|Habitat|Nest only|Classroom|Diet", "A camel's long legs and humps help it survive in…|Deserts|Oceans|Polar regions|Rainforest canopies", "Plants with taproots usually have leaves with…|Reticulate venation|Parallel venation|No veins|Needle-like veins"]),
    mag6: B(["Which material does a magnet attract?|Iron|Wood|Plastic|Rubber", "The ends of a magnet where attraction is strongest are its…|Poles|Middle|Sides|Edges", "Like poles of two magnets…|Repel|Attract|Do nothing|Stick together", "A freely suspended bar magnet comes to rest pointing…|North–south|East–west|Up–down|Any direction", "A compass needle is itself a…|Small magnet|Piece of copper|Plastic pointer|Glass rod", "If you break a bar magnet into two, each piece has…|Both a north and a south pole|Only a north pole|Only a south pole|No poles", "Magnets lose their magnetism if they are…|Heated or hammered|Kept with keepers|Stored in pairs|Painted"]),
    mat6: B(["Materials that let light pass through clearly are…|Transparent|Opaque|Translucent|Lustrous", "A material that shines is called…|Lustrous|Dull|Soluble|Opaque", "Sugar disappearing in water means sugar is…|Soluble|Insoluble|Opaque|Magnetic", "Which floats on water?|A piece of cork|An iron nail|A stone|A steel coin", "Hard, shiny materials that conduct heat well are usually…|Metals|Plastics|Fabrics|Papers", "Cooking pans are made of metal because metals are good…|Conductors of heat|Insulators|Absorbers of water|Sound blockers", "Oil and water when mixed…|Form separate layers|Dissolve completely|Turn solid|Change colour"]),
    temp6: B(["Normal human body temperature is about…|37 °C|47 °C|27 °C|100 °C", "A clinical thermometer usually reads from…|35 °C to 42 °C|0 °C to 100 °C|−10 °C to 110 °C|20 °C to 30 °C", "A laboratory thermometer measures roughly…|−10 °C to 110 °C|35 °C to 42 °C|0 °C to 10 °C|100 °C to 500 °C", "The SI unit of temperature is the…|Kelvin|Degree Celsius|Fahrenheit|Joule", "Pure water freezes at…|0 °C|100 °C|37 °C|−10 °C", "Pure water boils at sea level at…|100 °C|50 °C|0 °C|212 °C", "Before using a clinical thermometer you should…|Shake the mercury below 35 °C|Heat it|Dip it in boiling water|Hold it by the bulb"]),
    water6: B(["Water changing into vapour at its surface is…|Evaporation|Condensation|Freezing|Melting", "Water vapour turning into droplets is…|Condensation|Evaporation|Melting|Boiling", "Ice changing into water is…|Melting|Freezing|Condensation|Evaporation", "Wet clothes dry faster on a…|Hot, windy day|Cold, still day|Humid, still day|Rainy day", "Droplets on the outside of a cold glass come from…|Water vapour in the air|Water leaking out|The glass sweating|Ice melting inside", "Rain, snow and hail are forms of…|Precipitation|Evaporation|Transpiration|Infiltration", "Plants lose water through their leaves by…|Transpiration|Condensation|Germination|Photosynthesis"]),
    living6: B(["Which is a characteristic of all living things?|They grow|They are green|They can fly|They have legs", "A seed sprouting into a seedling is called…|Germination|Pollination|Respiration|Excretion", "Removing waste from the body is…|Excretion|Reproduction|Movement|Growth", "Living things respond to changes around them called…|Stimuli|Habitats|Fossils|Minerals", "Producing young ones of the same kind is…|Reproduction|Respiration|Nutrition|Excretion", "Which is non-living?|A stone|A mushroom|A tree|An earthworm", "A life cycle shows how an organism…|Grows and reproduces over time|Eats only|Breathes only|Moves only"]),
    treas6: B(["Which is a renewable resource?|Sunlight|Coal|Petroleum|Natural gas", "Coal and petroleum are…|Fossil fuels|Renewable sources|Made from rocks only|Made in factories", "Air is a mixture mainly of…|Nitrogen and oxygen|Only oxygen|Only carbon dioxide|Hydrogen and helium", "Soil is formed by the breaking down of…|Rocks|Plastic|Glass|Metals", "Forests help by…|Preventing soil erosion|Increasing floods|Reducing rainfall|Making air dirtier", "Turning off taps and lights helps to…|Conserve resources|Waste energy|Increase pollution|Cut down trees", "Which is an exhaustible natural resource?|Minerals|Sunlight|Wind|Air"]),
    earth6: B(["The Sun is a…|Star|Planet|Moon|Comet", "The planet closest to the Sun is…|Mercury|Venus|Earth|Mars", "A group of stars forming a pattern is a…|Constellation|Galaxy|Planet|Satellite", "The Moon is Earth's natural…|Satellite|Star|Planet|Asteroid", "The Pole Star helps us find the direction…|North|South|East|West", "Saptarishi is the Indian name for the…|Big Dipper (Ursa Major)|Orion|Milky Way|Pole Star", "The largest planet is…|Jupiter|Saturn|Earth|Neptune"]),

    sci7: B(["Science is called 'ever-evolving' because…|New evidence can change our ideas|It never changes|It is only about the past|Scientists never disagree", "A test where only one factor is changed is a…|Controlled experiment|Lucky guess|Survey of opinions|Story", "The factor you deliberately change in an experiment is the…|Independent variable|Dependent variable|Constant|Result", "Sharing results so others can check them is called…|Peer review|Copying|Hiding data|Guessing", "Which is a scientific attitude?|Curiosity with evidence|Believing rumours|Ignoring data|Refusing to test ideas", "Measurements are more reliable when they are…|Repeated and averaged|Taken once|Rounded randomly|Guessed"]),
    circ7: B(["The symbol of an electric cell has…|A long line and a short line|A circle with a cross|A zig-zag line|A single dot", "In a cell, the longer line stands for the…|Positive terminal|Negative terminal|Switch|Bulb", "A material that does not let current flow is an…|Insulator|Conductor|Electrode|Ammeter", "A closed switch makes the circuit…|Complete|Open|Broken|Shorter", "Two or more cells joined together make a…|Battery|Bulb|Fuse|Filament", "Which is a conductor?|Copper wire|Rubber band|Plastic scale|Dry wood", "LED bulbs work only when connected…|The right way round|Upside down|Without a cell|In water"]),
    metal7: B(["Metals that can be beaten into thin sheets are…|Malleable|Brittle|Ductile only|Dull", "Metals that can be drawn into wires are…|Ductile|Brittle|Soluble|Malleable only", "Which non-metal is a liquid at room temperature?|Bromine|Mercury|Sulphur|Iodine", "Which metal is a liquid at room temperature?|Mercury|Iron|Gold|Copper", "Metals make a ringing sound; they are…|Sonorous|Dull|Transparent|Brittle", "Oxides of metals are generally…|Basic|Acidic|Neutral|Sweet", "Rusting of iron needs…|Oxygen and moisture|Only sunlight|Only heat|Only salt"]),
    change7: B(["Melting of ice is a…|Physical change|Chemical change|Biological change|Nuclear change", "Burning of paper is a…|Chemical change|Physical change|Reversible change|Phase change", "A change in which a new substance forms is…|A chemical change|A physical change|Evaporation|Dissolving", "Baking soda + vinegar gives off…|Carbon dioxide|Oxygen|Hydrogen|Nitrogen", "Galvanisation coats iron with…|Zinc|Copper|Silver|Lead", "Large crystals of pure salts are got by…|Crystallisation|Burning|Melting|Sublimation", "Ripening of fruit is a…|Chemical change|Physical change|Reversible change|Change of state only"]),
    adol7: B(["Adolescence is roughly the age of…|10 to 19 years|1 to 5 years|25 to 35 years|50 to 60 years", "The onset of reproductive maturity is called…|Puberty|Infancy|Old age|Hibernation", "Hormones are released by…|Endocrine glands|Bones|Muscles|Hair", "A balanced diet in adolescence helps…|Healthy growth|Stop growth|Avoid sleep|Lose all fat", "The voice box (larynx) grows larger in…|Boys during puberty|Babies only|Adults only|Girls only", "Good personal hygiene includes…|Bathing regularly|Skipping meals|Sharing toothbrushes|Never washing hands", "Which helps mental well-being?|Talking to trusted adults|Hiding all feelings|Skipping sleep|Avoiding friends"]),
    time7: B(["Speed equals…|Distance ÷ Time|Distance × Time|Time ÷ Distance|Mass × Time", "The SI unit of time is the…|Second|Minute|Hour|Day", "A car covers 120 km in 2 hours. Its speed is…|60 km/h|240 km/h|120 km/h|30 km/h", "The time for one complete to-and-fro swing is the…|Time period|Speed|Amplitude|Distance", "A simple pendulum's time period depends on its…|Length|Colour|Bob's material only|Shape of the stand", "Motion with equal distance in equal time intervals is…|Uniform motion|Non-uniform motion|Circular motion|Random motion", "The instrument showing a vehicle's speed is the…|Speedometer|Odometer|Thermometer|Barometer"]),
    anim7: B(["Digestion of food begins in the…|Mouth|Stomach|Large intestine|Liver", "Most digestion and absorption happen in the…|Small intestine|Large intestine|Food pipe|Mouth", "The liver secretes…|Bile|Saliva|Insulin|Pepsin", "Finger-like projections in the small intestine are…|Villi|Alveoli|Nephrons|Stomata", "Fish breathe through…|Gills|Lungs|Skin only|Spiracles", "The heart pumps blood through…|Blood vessels|Nerves|Bones|Muscles only", "Kidneys mainly help in…|Excretion|Digestion|Breathing|Seeing"]),
    plant7: B(["The process by which plants make food is…|Photosynthesis|Respiration|Transpiration|Digestion", "The green pigment in leaves is…|Chlorophyll|Haemoglobin|Melanin|Carotene", "Tiny pores on leaves are called…|Stomata|Root hairs|Veins|Petals", "Water moves up from roots through the…|Xylem|Phloem|Stomata|Petals", "Food made in leaves travels through the…|Phloem|Xylem|Root hairs|Pollen", "Starch in a leaf is tested with…|Iodine solution|Lime water|Litmus paper|Salt water", "Plants also respire, taking in…|Oxygen|Only nitrogen|Only carbon monoxide|Helium"]),
    light7: B(["Light travels in…|Straight lines|Curves|Circles|Zig-zags", "A shadow forms when light is blocked by…|An opaque object|A transparent object|Clear air|A beam of light", "In a plane mirror, the image is…|Laterally inverted|Upside down|Larger|Smaller", "The angle of incidence equals the angle of…|Reflection|Refraction|Shadow|Dispersion", "A pinhole camera forms an image that is…|Inverted|Erect and larger|Not formed|A different colour", "A periscope works using…|Two plane mirrors|One lens|A prism only|A magnet", "Butter paper is…|Translucent|Transparent|Opaque|Luminous"]),
    esm7: B(["The Moon shines because it…|Reflects sunlight|Makes its own light|Is very hot|Burns gas", "A solar eclipse happens when the…|Moon comes between the Sun and the Earth|Earth comes between the Sun and the Moon|Sun goes behind the Earth|Moon leaves its orbit", "A lunar eclipse can happen only on a…|Full moon night|New moon day|Any afternoon|Half moon night", "Day and night are caused by Earth's…|Rotation|Revolution|Tilt only|Distance from the Moon", "The Moon takes about ___ to go through all its phases.|29.5 days|7 days|365 days|24 hours", "Seasons are caused by Earth's tilted axis and its…|Revolution around the Sun|Rotation alone|Moon's gravity|Distance from Mars", "Never look at a solar eclipse…|With bare eyes|Through solar filters|On a projected image|Through a pinhole viewer"]),

    inv8: B(["A guess that can be tested is a…|Hypothesis|Theory proven forever|Conclusion|Observation", "Variables kept the same in an experiment are…|Controlled variables|Independent variables|Dependent variables|Random variables", "What you measure as the outcome is the…|Dependent variable|Independent variable|Constant|Apparatus", "Results that others can repeat are…|Reproducible|Secret|Lucky|Invalid", "A graph helps to…|Show patterns in data|Hide errors|Replace measuring|Avoid units", "Science ideas change when…|New evidence appears|People vote|Books get old|A famous person says so"]),
    health8: B(["Diseases spread from person to person are…|Communicable|Non-communicable|Genetic only|Deficiency diseases", "Diabetes is an example of a…|Non-communicable disease|Communicable disease|Viral infection|Bacterial infection", "Vaccines help the body build…|Immunity|Fat|Bones|Hair", "Malaria is spread by the female…|Anopheles mosquito|Housefly|Cockroach|Ant", "Dengue is caused by a…|Virus|Bacterium|Fungus|Worm", "Washing hands with soap mainly helps to…|Remove germs|Grow taller|Improve eyesight|Build muscle", "Antibiotics work against…|Bacteria|Viruses|All diseases|Allergies"]),
    force8b: B(["A push or a pull is a…|Force|Mass|Speed|Energy", "SI unit of force is the…|Newton|Pascal|Joule|Watt", "Friction always acts…|Opposite to motion|Along the motion|Upwards|Nowhere", "The force between two magnets is a…|Non-contact force|Muscular force|Frictional force|Contact force", "Weight is the force of…|Gravity on an object|Friction|Magnetism|Air pressure", "Ball bearings reduce friction by…|Changing sliding to rolling|Increasing area|Adding weight|Heating parts", "Lubricants such as oil…|Reduce friction|Increase friction|Increase weight|Stop motion"]),
    press8: B(["Pressure equals…|Force ÷ Area|Force × Area|Area ÷ Force|Mass × Area", "SI unit of pressure is the…|Pascal|Newton|Joule|Watt", "Wind blows from…|High pressure to low pressure|Low pressure to high pressure|Cold land to the Moon|Nowhere", "Air pressure decreases as height…|Increases|Decreases|Stays fixed|Becomes zero", "Warm air…|Rises|Sinks|Stays still|Becomes heavier", "A cyclone has a calm centre called the…|Eye|Tail|Core wall|Funnel", "Wide straps on a school bag…|Reduce pressure on shoulders|Increase pressure|Increase the weight|Reduce the mass"]),
    part8: B(["Matter is made of tiny…|Particles|Waves only|Colours|Sounds", "Particles are most tightly packed in a…|Solid|Liquid|Gas|Vacuum", "Spreading of a smell through a room is…|Diffusion|Condensation|Freezing|Sublimation", "Diffusion is fastest in…|Gases|Solids|Liquids|Ice", "Heating makes particles move…|Faster|Slower|Not at all|Backwards", "Gases can be compressed because their particles have…|Large spaces between them|No motion|Strong attraction|Fixed positions", "A solid has a fixed…|Shape and volume|Shape only|Volume only|Neither"]),
    elem8: B(["A substance made of only one kind of atom is an…|Element|Compound|Mixture|Solution", "Water (H₂O) is a…|Compound|Element|Mixture|Alloy", "Air is a…|Mixture|Compound|Element|Pure substance", "The symbol for sodium is…|Na|S|So|Sd", "The symbol for iron is…|Fe|Ir|I|F", "Components of a mixture can be separated by…|Physical methods|Only chemical reactions|Nothing|Burning only", "Which is an element?|Oxygen|Salt|Sugar|Air"]),
    sol8: B(["In salt water, salt is the…|Solute|Solvent|Solution|Suspension", "Water is called the…|Universal solvent|Universal solute|Universal mixture|Universal element", "A solution that can dissolve no more solute is…|Saturated|Unsaturated|Dilute|Pure", "Solubility of sugar in water ___ with temperature.|Increases|Decreases|Never changes|Becomes zero", "Concentration tells us…|How much solute is in the solution|The colour|Only the temperature|The container size", "Sand in water is…|Insoluble|Soluble|A solvent|A solution", "Soda water is a solution of a ___ in a liquid.|Gas|Solid|Metal|Rock"]),
    light8: B(["Vehicle rear-view mirrors are…|Convex|Concave|Plane|Cylindrical", "Dentists and torches use a…|Concave mirror|Convex mirror|Plane mirror|Prism", "A convex lens is also called a…|Converging lens|Diverging lens|Plane lens|Flat lens", "A magnifying glass is a…|Convex lens|Concave lens|Plane mirror|Prism", "A concave lens…|Spreads light rays out|Brings rays to a focus|Reflects all light|Blocks light", "In a plane mirror, the image is as far behind as the object is…|In front|Twice in front|Half in front|Above", "Light bending as it passes from air into water is…|Refraction|Reflection|Dispersion|Absorption"]),
    sky8: B(["One full rotation of the Earth takes about…|24 hours|365 days|30 days|1 hour", "One revolution of the Earth around the Sun takes about…|365¼ days|24 hours|29.5 days|100 days", "A calendar based on the Moon's phases is a…|Lunar calendar|Solar calendar|Star calendar|Tidal calendar", "The extra day added every 4 years is in a…|Leap year|Lunar month|Solar eclipse|Long week", "Ancient Indians tracked time using…|Positions of the Sun, Moon and stars|Mobile phones|Electric clocks|Radio signals", "A sundial tells the time using a…|Shadow|Pendulum|Spring|Battery", "Time zones exist because…|Earth rotates|Earth is flat|The Moon moves|Clocks differ"]),
    harm8: B(["Green plants in a food chain are…|Producers|Consumers|Decomposers|Predators", "Organisms that break down dead matter are…|Decomposers|Producers|Herbivores|Carnivores", "In grass → deer → tiger, the deer is a…|Herbivore|Producer|Decomposer|Carnivore", "Many interlinked food chains make a…|Food web|Habitat|Population|Biome", "Bees help flowers by…|Pollination|Decomposition|Photosynthesis|Excretion", "Removing top predators from a forest usually…|Upsets the balance|Has no effect|Makes plants vanish|Stops rainfall", "Energy in a food chain flows from…|The Sun to producers to consumers|Consumers to the Sun|Decomposers to the Sun|Nowhere"]),
    home8: B(["Earth is the only known planet with…|Liquid water and life|Rings|Moons|Craters", "The layer of gases around Earth is the…|Atmosphere|Crust|Mantle|Core", "The ozone layer protects us from…|Ultraviolet rays|Rain|Wind|Sound", "About ___ of Earth's surface is covered by water.|71%|30%|50%|90%", "The greenhouse effect keeps Earth…|Warm enough for life|Frozen|Dark|Without air", "Burning fossil fuels increases…|Carbon dioxide in the air|Ozone|Fresh water|Forest cover", "Earth's distance from the Sun makes it…|Neither too hot nor too cold|Too hot for water|Too cold for air|Airless"]),

    exp9: B(["The SI unit of mass is the…|Kilogram|Gram|Newton|Pound", "The SI unit of length is the…|Metre|Kilometre|Inch|Mile", "1 millimetre equals…|0.001 m|0.01 m|0.1 m|10 m", "A vernier caliper is used to measure…|Small lengths precisely|Mass|Temperature|Time", "The least count of an ordinary metre scale is…|1 mm|1 cm|1 m|0.1 mm", "A measurement always needs a number and a…|Unit|Colour|Sign|Name", "Repeating readings and averaging them reduces…|Random errors|The unit|The size|Accuracy"]),
    tissue9: B(["A group of similar cells doing one job is a…|Tissue|Organ|System|Organism", "Growth in plant length happens at the…|Meristematic tissue|Cork|Xylem only|Epidermis", "Blood is a…|Connective tissue|Muscular tissue|Nervous tissue|Epithelial tissue", "Neurons make up…|Nervous tissue|Muscle tissue|Bone|Cartilage", "Muscles of the heart are…|Cardiac muscles|Skeletal muscles|Smooth only|Voluntary", "Food is carried in plants by the…|Phloem|Xylem|Cork|Parenchyma only", "Tendons connect…|Muscle to bone|Bone to bone|Nerve to muscle|Skin to bone"]),
    mix9: B(["Salt and water form a…|Homogeneous mixture (solution)|Heterogeneous mixture|Compound|Element", "Sand and iron filings are separated with a…|Magnet|Filter paper only|Funnel|Burner", "Inks of different colours are separated by…|Chromatography|Sieving|Magnetism|Winnowing", "Alcohol and water are separated by…|Fractional distillation|Filtration|Magnetism|Decantation", "Cream is separated from milk by…|Centrifugation|Sublimation|Magnetism|Chromatography", "Ammonium chloride is separated from salt by…|Sublimation|Filtration|Decantation|Distillation", "Oil and water are separated with a…|Separating funnel|Magnet|Sieve|Centrifuge only"]),
    work9: B(["Work = …|Force × displacement|Force ÷ distance|Mass × speed|Power × force", "SI unit of work and energy is the…|Joule|Watt|Newton|Pascal", "Kinetic energy equals…|½mv²|mgh|mv|ma", "Potential energy at height h equals…|mgh|½mv²|mv|F/A", "Power is the rate of doing…|Work|Pushing only|Moving only|Heating only", "1 kW equals…|1000 W|100 W|10 W|1 W", "A lever with the fulcrum between effort and load is a…|First-class lever|Second-class lever|Third-class lever|Pulley"]),
    atom9: B(["The electron was discovered by…|J.J. Thomson|Ernest Rutherford|James Chadwick|Niels Bohr", "Rutherford's gold foil experiment showed that an atom has a…|Small, dense nucleus|Uniform pudding|No empty space|Negative nucleus", "The neutron was discovered by…|James Chadwick|J.J. Thomson|John Dalton|Rutherford", "Atomic number equals the number of…|Protons|Neutrons|Nucleons|Molecules", "Mass number equals…|Protons + neutrons|Protons only|Electrons only|Protons − electrons", "Isotopes have the same number of protons but different numbers of…|Neutrons|Electrons|Protons|Shells always", "The maximum electrons in the first shell (K) is…|2|8|18|1"]),
    afm9: B(["The smallest particle of an element is an…|Atom|Molecule|Ion|Cell", "A molecule of oxygen is written as…|O₂|O|O₃ only|2O", "One mole contains about ___ particles.|6.022 × 10²³|3 × 10⁸|1000|6.67 × 10⁻¹¹", "Molecular mass of water (H = 1, O = 16) is…|18 u|16 u|17 u|20 u", "The law of conservation of mass says mass is…|Neither created nor destroyed in a reaction|Always lost|Always gained|Doubled", "The valency of oxygen is usually…|2|1|3|4", "Chemical formula of sodium chloride:|NaCl|NaCl₂|Na₂Cl|SoCl"]),
    sound9: B(["Sound cannot travel through…|Vacuum|Water|Air|Steel", "Sound is a…|Longitudinal wave|Transverse wave only|Light wave|Electromagnetic wave", "The unit of frequency is the…|Hertz|Decibel|Metre|Newton", "Humans hear roughly…|20 Hz to 20,000 Hz|2 Hz to 200 Hz|20,000 Hz to 50,000 Hz|1 Hz to 10 Hz", "The reflection of sound heard again is an…|Echo|Pitch|Tone|Beat", "Bats and SONAR use…|Ultrasound|Infrasound|Light|X-rays", "Pitch of a sound depends on its…|Frequency|Amplitude|Speed only|Colour"]),
    repro9: B(["Reproduction with only one parent is…|Asexual reproduction|Sexual reproduction|Pollination|Fertilisation", "Yeast commonly reproduces by…|Budding|Seeds|Spores only|Pollination", "Amoeba reproduces by…|Binary fission|Budding|Seeds|Grafting", "Fusion of male and female gametes is…|Fertilisation|Germination|Pollination|Budding", "Transfer of pollen from anther to stigma is…|Pollination|Fertilisation|Germination|Transpiration", "Potato plants can grow from the…|Eyes (buds) on the tuber|Leaves only|Flowers only|Roots only", "Variation among offspring mainly comes from…|Sexual reproduction|Budding|Fission|Cloning"]),
    class9: B(["The basic unit of classification is the…|Species|Kingdom|Phylum|Class", "Scientific names have two parts; this is…|Binomial nomenclature|Trinomial naming|Common naming|Folk naming", "The scientific name of humans is…|Homo sapiens|Felis catus|Panthera tigris|Rana tigrina", "Organisms without a true nucleus are…|Prokaryotes|Eukaryotes|Mammals|Plants", "Animals with a backbone are…|Vertebrates|Invertebrates|Arthropods|Molluscs", "Mushrooms belong to the kingdom…|Fungi|Plantae|Animalia|Monera", "Insects have how many legs?|6|8|4|10"]),
    sys9: B(["Earth's four spheres are lithosphere, hydrosphere, atmosphere and…|Biosphere|Stratosphere|Ionosphere|Mesosphere", "The water cycle is driven mainly by…|The Sun|The Moon|Earth's core|Wind turbines", "Carbon moves from air into plants by…|Photosynthesis|Respiration|Burning|Decay", "Nitrogen in soil is fixed by…|Bacteria|Sand|Rocks|Fish", "The main source of energy for Earth's living things is…|Sunlight|Volcanoes|Moonlight|Tides", "Burning fossil fuels returns carbon to the…|Atmosphere|Core|Ocean floor only|Ozone layer", "Matter in an ecosystem is…|Recycled|Lost forever|Created daily|Only in animals"]),

    metal10: B(["The most reactive metal among these is…|Potassium|Iron|Copper|Gold", "Metals react with acids to give…|Hydrogen gas|Oxygen gas|Nitrogen|Chlorine", "An alloy of copper and zinc is…|Brass|Bronze|Steel|Solder", "Aluminium is extracted by…|Electrolysis|Roasting only|Heating with carbon|Sieving", "Ionic compounds have…|High melting points|Very low melting points|No charges|No crystals", "Metals found free in nature, like gold, are…|Least reactive|Most reactive|Liquids|Non-metals", "Anodising forms a protective layer of ___ on aluminium.|Oxide|Paint|Zinc|Rust"]),
    carbon10: B(["Carbon forms bonds by…|Sharing electrons (covalent)|Losing 4 electrons|Gaining 4 electrons|Ionic bonds only", "The property of carbon to link with other carbon atoms is…|Catenation|Tetravalency only|Oxidation|Isomerism", "The general formula of alkanes is…|CₙH₂ₙ₊₂|CₙH₂ₙ|CₙH₂ₙ₋₂|CₙHₙ", "Ethanol is…|C₂H₅OH|CH₃COOH|CH₄|C₂H₄", "Ethanoic acid is commonly known as…|Vinegar (acetic acid)|Alcohol|Soap|Methane", "Soaps clean by forming…|Micelles|Crystals|Bubbles only|Salts", "Hard water does not lather well with soap because it contains…|Calcium and magnesium salts|Sugar|Oxygen|Sodium chloride only"]),
    ctrl10: B(["The basic unit of the nervous system is the…|Neuron|Nephron|Alveolus|Villus", "A quick automatic response is a…|Reflex action|Voluntary action|Hormone|Tropism", "Insulin is secreted by the…|Pancreas|Thyroid|Pituitary|Adrenal", "Iodine is needed to make…|Thyroxine|Insulin|Adrenaline|Auxin", "Plant shoots bending towards light show…|Phototropism|Geotropism|Hydrotropism|Chemotropism", "The hormone that promotes cell elongation in plants is…|Auxin|Abscisic acid|Insulin|Thyroxine", "The 'master gland' is the…|Pituitary|Pancreas|Liver|Thymus"]),
    repro10: B(["DNA copying during reproduction leads to…|Variation|No change at all|Death|Digestion", "Planaria regenerates from…|Body pieces|Seeds|Spores|Buds only", "Rhizopus (bread mould) reproduces by…|Spores|Budding|Fission|Seeds", "The male reproductive part of a flower is the…|Stamen|Pistil|Sepal|Ovule", "After fertilisation, the ovary develops into the…|Fruit|Seed|Flower|Leaf", "Ovules after fertilisation become…|Seeds|Fruits|Petals|Pollen", "Testes produce sperm and the hormone…|Testosterone|Oestrogen|Insulin|Thyroxine"]),
    hered10: B(["The father of genetics is…|Gregor Mendel|Charles Darwin|Robert Hooke|Watson", "Mendel worked with…|Garden peas|Fruit flies|Mice|Wheat", "Tall × dwarf F2 ratio for height is…|3 : 1|1 : 1|9 : 3 : 3 : 1|2 : 1", "Sex of a child is decided by the chromosome from the…|Father|Mother|Grandmother|Environment", "Human females have the sex chromosomes…|XX|XY|YY|X only", "A trait that shows in the F1 generation is…|Dominant|Recessive|Lost|Mutated", "Genes are segments of…|DNA|Protein|Fat|Starch"]),
    eye10: B(["The ability of the eye to change focal length is…|Accommodation|Refraction|Dispersion|Scattering", "Near-sightedness (myopia) is corrected with a…|Concave lens|Convex lens|Plane glass|Prism", "Long-sightedness (hypermetropia) is corrected with a…|Convex lens|Concave lens|Cylindrical mirror|Prism", "Splitting of white light into colours is…|Dispersion|Reflection|Accommodation|Diffusion", "The sky looks blue because of…|Scattering of light|Reflection by oceans|Dispersion in clouds|Pollution", "Twinkling of stars is due to…|Atmospheric refraction|Reflection|Scattering only|Stars switching on and off", "The least distance of distinct vision for a normal eye is about…|25 cm|2.5 cm|1 m|10 cm"]),
    mag10: B(["Magnetic field lines go from…|North to south outside a magnet|South to north outside a magnet|Centre outward only|Nowhere", "The direction of the field around a straight current-carrying wire is given by the…|Right-hand thumb rule|Left-hand rule|Ohm's law|Snell's law", "Fleming's left-hand rule gives the direction of…|Force on a conductor|Induced current|Magnetic poles|Voltage", "Electromagnetic induction was discovered by…|Michael Faraday|Ohm|Newton|Edison", "An electric motor converts…|Electrical energy to mechanical energy|Mechanical to electrical|Heat to light|Sound to electricity", "The earth wire in household circuits is usually…|Green|Red|Black|Blue", "A fuse protects a circuit from…|Overloading and short circuits|Low voltage|Magnetic fields|Earthing"]),
    env10: B(["Substances broken down by microbes are…|Biodegradable|Non-biodegradable|Plastic|Inert", "Polythene bags are…|Non-biodegradable|Biodegradable|Edible|Renewable", "The ozone layer is being damaged by…|CFCs|Oxygen|Nitrogen|Water vapour", "In a food chain, only about ___ of energy passes to the next level.|10%|50%|90%|1%", "Harmful chemicals building up along a food chain is…|Biological magnification|Photosynthesis|Decomposition|Evaporation", "Ozone is a molecule of…|Three oxygen atoms|Two oxygen atoms|Carbon and oxygen|Nitrogen", "Producers in an ecosystem are…|Green plants|Lions|Fungi|Humans"]),
  });

  // ---------- English banks: Poorvi units (6–8), Kaveri (9), First Flight and Footprints (10) ----------
  const toRows = (list, ask) => list.map(([w, m]) => [ask(w), m, ...R.shuffle(list.filter((p) => p[1] !== m)).slice(0, 3).map((p) => p[1])]);
  Object.assign(BANK, {
    p6u1: B(["A short story with animals that teaches a lesson is a…|Fable|Biography|Diary|Report", "The lesson at the end of a fable is its…|Moral|Title|Chorus|Index", "In the fable 'The Raven and the Fox', the fox flatters the raven to get its…|Cheese|Nest|Feathers|Song book", "The fox praises the raven's voice. Praising someone to get something is…|Flattery|Honesty|Bravery|Patience", "In 'A Bottle of Dew', the real 'magic' turned out to be…|Hard work|A secret potion|Gold coins|A lucky charm", "Folk tales are usually…|Passed down by word of mouth|Written by scientists|News reports|Recipes"]),
    p6u2: B(["A friend in need is a friend…|Indeed|Indoor|Instead|In debt", "Which word is an antonym of 'friend'?|Enemy|Buddy|Pal|Companion", "Choose the synonym of 'loyal'.|Faithful|Selfish|Rude|Careless", "A poem written as a prayer for a friend expresses…|Good wishes|Anger|A recipe|Directions", "'The Unlikely Best Friends' are 'unlikely' because they are…|Very different from each other|Brothers|Twins|Neighbours who fight", "Which sentence shows kindness?|She shared her lunch with the new girl.|He laughed when she fell.|They ignored the new boy.|She broke his pencil."]),
    p6u3: B(["The neem tree is valued in India for its…|Medicinal uses|Sweet fruit|Bright flowers only|Hard metal", "Turmeric (haldi) has long been used because it…|Helps heal and fights germs|Is a sweetener|Makes food blue|Is a metal", "Choose the synonym of 'nurture'.|Care for|Destroy|Forget|Ignore", "A word for 'having to do with nature and the environment' is…|Ecological|Electrical|Musical|Political", "Spices like ginger, cinnamon and pepper come from…|Plants|Rocks|Animals only|Factories only", "Planting trees helps to…|Keep the air clean|Increase pollution|Dry up rivers|Raise noise"]),
    p6u4: B(["International Day of Yoga is observed on…|21 June|15 August|2 October|14 November", "'Yoga' comes from a Sanskrit word meaning to…|Join or unite|Run fast|Sleep|Shout", "A person who loses but still congratulates the winner shows…|Sportsmanship|Greed|Laziness|Rudeness", "Choose the opposite of 'victory'.|Defeat|Win|Triumph|Success", "Wellness means…|Being in good health|Being unwell|Winning prizes|Feeling bored", "Pick the adjective: 'The tired runner finished the race.'|tired|runner|finished|race"]),
    p6u5: B(["The National War Memorial is in…|New Delhi|Mumbai|Chennai|Kolkata", "The National War Memorial honours…|Soldiers who gave their lives for India|Film stars|Cricket players|Kings of old", "Ila Sachani is known for doing embroidery with her…|Feet|Teeth|Elbows|Left hand only", "Kites are especially flown in many parts of India during…|Makar Sankranti|Diwali|Christmas|Holi only", "'Incredible India' celebrates India's…|Diversity of culture|Only one language|Single festival|Cold weather", "Choose the correct spelling.|Tradition|Tradetion|Tredition|Tradision"]),

    p7u1: B(["'Three Days To See' was written by…|Helen Keller|Ruskin Bond|R.K. Narayan|Sudha Murty", "Helen Keller could neither…|See nor hear|Read nor write|Walk nor run|Eat nor sleep", "The poem 'Try Again' teaches us to…|Keep trying after failing|Give up quickly|Blame others|Avoid work", "'If at first you don't succeed, try, try again' means…|Persevere|Stop|Rest|Celebrate", "Choose the synonym of 'perseverance'.|Persistence|Laziness|Fear|Anger", "We should value our senses because…|Many people live without them|They are useless|They never matter|They can be bought"]),
    p7u2: B(["Doctor Dolittle could talk to…|Animals|Machines|Ghosts|Stars", "Doctor Dolittle was written by…|Hugh Lofting|Lewis Carroll|Roald Dahl|Mark Twain", "In the story, Dr. Dolittle learns animal language from his parrot…|Polynesia|Kitty|Jip|Gub-Gub", "Humour in writing is meant to make readers…|Laugh|Cry|Sleep|Panic", "A play on words for a joke is a…|Pun|Simile|Rhyme|Stanza", "Choose the correct sentence.|He doesn't know the answer.|He don't know the answer.|He not know the answer.|He doesn't knows the answer."]),
    p7u3: B(["'Paper Boats' was written by…|Rabindranath Tagore|William Wordsworth|Robert Frost|Sarojini Naidu", "In 'Paper Boats', the child floats boats down a…|Stream|Sea storm|Swimming pool|Bathtub", "Choose the synonym of 'invention'.|Creation|Destruction|Mistake|Copy", "North, South, East and West are…|Directions|Seasons|Colours|Planets", "A person who invents things is an…|Inventor|Investor|Invader|Inspector", "A dream that guides your future is an…|Aim|Accident|Error|Ending"]),
    p7u4: B(["'The Tunnel' was written by…|Ruskin Bond|Rudyard Kipling|Premchand|Anita Desai", "The highest mountain in the world is…|Mount Everest|K2|Kangchenjunga|Nanda Devi", "Reaching the top of a mountain is called reaching the…|Summit|Valley|Base|Plain", "Choose the synonym of 'journey'.|Trip|Rest|Home|Stop", "A person who climbs mountains is a…|Mountaineer|Sailor|Pilot|Diver", "Pick the preposition: 'The train went through the tunnel.'|through|train|went|tunnel"]),
    p7u5: B(["Rani Abbakka of Ullal fought against the…|Portuguese|British|Mughals|French", "A homage is a…|Show of respect|Joke|Complaint|Recipe", "Choose the synonym of 'brave'.|Courageous|Timid|Weak|Lazy", "Soldiers who guard our borders protect our…|Country|Shops only|Games|Books", "Choose the opposite of 'cowardly'.|Brave|Fearful|Weak|Nervous", "'My Dear Soldiers' expresses…|Gratitude to soldiers|Anger at soldiers|A recipe|A weather report"]),

    p8u1: B(["Wit means…|Quick, clever humour|Sadness|Strength|Wealth", "Wisdom comes from…|Knowledge and experience|Luck only|Money|Shouting", "Choose the synonym of 'clever'.|Smart|Dull|Slow|Rude", "A clever reply that wins people over shows…|Wit|Rudeness|Fear|Greed", "Choose the correct passive: 'The king praised the minister.'|The minister was praised by the king.|The minister is praised by the king.|The king was praised by the minister.|The minister praised by the king.", "Pick the abstract noun.|Wisdom|King|Palace|Minister"]),
    p8u2: B(["Major Somnath Sharma was the first recipient of the…|Param Vir Chakra|Bharat Ratna|Ashok Chakra|Padma Shri", "The Battle of Badgam took place in…|Jammu and Kashmir|Rajasthan|Assam|Gujarat", "Verghese Kurien is called the Father of the…|White Revolution|Green Revolution|Blue Revolution|Space Programme", "Kurien helped build the dairy brand…|Amul|Tata|Infosys|Bata", "In 'Somebody's Mother', a boy helps an old woman to…|Cross a snowy street|Sell vegetables|Find her purse|Climb a hill", "Choose the synonym of 'valour'.|Bravery|Fear|Speed|Wealth"]),
    p8u3: B(["A story where a detective solves a puzzle is a…|Mystery|Fable|Biography|Lullaby", "Choose the synonym of 'magic'.|Enchantment|Science|Logic|Boredom", "A clue is…|A hint that helps solve a problem|A wrong answer|A type of glue|A reward", "Pick the adverb: 'The detective searched carefully.'|carefully|detective|searched|the", "'Spectacular' means…|Very impressive|Ordinary|Tiny|Boring", "Choose the correct form: 'If I ___ a magic brush, I would paint a river.'|had|have|has|having"]),
    p8u4: B(["'The Cherry Tree' was written by…|Ruskin Bond|Rabindranath Tagore|Robert Frost|Sudha Murty", "In 'The Cherry Tree', Rakesh grows a cherry tree from a…|Seed|Branch from a shop|Gift box|Picture", "A harvest hymn is a song of…|Thanks for crops|War|Sadness|Travel", "Choose the synonym of 'harvest'.|Crop|Storm|Drought|Flood", "Waiting for rain matters most to…|Farmers|Pilots|Bankers|Drivers", "Pick the verb: 'The farmers sowed the seeds.'|sowed|farmers|seeds|the"]),
    p8u5: B(["'Feathered Friend' was written by…|Arthur C. Clarke|H.G. Wells|Isaac Asimov|Jules Verne", "In 'Feathered Friend', the canary Claribel warns the space station crew about…|Low oxygen|A meteor|A fire|Aliens", "Bibha Chowdhuri was a pioneering Indian…|Physicist|Poet|Painter|Athlete", "A star has been named 'Bibha' in honour of…|Bibha Chowdhuri|A film|A river|A queen", "A magnifying glass makes things look…|Bigger|Smaller|Darker|Colourless", "Choose the synonym of 'curiosity'.|Inquisitiveness|Boredom|Laziness|Fear"]),

    kav9: B(["'How I Taught My Grandmother to Read' was written by…|Sudha Murty|R.K. Narayan|Ruskin Bond|Anita Desai", "The grandmother wanted to read the novel…|Kashi Yatre|Malgudi Days|Gitanjali|Godan", "The grandmother learned to read when she was about…|62|12|30|90", "The story shows that it is never too late to…|Learn|Travel|Sleep|Complain", "'Kaveri' is also the name of a river flowing through…|Karnataka and Tamil Nadu|Punjab and Haryana|Assam|Gujarat", "Choose the synonym of 'determination'.|Resolve|Doubt|Weakness|Laziness"]),

    ff10p: B(["In 'A Letter to God', Lencho asked God for…|100 pesos|1000 pesos|70 pesos|50 pesos", "'Long Walk to Freedom' is the autobiography of…|Nelson Mandela|Mahatma Gandhi|Martin Luther King Jr.|Barack Obama", "In 'His First Flight', the young bird is a…|Seagull|Eagle|Sparrow|Parrot", "Anne Frank named her diary…|Kitty|Margot|Peter|Miep", "In Goa, the traditional baker is called a…|Pader|Paowala|Khansama|Halwai", "Who claimed to have a hundred dresses?|Wanda Petronski|Peggy|Maddie|Miss Mason", "'Madam Rides the Bus' is about a girl named…|Valli|Wanda|Anne|Maddie", "Ustad Bismillah Khan played the…|Shehnai|Sitar|Tabla|Flute"]),
    ff10v: B(["'Dust of Snow' was written by…|Robert Frost|Robin Klein|Leslie Norris|Carolyn Wells", "In 'Dust of Snow', the snow was shaken down by a…|Crow|Sparrow|Squirrel|Child", "'Fire and Ice' was written by…|Robert Frost|John Berryman|Walt Whitman|Adrienne Rich", "In 'Fire and Ice', fire stands for…|Desire|Hatred|Peace|Snow", "'A Tiger in the Zoo' was written by…|Leslie Norris|Robert Frost|Ogden Nash|W.B. Yeats", "'The Tale of Custard the Dragon' was written by…|Ogden Nash|Leslie Norris|Robin Klein|Carolyn Wells", "In 'Amanda!', Amanda imagines being a…|Mermaid|Queen|Pilot|Teacher"]),
    fp10: B(["'Footprints without Feet' is about an invisible man named…|Griffin|Bholi|Matilda|Ausable", "Griffin was a…|Scientist|Postman|Farmer|Teacher", "In 'The Thief's Story', the thief's name is…|Hari Singh|Anil|Bholi|Herbert", "In 'The Necklace', Matilda borrowed a necklace from…|Mme Forestier|Her mother|A jeweller|Mme Loisel", "Bholi's real name was…|Sulekha|Radha|Valli|Mangala", "In 'A Triumph of Surgery', Tricki is a…|Dog|Cat|Horse|Parrot", "In 'The Midnight Visitor', Ausable is a…|Secret agent|Doctor|Thief|Teacher"]),
  });
  const SPELLROWS = SPELL.map(([a, ...w]) => ["Which spelling is correct?", a, ...w]);
  const IDIOMROWS = toRows(IDIOM, (w) => `What does '${w}' mean?`);
  const SYNROWS = toRows(SYN, (w) => `Choose the synonym of '${w}'`);
  const ANTROWS = toRows(ANT, (w) => `Choose the opposite of '${w}'`);

  // ---------- Skills: one per NCERT chapter (or unit), in textbook order ----------
  const S = [];
  const BOOKS = {};
  const add = (s, g, id, n, src, extra = {}) => S.push({ id, s, g, n, ...extra, ...(typeof src === "function" ? { gen: src } : { bank: src }) });
  // A textbook: chapters are numbered in the order given.
  function book(s, g, name, chapters, label = "Ch") {
    BOOKS[`${s}-${g}`] = (BOOKS[`${s}-${g}`] || []).concat(name);
    chapters.forEach(([id, n, src], i) => add(s, g, id, n, src, { book: name, ch: `${label} ${i + 1}` }));
  }
  const mix = (...banks) => banks.flat();

  // Maths
  book("math", 6, "Ganita Prakash", [
    ["m6-pat", "Patterns in Mathematics", G.pat6], ["m6-ang", "Lines and Angles", G.ang6], ["m6-play", "Number Play", G.play6],
    ["m6-data", "Data Handling and Presentation", G.data6], ["m6-hcf", "Prime Time", G.prime6], ["m6-mens", "Perimeter and Area", G.mens6],
    ["m6-frac", "Fractions", G.frac6],
    ["m6-cons", "Playing with Constructions", B(["A compass is used to draw…|Circles and arcs|Straight lines only|Angles only|Graphs", "The diameter of a circle is ___ the radius.|Twice|Half|Equal to|Three times", "All points on a circle are at the same distance from the…|Centre|Edge|Chord|Diameter's end", "The diagonals of a rectangle are…|Equal|Unequal|Perpendicular always|Parallel", "Every angle of a square is…|90°|60°|45°|120°", "A square has ___ equal sides.|4|2|3|0", "To draw a circle of radius 4 cm, open the compass to…|4 cm|8 cm|2 cm|16 cm"])],
    ["m6-sym", "Symmetry", B(["Lines of symmetry of a square:|4|2|1|0", "Lines of symmetry of a rectangle (not a square):|2|4|1|0", "Lines of symmetry of an equilateral triangle:|3|1|2|0", "Lines of symmetry of a circle:|Infinitely many|1|2|4", "Lines of symmetry of a regular hexagon:|6|3|4|2", "Lines of symmetry of the letter H:|2|1|0|4", "A square looks the same after a rotation of…|90°|45°|30°|60°"])],
    ["m6-int", "The Other Side of Zero", G.int6],
  ]);
  book("math", 7, "Ganita Prakash", [
    ["m7-large", "Large Numbers Around Us", G.large7], ["m7-arith", "Arithmetic Expressions", G.arith7], ["m7-dec", "A Peek Beyond the Point", G.dec6],
    ["m7-exp", "Expressions Using Letter-Numbers", G.letter7], ["m7-par", "Parallel and Intersecting Lines", G.par7], ["m7-play", "Number Play", G.play8],
    ["m7-tri", "A Tale of Three Intersecting Lines", G.tri7], ["m7-frac", "Working with Fractions", G.frac7],
  ]);
  book("math", 7, "Ganita Prakash Part 2", [
    ["m7-twin", "Geometric Twins", B(["Two figures with the same shape and size are…|Congruent|Similar only|Parallel|Opposite", "Which is NOT a congruence rule for triangles?|AAA|SSS|SAS|ASA", "In SAS, the angle must be…|Between the two sides|Opposite a side|Any angle|A right angle", "RHS congruence is for…|Right triangles|Equilateral triangles only|Any quadrilateral|Circles", "Angles opposite equal sides of a triangle are…|Equal|Supplementary|Complementary|Right angles", "Each angle of an equilateral triangle is…|60°|90°|45°|120°", "If ΔABC ≅ ΔPQR, then AB equals…|PQ|QR|PR|AC"])],
    ["m7-int", "Operations with Integers", G.int7], ["m7-common", "Finding Common Ground", G.hcfLcm], ["m7-dec2", "Another Peek Beyond the Point", G.dec7],
    ["m7-dots", "Connecting the Dots", G.data7],
    ["m7-tile", "Constructions and Tilings", B(["Which regular shape can tile a floor on its own?|Regular hexagon|Regular pentagon|Regular octagon|Circle", "Each interior angle of a regular hexagon is…|120°|108°|90°|135°", "Angles meeting at a point in a tiling add up to…|360°|180°|90°|270°", "How many squares meet at each corner of a square tiling?|4|3|6|5", "How many equilateral triangles meet at a point in a triangle tiling?|6|4|3|8", "A perpendicular bisector cuts a segment…|In half at 90°|At 45°|Into thirds|Without crossing it", "Each interior angle of a regular pentagon is…|108°|120°|90°|72°"])],
    ["m7-eq", "Finding the Unknown", G.eq7],
  ], "Ch");
  book("math", 8, "Ganita Prakash", [
    ["m8-sq", "A Square and A Cube", G.sqcube8], ["m8-exp", "Power Play", G.power8], ["m8-story", "A Story of Numbers", G.story8],
    ["m8-quad", "Quadrilaterals", G.quad8], ["m8-play", "Number Play", G.play8], ["m8-alg", "We Distribute, Yet Things Multiply", G.dist8],
    ["m8-prop", "Proportional Reasoning-1", G.prop8],
  ]);
  book("math", 8, "Ganita Prakash Part 2", [
    ["m8-cq", "Fractions in Disguise", G.pct8], ["m8-pyth", "The Baudhayana-Pythagoras Theorem", G.pyth8], ["m8-prop2", "Proportional Reasoning-2", G.prop8b],
    ["m8-geo", "Exploring Some Geometric Themes", B(["For any polyhedron, Euler's formula is…|F + V − E = 2|F + E − V = 2|F − V − E = 0|F + V + E = 12", "A cube has how many faces?|6|8|12|4", "A cube has how many edges?|12|8|6|10", "A shape made of smaller copies of itself is a…|Fractal|Prism|Polygon|Net", "The Sierpinski triangle (gasket) is made by repeatedly removing…|Middle triangles|Corners|Circles|Squares", "A flat pattern that folds into a solid is its…|Net|Shadow|Face|Edge", "A triangular prism has how many faces?|5|6|4|9"])],
    ["m8-dots", "Tales by Dots and Lines", G.dots8], ["m8-play2", "Algebra Play", G.algplay8], ["m8-area", "Area", G.area8],
  ]);
  book("math", 9, "Ganita Manjari", [
    ["m9-coord", "Orienting Yourself: The Use of Coordinates", () => (R.int(0, 1) ? G.coord9() : G.coord10())], ["m9-poly", "Introduction to Linear Polynomials", G.lpoly9],
    ["m9-ns", "The World of Numbers", G.ns9], ["m9-ident", "Exploring Algebraic Identities", G.ident9], ["m9-circ", "I'm Up and Down, and Round and Round", G.circle9],
    ["m9-meas", "Measuring Space: Perimeter and Area", G.meas9], ["m9-prob", "The Mathematics of Maybe: Introduction to Probability", G.prob9],
    ["m9-seq", "Predicting What Comes Next: Sequences and Progressions", G.seq9],
  ]);
  book("math", 9, "Ganita Manjari Part II", [
    ["m9-prop", "Propositions and their Converses", G.prop9], ["m9-stat", "How Quantities Combine: Understanding Data", G.stat9], ["m9-algo", "The World of Algorithms", G.algo9],
    ["m9-quad", "Quadrilaterals", G.quad9], ["m9-lin2", "Two Variables, One Line", G.lin2], ["m9-vol", "Math of Space: Surface Area and Volume", G.vol9],
  ]);
  book("math", 10, "Mathematics (NCERT)", [
    ["m10-real", "Real Numbers", G.real10], ["m10-poly", "Polynomials", G.poly9], ["m10-pair", "Pair of Linear Equations in Two Variables", G.pair10],
    ["m10-quad", "Quadratic Equations", G.quad10], ["m10-ap", "Arithmetic Progressions", G.ap10],
    ["m10-tri", "Triangles", B(["Two triangles are similar if their corresponding angles are…|Equal|Supplementary|Complementary|Right angles", "The Basic Proportionality Theorem is also called…|Thales' theorem|Pythagoras' theorem|Euclid's lemma|Heron's formula", "Similar triangles have corresponding sides in the same…|Ratio|Length always|Colour|Angle", "All equilateral triangles are…|Similar|Congruent|Right-angled|Scalene", "Which similarity criterion uses three pairs of sides?|SSS|AAA|SAS|RHS", "If DE ∥ BC in ΔABC, then AD/DB equals…|AE/EC|AB/AC|DE/BC|BC/DE", "All circles are…|Similar|Congruent|Equal in area|Equal in radius"])],
    ["m10-coord", "Coordinate Geometry", G.coord10], ["m10-trig", "Introduction to Trigonometry", G.trig10],
    ["m10-htrig", "Some Applications of Trigonometry", () => { const [ang, t] = R.pick([[45, 1], [30, null], [60, null]]); const d = 10 * R.int(1, 6); if (t) return num(`From ${d} m away, the angle of elevation to a tower's top is 45°. Height of the tower (m)?`, d, [d * 2, d / 2, d + 10]); return mc(`From ${d} m away the angle of elevation to a tower's top is ${ang}°. Height (m)?`, ang === 60 ? `${d}√3` : `${d}/√3`, [ang === 60 ? `${d}/√3` : `${d}√3`, String(d), `${d * 2}`]); }],
    ["m10-circ", "Circles", B(["A tangent to a circle touches it at…|Exactly one point|Two points|No point|Three points", "The tangent at a point is ___ to the radius there.|Perpendicular|Parallel|Equal|At 45°", "From an external point, how many tangents can be drawn to a circle?|2|1|0|Infinitely many", "Tangents from an external point to a circle are…|Equal in length|Unequal|Parallel|Perpendicular", "A line that cuts a circle at two points is a…|Secant|Tangent|Radius|Diameter", "How many tangents can a circle have?|Infinitely many|1|2|4"])],
    ["m10-arc", "Areas Related to Circles", () => { const k = R.int(1, 3), r = 7 * k, th = R.pick([90, 60, 180]); return num(`Area of a sector of angle ${th}° in a circle of radius ${r} cm (π = 22/7, cm²)?`, Math.round((154 * k * k * th) / 360 * 100) / 100, [154 * k * k, Math.round((44 * k * th) / 360 * 100) / 100, Math.round((154 * k * k * th) / 180 * 100) / 100]); }],
    ["m10-vol", "Surface Areas and Volumes", G.vol9], ["m10-stat", "Statistics", G.stat9], ["m10-prob", "Probability", G.prob10],
  ]);
  add("math", 11, "c-pct", "Percentages, Profit and Loss", G.pctC); add("math", 11, "c-tw", "Time and Work", G.twC); add("math", 11, "c-int", "Simple and Compound Interest", G.intC);
  add("math", 11, "c-log", "Logarithms", G.logC); add("math", 11, "c-der", "Derivatives", G.derC); add("math", 11, "c-series", "Number Series", G.seriesC); add("math", 11, "c-avg", "Averages", G.avgC);

  // Science
  book("sci", 6, "Curiosity", [
    ["s6-wonder", "The Wonderful World of Science", BANK.wonder6], ["s6-div", "Diversity in the Living World", BANK.div6], ["s6-food", "Mindful Eating: A Path to a Healthy Body", BANK.food6],
    ["s6-mag", "Exploring Magnets", BANK.mag6], ["s6-motion", "Measurement of Length and Motion", BANK.motion6], ["s6-mat", "Materials Around Us", BANK.mat6],
    ["s6-temp", "Temperature and its Measurement", BANK.temp6], ["s6-water", "A Journey through States of Water", BANK.water6], ["s6-sep", "Methods of Separation in Everyday Life", BANK.sep6],
    ["s6-living", "Living Creatures: Exploring their Characteristics", BANK.living6], ["s6-treas", "Nature's Treasures", BANK.treas6], ["s6-earth", "Beyond Earth", BANK.earth6],
  ]);
  book("sci", 7, "Curiosity", [
    ["s7-sci", "The Ever-Evolving World of Science", BANK.sci7], ["s7-acid", "Exploring Substances: Acidic, Basic, and Neutral", BANK.acid7], ["s7-curr", "Electricity: Circuits and their Components", BANK.circ7],
    ["s7-metal", "The World of Metals and Non-metals", BANK.metal7], ["s7-change", "Changes Around Us: Physical and Chemical", BANK.change7], ["s7-adol", "Adolescence: A Stage of Growth and Change", BANK.adol7],
    ["s7-heat", "Heat Transfer in Nature", BANK.heat7], ["s7-time", "Measurement of Time and Motion", BANK.time7], ["s7-resp", "Life Processes in Animals", BANK.anim7],
    ["s7-nutri", "Life Processes in Plants", BANK.plant7], ["s7-light", "Light: Shadows and Reflections", BANK.light7], ["s7-esm", "Earth, Moon, and the Sun", BANK.esm7],
  ]);
  book("sci", 8, "Curiosity", [
    ["s8-inv", "Exploring the Investigative World of Science", BANK.inv8], ["s8-micro", "The Invisible Living World: Beyond Our Naked Eye", BANK.micro8], ["s8-health", "Health: The Ultimate Treasure", BANK.health8],
    ["s8-curr", "Electricity: Magnetic and Heating Effects", BANK.curr7], ["s8-force", "Exploring Forces", BANK.force8b], ["s8-press", "Pressure, Winds, Storms, and Cyclones", BANK.press8],
    ["s8-part", "Particulate Nature of Matter", BANK.part8], ["s8-elem", "Nature of Matter: Elements, Compounds, and Mixtures", BANK.elem8], ["s8-sol", "The Amazing World of Solutes, Solvents, and Solutions", BANK.sol8],
    ["s8-light", "Light: Mirrors and Lenses", BANK.light8], ["s8-sky", "Keeping Time with the Skies", BANK.sky8], ["s8-harm", "How Nature Works in Harmony", BANK.harm8],
    ["s8-home", "Our Home: Earth, a Unique Life-Sustaining Planet", BANK.home8],
  ]);
  book("sci", 9, "Exploration", [
    ["s9-exp", "Exploring: Entering the World of Secondary Science", BANK.exp9], ["s9-cell", "Cell: The Building Block of Life", BANK.cell9], ["s9-tissue", "Tissues in Action", BANK.tissue9],
    ["s9-motion", "Describing Motion Around Us", BANK.mot9], ["s9-mix", "Exploring Mixtures and their Separation", BANK.mix9], ["s9-laws", "How Forces Affect Motion", BANK.laws9],
    ["s9-work", "Work, Energy and Simple Machines", BANK.work9], ["s9-atom", "Journey Inside the Atom", BANK.atom9], ["s9-matter", "Atomic Foundation of Matter", BANK.afm9],
    ["s9-sound", "Sound Waves: Characteristics and Applications", BANK.sound9], ["s9-repro", "Reproduction: How Life Continues", BANK.repro9], ["s9-class", "Patterns in Life: Diversity and Classification", BANK.class9],
    ["s9-earth", "Earth as a System: Energy, Matter, and Life", BANK.sys9],
  ]);
  book("sci", 10, "Science (NCERT)", [
    ["s10-chem", "Chemical Reactions and Equations", BANK.chem10], ["s10-acid", "Acids, Bases and Salts", BANK.acid10], ["s10-metal", "Metals and Non-metals", BANK.metal10],
    ["s10-carbon", "Carbon and its Compounds", BANK.carbon10], ["s10-life", "Life Processes", BANK.life10], ["s10-ctrl", "Control and Coordination", BANK.ctrl10],
    ["s10-repro", "How do Organisms Reproduce?", BANK.repro10], ["s10-hered", "Heredity", BANK.hered10], ["s10-light", "Light: Reflection and Refraction", BANK.ray10],
    ["s10-eye", "The Human Eye and the Colourful World", BANK.eye10], ["s10-elec", "Electricity", BANK.elec10], ["s10-mag", "Magnetic Effects of Electric Current", BANK.mag10],
    ["s10-env", "Our Environment", BANK.env10],
  ]);
  add("sci", 11, "c-phy", "Physics Fundamentals", BANK.phyC); add("sci", 11, "c-chem", "Chemistry Basics", BANK.chemC); add("sci", 11, "c-bio", "Biology and Health", BANK.bioC); add("sci", 11, "c-cs", "Computer Science Basics", BANK.csC);

  // English: Poorvi is organised by units; each unit mixes its theme with the grammar practised in it.
  book("eng", 6, "Poorvi", [
    ["e6-u1", "Fables and Folk Tales", mix(BANK.p6u1, BANK.art6)], ["e6-u2", "Friendship", mix(BANK.p6u2, BANK.noun6)], ["e6-u3", "Nurturing Nature", mix(BANK.p6u3, SYNROWS)],
    ["e6-u4", "Sports and Wellness", mix(BANK.p6u4, ANTROWS)], ["e6-u5", "Culture and Tradition", mix(BANK.p6u5, SPELLROWS.slice(0, 8))],
  ], "Unit");
  book("eng", 7, "Poorvi", [
    ["e7-u1", "Learning Together", mix(BANK.p7u1, BANK.tense7)], ["e7-u2", "Wit and Humour", mix(BANK.p7u2, BANK.adj7)], ["e7-u3", "Dreams and Discoveries", mix(BANK.p7u3, SPELLROWS.slice(7))],
    ["e7-u4", "Travel and Adventure", mix(BANK.p7u4, BANK.prep7)], ["e7-u5", "Brave Hearts", mix(BANK.p7u5, SYNROWS.slice(5))],
  ], "Unit");
  book("eng", 8, "Poorvi", [
    ["e8-u1", "Wit and Wisdom", mix(BANK.p8u1, IDIOMROWS)], ["e8-u2", "Values and Dispositions", mix(BANK.p8u2, BANK.voice8)], ["e8-u3", "Mystery and Magic", mix(BANK.p8u3, BANK.homo8)],
    ["e8-u4", "Environment", mix(BANK.p8u4, BANK.sva8)], ["e8-u5", "Science and Curiosity", mix(BANK.p8u5, toRows(VOCAB10, (w) => `'${w}' means…`))],
  ], "Unit");
  book("eng", 9, "Kaveri and grammar", [
    ["e9-kav", "Kaveri: How I Taught My Grandmother to Read and more", mix(BANK.kav9, toRows(VOCAB10, (w) => `'${w}' means…`).slice(0, 6))],
    ["e9-rep", "Reported Speech", BANK.rep9], ["e9-modal", "Modals", BANK.modal9], ["e9-det", "Determiners", BANK.det9],
  ], "Part");
  book("eng", 10, "First Flight and Footprints without Feet", [
    ["e10-ff", "First Flight: Prose", BANK.ff10p], ["e10-ffp", "First Flight: Poems", BANK.ff10v], ["e10-fp", "Footprints without Feet", BANK.fp10],
    ["e10-conn", "Grammar: Clauses and Connectors", BANK.conn10], ["e10-vocab", "Vocabulary in Context", pairGen(VOCAB10, (w) => `'${w}' means…`)],
  ], "Part");
  add("eng", 11, "c-vocab", "Advanced Vocabulary", pairGen(VOCABC, (w) => `'${w}' means…`)); add("eng", 11, "c-ows", "One-Word Substitution", pairGen(OWS, (w) => `One word for: ${w}`));
  add("eng", 11, "c-err", "Error Spotting", BANK.errC); add("eng", 11, "c-phrasal", "Phrasal Verbs", pairGen(PHRASAL, (w) => `'${w}' means…`));
  // General knowledge (no NCERT textbook; kept as themed sets)
  add("gk", 6, "g6-india", "Know India", BANK.gkIndia); add("gk", 6, "g6-world", "Our World", BANK.gkWorld);
  add("gk", 7, "g7-sport", "Sports", BANK.gkSport); add("gk", 7, "g7-people", "Famous Indians", BANK.gkPeople);
  add("gk", 8, "g8-history", "Indian History", BANK.gkHistory); add("gk", 8, "g8-space", "Space and Inventions", BANK.gkSpace);
  add("gk", 9, "g9-const", "Indian Constitution", BANK.gkConst); add("gk", 9, "g9-geo", "Indian Geography", BANK.gkGeo);
  add("gk", 10, "g10-org", "World Organisations", BANK.gkOrg); add("gk", 10, "g10-daily", "Science in Daily Life", BANK.gkDaily);
  add("gk", 11, "c-econ", "Economy and Polity", BANK.gkEcon); add("gk", 11, "c-tech", "Technology and Business", BANK.gkTech);


  const fromBank = ([q, a, ...w]) => ({ q, a, opts: R.shuffle([a, ...w]) });
  function buildQuiz(skill, n = 8) {
    if (skill.bank) return R.shuffle(skill.bank).slice(0, n).map((row) => ({ ...fromBank(row), sid: skill.id }));
    const out = [], seen = new Set();
    for (let t = 0; out.length < n && t < 60; t++) {
      const item = skill.gen();
      if (seen.has(item.q)) continue;
      seen.add(item.q); out.push({ ...item, sid: skill.id });
    }
    return out;
  }
  // True/false statements for the Fact Flash game, drawn from science and GK banks.
  function flashItem(maxGrade) {
    const pool = S.filter((s) => s.bank && (s.s === "sci" || s.s === "gk") && s.g <= maxGrade);
    const [q, a, ...w] = R.pick(R.pick(pool).bank);
    const truth = Math.random() < 0.5;
    return { q, shown: truth ? a : R.pick(w), truth, answer: a };
  }
  const WORDS = {
    easy: [["planet", "Earth is one"], ["garden", "Flowers grow here"], ["rocket", "Flies to space"], ["pencil", "You write with it"], ["bridge", "Crosses a river"], ["castle", "A king's fort"], ["friend", "Someone you like"], ["jungle", "Thick forest"], ["number", "Seven is one"], ["magnet", "Attracts iron"], ["energy", "Ability to do work"], ["circle", "Round shape"], ["animal", "A tiger is one"], ["mango", "King of fruits"], ["river", "The Ganga is one"]],
    medium: [["science", "Study of nature"], ["triangle", "Three sides"], ["monsoon", "Rainy season wind"], ["culture", "Way of life"], ["fraction", "Like 3/4"], ["oxygen", "We breathe it"], ["gravity", "Pulls things down"], ["history", "Study of the past"], ["chemical", "A substance like acid"], ["equation", "Has an equals sign"], ["language", "English is one"], ["adventure", "An exciting trip"], ["volcano", "Erupts lava"], ["climate", "Long-term weather"]],
    hard: [["parliament", "Makes the laws"], ["democracy", "Rule by the people"], ["hypothesis", "A scientific guess"], ["momentum", "Mass times velocity"], ["electricity", "Flows in wires"], ["vocabulary", "Words you know"], ["algorithm", "Step-by-step method"], ["constitution", "Supreme law of a land"], ["probability", "Chance of an event"], ["ecosystem", "Living things and surroundings"], ["refraction", "Bending of light"], ["photosynthesis", "Plants making food"]],
  };

  window.GA_CONTENT = {
    SKILLS: S,
    GRADES: [6, 7, 8, 9, 10, 11],
    SUBJECTS: [
      { id: "math", n: "Maths" },
      { id: "sci", n: "Science" },
      { id: "eng", n: "English" },
      { id: "gk", n: "General Knowledge" },
    ],
    BOOKS, buildQuiz, flashItem, WORDS, R, gcd,
  };
})();
