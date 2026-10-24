// Gyaan Arena content: CBSE-aligned skills, question banks and maths generators.
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

  // ---------- Skills (CBSE / NCERT chapter names) ----------
  const S = [];
  const add = (s, g, id, n, src) => S.push({ id, s, g, n, ...(typeof src === "function" ? { gen: src } : { bank: src }) });
  // Maths
  add("math", 6, "m6-hcf", "Playing with Numbers", G.hcfLcm); add("math", 6, "m6-int", "Integers", G.int6); add("math", 6, "m6-frac", "Fractions", G.frac6);
  add("math", 6, "m6-dec", "Decimals", G.dec6); add("math", 6, "m6-ratio", "Ratio and Proportion", G.ratio6); add("math", 6, "m6-mens", "Mensuration", G.mens6);
  add("math", 7, "m7-int", "Integers", G.int7); add("math", 7, "m7-eq", "Simple Equations", G.eq7); add("math", 7, "m7-pct", "Comparing Quantities", G.pct7);
  add("math", 7, "m7-exp", "Exponents and Powers", G.exp7); add("math", 7, "m7-area", "Perimeter and Area", G.area7);
  add("math", 8, "m8-lin", "Linear Equations in One Variable", G.lin8); add("math", 8, "m8-sq", "Squares and Square Roots", G.sq8); add("math", 8, "m8-cube", "Cubes and Cube Roots", G.cube8);
  add("math", 8, "m8-cq", "Comparing Quantities", G.cq8); add("math", 8, "m8-alg", "Algebraic Expressions and Identities", G.alg8); add("math", 8, "m8-exp", "Exponents and Powers", G.exp8);
  add("math", 9, "m9-ns", "Number Systems", G.ns9); add("math", 9, "m9-poly", "Polynomials", G.poly9); add("math", 9, "m9-lin2", "Linear Equations in Two Variables", G.lin2);
  add("math", 9, "m9-coord", "Coordinate Geometry", G.coord9); add("math", 9, "m9-ang", "Lines, Angles and Triangles", G.ang9); add("math", 9, "m9-stat", "Statistics", G.stat9);
  add("math", 10, "m10-real", "Real Numbers", G.real10); add("math", 10, "m10-pair", "Pair of Linear Equations", G.pair10); add("math", 10, "m10-quad", "Quadratic Equations", G.quad10);
  add("math", 10, "m10-ap", "Arithmetic Progressions", G.ap10); add("math", 10, "m10-trig", "Introduction to Trigonometry", G.trig10); add("math", 10, "m10-prob", "Probability", G.prob10);
  add("math", 10, "m10-coord", "Coordinate Geometry", G.coord10);
  add("math", 11, "c-pct", "Percentages, Profit and Loss", G.pctC); add("math", 11, "c-tw", "Time and Work", G.twC); add("math", 11, "c-int", "Simple and Compound Interest", G.intC);
  add("math", 11, "c-log", "Logarithms", G.logC); add("math", 11, "c-der", "Derivatives", G.derC); add("math", 11, "c-series", "Number Series", G.seriesC); add("math", 11, "c-avg", "Averages", G.avgC);
  // Science
  add("sci", 6, "s6-food", "Components of Food", BANK.food6); add("sci", 6, "s6-sep", "Separation of Substances", BANK.sep6); add("sci", 6, "s6-motion", "Motion and Measurement of Distances", BANK.motion6);
  add("sci", 6, "s6-light", "Light, Shadows and Reflections", BANK.light6); add("sci", 6, "s6-elec", "Electricity and Circuits", BANK.elec6);
  add("sci", 7, "s7-nutri", "Nutrition in Plants", BANK.nutri7); add("sci", 7, "s7-acid", "Acids, Bases and Salts", BANK.acid7); add("sci", 7, "s7-heat", "Heat", BANK.heat7);
  add("sci", 7, "s7-resp", "Respiration in Organisms", BANK.resp7); add("sci", 7, "s7-curr", "Electric Current and its Effects", BANK.curr7);
  add("sci", 8, "s8-crop", "Crop Production and Management", BANK.crop8); add("sci", 8, "s8-micro", "Microorganisms: Friend and Foe", BANK.micro8); add("sci", 8, "s8-force", "Force and Pressure", BANK.force8);
  add("sci", 8, "s8-fric", "Friction", BANK.fric8); add("sci", 8, "s8-sound", "Sound", BANK.sound8);
  add("sci", 9, "s9-matter", "Matter in Our Surroundings", BANK.matter9); add("sci", 9, "s9-cell", "The Fundamental Unit of Life", BANK.cell9); add("sci", 9, "s9-motion", "Motion", BANK.mot9);
  add("sci", 9, "s9-laws", "Force and Laws of Motion", BANK.laws9); add("sci", 9, "s9-grav", "Gravitation", BANK.grav9);
  add("sci", 10, "s10-chem", "Chemical Reactions and Equations", BANK.chem10); add("sci", 10, "s10-acid", "Acids, Bases and Salts", BANK.acid10); add("sci", 10, "s10-life", "Life Processes", BANK.life10);
  add("sci", 10, "s10-light", "Light: Reflection and Refraction", BANK.ray10); add("sci", 10, "s10-elec", "Electricity", BANK.elec10);
  add("sci", 11, "c-phy", "Physics Fundamentals", BANK.phyC); add("sci", 11, "c-chem", "Chemistry Basics", BANK.chemC); add("sci", 11, "c-bio", "Biology and Health", BANK.bioC); add("sci", 11, "c-cs", "Computer Science Basics", BANK.csC);
  // English
  add("eng", 6, "e6-noun", "Nouns and Pronouns", BANK.noun6); add("eng", 6, "e6-art", "Articles", BANK.art6);
  add("eng", 6, "e6-syn", "Synonyms", pairGen(SYN, (w) => `Choose the synonym of '${w}'`)); add("eng", 6, "e6-ant", "Antonyms", pairGen(ANT, (w) => `Choose the opposite of '${w}'`));
  add("eng", 7, "e7-tense", "Tenses", BANK.tense7); add("eng", 7, "e7-prep", "Prepositions", BANK.prep7); add("eng", 7, "e7-adj", "Adjectives and Adverbs", BANK.adj7);
  add("eng", 7, "e7-spell", "Spelling", () => { const [a, ...w] = R.pick(SPELL); return mc("Which spelling is correct?", a, w); });
  add("eng", 8, "e8-voice", "Active and Passive Voice", BANK.voice8); add("eng", 8, "e8-idiom", "Idioms", pairGen(IDIOM, (w) => `What does '${w}' mean?`));
  add("eng", 8, "e8-sva", "Subject–Verb Agreement", BANK.sva8); add("eng", 8, "e8-homo", "Homophones", BANK.homo8);
  add("eng", 9, "e9-rep", "Reported Speech", BANK.rep9); add("eng", 9, "e9-modal", "Modals", BANK.modal9); add("eng", 9, "e9-det", "Determiners", BANK.det9); add("eng", 9, "e9-bee", "Beehive (Literature)", BANK.bee9);
  add("eng", 10, "e10-ff", "First Flight (Literature)", BANK.ff10); add("eng", 10, "e10-conn", "Clauses and Connectors", BANK.conn10);
  add("eng", 10, "e10-vocab", "Vocabulary in Context", pairGen(VOCAB10, (w) => `'${w}' means…`));
  add("eng", 11, "c-vocab", "Advanced Vocabulary", pairGen(VOCABC, (w) => `'${w}' means…`)); add("eng", 11, "c-ows", "One-Word Substitution", pairGen(OWS, (w) => `One word for: ${w}`));
  add("eng", 11, "c-err", "Error Spotting", BANK.errC); add("eng", 11, "c-phrasal", "Phrasal Verbs", pairGen(PHRASAL, (w) => `'${w}' means…`));
  // General knowledge
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
    buildQuiz, flashItem, WORDS, R, gcd,
  };
})();
