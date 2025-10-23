import { formatUnits } from "viem";
import numeral from "numeral";
import type { ReactNode } from "react";

export function roundDown(float: number, decimals: number) {
  const factor = Math.pow(10, decimals);

  return Math.floor(float * factor) / factor;
}
export function inputPatternMatch(s: string, decimals = 18) {
  const pattern = /^[0-9]*[.,]?[0-9]*$/;
  const decimalPattern = RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);
  if (s === "") {
    return true;
  }
  return pattern.test(s) && decimalPattern.test(s);
}

export function formatNumber(number: number | string, decimals = 4): ReactNode {
  if (typeof number === "string") {
    number = Number.parseFloat(number);
    if (!Number.isFinite(number)) {
      return "0";
    }
  }

  let n = number;
  // round down

  if (number >= 1 && number <= 999) {
    const parts = n.toString().split(".");
    if (!parts[0]) {
      return "0";
    }
    // show only three most sign digits
    const sig = 3 - (parts[0].length ?? 0);
    return Number.parseFloat(
      `${parts[0]}.${parts[1]?.slice(0, sig)}`,
    ).toString();
  }

  if (n === 0) {
    return "0";
  }
  if (n < 1 && n >= 0.001) {
    const parts = n.toString().split(".");
    // return trimToSignificantDigits(n).toString();
    let zeros = 0;
    if (parts[1]?.split("")) {
      for (const digit of parts[1]?.split("")) {
        if (digit === "0") {
          zeros++;
        } else {
          // break once you hit a number other then 0
          break;
        }
      }
    }
    return Number.parseFloat(
      `0.${parts[1]?.slice(0, decimals + zeros)}`,
    ).toString();
  }
  if (n < 0.001) {
    return formatSmallNumber(n);
  }
  if (n > 999) {
    const num = numeral(n);
    const f = num.format("0.000a").toUpperCase();
    const parts = f.split(".");

    if (!parts[0]) {
      return "0";
    }
    // show only three most sign digits
    const sig = 3 - (parts[0].length ?? 0);

    return (
      Number.parseFloat(`${parts[0]}.${parts[1]?.slice(0, sig)}`).toString() +
      `${f[f.length - 1]}`
    );
  }
  if (decimals) {
    n = roundDown(n, 10);
  }

  return n.toString();
}

export function formatSmallNumber(number: number): ReactNode {
  const num = number.toString();
  if (num.includes("e")) {
    // number is in scientific notation
    const sige = parseInt(num.split("e")[1] ?? "0");
    const nums = parseInt(
      num.split("e")[0]?.replace(".", "").slice(0, 3) ?? "0",
    );

    return (
      <>
        0.0<sub>{Math.abs(sige).toString()}</sub>
        {nums}
      </>
    );
  }
  const decimalPart = num.split(".")[1];
  if (decimalPart === undefined) {
    return "0";
  }
  let zeros = 0;
  for (const i of decimalPart) {
    if (i === "0") {
      zeros++;
    }
    if (i !== "0") {
      break;
    }
  }
  const sig = decimalPart.slice(zeros, zeros + 3);

  return (
    <>
      0.0<sub>{zeros.toString()}</sub>
      {sig}
    </>
  );
}
export function formatBigInt(b: bigint | undefined, fixed: number) {
  const parsed =
    Math.floor(parseFloat(formatUnits(b ?? 0n, 18)) * 10 ** fixed) /
    10 ** fixed;
  return parseFloat(parsed.toFixed(fixed));
}

export const enforceOnlyNumbers = (value: string): string => {
  return value.replace(/[^0-9.]/g, "").replace(/^(\d*\.\d*)\./g, "$1"); // Allow only numbers and a single decimal point
};
