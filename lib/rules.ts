// A toy underwriting rule engine. Thresholds and figures are invented for the demo.

export type Loan = {
  value: number;
  downPct: number;
  income: number;
  selfEmployed: boolean;
  years: number;
  coverage: number;
  floodZone: boolean;
  floodPolicy: boolean;
  /** Ids of the liabilities the borrower put on the application. */
  listed: string[];
};

export type Liability = { id: string; name: string; payment: number };
export type Tradeline = { id: string; name: string; payment: number };

/** What the borrower wrote down. */
export const LIABILITIES: Liability[] = [
  { id: "auto", name: "Huron Auto Finance", payment: 400 },
  { id: "student", name: "Dept. of Education student loan", payment: 265 },
  { id: "card", name: "Mackinac Bank Visa", payment: 100 },
];

/** What the credit report says. */
export const TRADELINES: Tradeline[] = [
  { id: "t-auto", name: "HURON AUTO FIN", payment: 412 },
  { id: "t-student", name: "US DEPT ED", payment: 265 },
  { id: "t-card", name: "MACKINAC BK CARD", payment: 95 },
];

export const LIMITS = { ltv: 80, dti: 45, selfEmployedYears: 2, match: 0.6 };

const RATE = 0.065;
const TERM = 360;

const STOP = new Set(["OF", "THE", "LOAN", "US"]);

function tokens(name: string) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

/** True when one token abbreviates the other: FIN/FINANCE, BK/BANK, ED/EDUCATION. */
function abbreviates(a: string, b: string) {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short[0] !== long[0]) return false;
  let i = 0;
  for (const ch of long) if (ch === short[i]) i++;
  return i === short.length;
}

/** 0 to 1. Creditor names rarely agree between an application and a credit report, so the payment counts too. */
export function matchScore(liability: Liability, tradeline: Tradeline) {
  const a = tokens(liability.name);
  const b = tokens(tradeline.name);
  const free = [...b];
  let hits = 0;
  for (const t of a) {
    const at = free.findIndex((u) => abbreviates(t, u));
    if (at >= 0) {
      free.splice(at, 1);
      hits++;
    }
  }
  const name = hits / Math.max(a.length, b.length);
  const payment = 1 - Math.abs(liability.payment - tradeline.payment) / Math.max(liability.payment, tradeline.payment);
  return 0.6 * name + 0.4 * payment;
}

export type Match = { liability: Liability; tradeline: Tradeline; score: number };

export function matchLiabilities(listed: string[]) {
  const pairs: Match[] = [];
  for (const liability of LIABILITIES.filter((l) => listed.includes(l.id))) {
    for (const tradeline of TRADELINES) {
      const score = matchScore(liability, tradeline);
      if (score >= LIMITS.match) pairs.push({ liability, tradeline, score });
    }
  }
  pairs.sort((x, y) => y.score - x.score);

  const matches: Match[] = [];
  for (const pair of pairs) {
    if (matches.some((m) => m.liability === pair.liability || m.tradeline === pair.tradeline)) continue;
    matches.push(pair);
  }
  const undisclosed = TRADELINES.filter((t) => !matches.some((m) => m.tradeline === t));
  return { matches, undisclosed };
}

export type RuleResult = {
  id: string;
  part: string;
  name: string;
  when: string;
  /** One line per condition raised. Empty when the rule passes. */
  conditions: string[];
};

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const pct = (n: number) => `${n.toFixed(1)}%`;

export function evaluate(loan: Loan) {
  const loanAmount = loan.value * (1 - loan.downPct / 100);
  const ltv = 100 - loan.downPct;

  const r = RATE / 12;
  const principalAndInterest = (loanAmount * r) / (1 - (1 + r) ** -TERM);
  const taxesAndInsurance = (loan.value * 0.015) / 12;
  const mortgageInsurance = ltv > LIMITS.ltv ? (loanAmount * 0.005) / 12 : 0;
  const housing = principalAndInterest + taxesAndInsurance + mortgageInsurance;

  const { matches, undisclosed } = matchLiabilities(loan.listed);
  // The credit report is the source of truth for debts, disclosed or not.
  const debts = TRADELINES.reduce((sum, t) => sum + t.payment, 0);
  const dti = ((housing + debts) / loan.income) * 100;

  const rules: RuleResult[] = [
    {
      id: "PROP-01",
      part: "Property",
      name: "Loan-to-value",
      when: `ltv > ${LIMITS.ltv}`,
      conditions: ltv > LIMITS.ltv ? [`LTV is ${ltv}%. Mortgage insurance is required above ${LIMITS.ltv}%.`] : [],
    },
    {
      id: "INS-01",
      part: "Insurance",
      name: "Dwelling coverage",
      when: "coverage < loanAmount",
      conditions:
        loan.coverage < loanAmount
          ? [`Coverage of ${usd(loan.coverage)} is below the ${usd(loanAmount)} loan amount.`]
          : [],
    },
    {
      id: "INS-02",
      part: "Insurance",
      name: "Flood policy",
      when: "floodZone && !floodPolicy",
      conditions: loan.floodZone && !loan.floodPolicy ? ["Property is in a flood zone with no flood policy on file."] : [],
    },
    {
      id: "INC-01",
      part: "Income",
      name: "Debt-to-income",
      when: `dti > ${LIMITS.dti}`,
      conditions: dti > LIMITS.dti ? [`DTI is ${pct(dti)}. The limit is ${LIMITS.dti}%.`] : [],
    },
    {
      id: "INC-02",
      part: "Income",
      name: "Self-employment history",
      when: `selfEmployed && years < ${LIMITS.selfEmployedYears}`,
      conditions:
        loan.selfEmployed && loan.years < LIMITS.selfEmployedYears
          ? [`Self-employed for ${loan.years === 1 ? "1 year" : `${loan.years} years`}. Two years of history are needed.`]
          : [],
    },
    {
      id: "LIA-01",
      part: "Liabilities and tradelines",
      name: "Undisclosed debt",
      when: "tradeline has no matching liability",
      conditions: undisclosed.map((t) => `${t.name} (${usd(t.payment)}/mo) is on the credit report but not the application.`),
    },
  ];

  return {
    loanAmount,
    ltv,
    dti,
    housing,
    debts,
    matches,
    rules,
    open: rules.reduce((n, rule) => n + rule.conditions.length, 0),
  };
}

export const SCENARIOS: { label: string; loan: Loan }[] = [
  {
    label: "First-time buyer",
    loan: {
      value: 320_000,
      downPct: 5,
      income: 7_500,
      selfEmployed: false,
      years: 3,
      coverage: 300_000,
      floodZone: false,
      floodPolicy: false,
      listed: ["student", "card"],
    },
  },
  {
    label: "Self-employed",
    loan: {
      value: 450_000,
      downPct: 20,
      income: 7_000,
      selfEmployed: true,
      years: 1,
      coverage: 400_000,
      floodZone: false,
      floodPolicy: false,
      listed: ["auto", "student", "card"],
    },
  },
  {
    label: "House on the river",
    loan: {
      value: 380_000,
      downPct: 25,
      income: 11_000,
      selfEmployed: false,
      years: 6,
      coverage: 250_000,
      floodZone: true,
      floodPolicy: false,
      listed: ["auto", "student", "card"],
    },
  },
];
