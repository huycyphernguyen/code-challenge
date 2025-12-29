function assertValidN(n: number): void {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error("n must be a non-negative integer");
    }
}

// Iterative – safest general-purpose solution
export function sum_to_n_a(n: number): number {
    assertValidN(n);

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Formula – fastest, but assumes safe integer range
export function sum_to_n_b(n: number): number {
    assertValidN(n);
    return (n * (n + 1)) / 2;
}

// Recursive – educational only
export function sum_to_n_c(n: number): number {
    assertValidN(n);

    if (n === 0) return 0;
    return n + sum_to_n_c(n - 1);
}

export const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T'; // Trillions
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B'; // Billions
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M'; // Millions
    } else if (num >= 1e3) {
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Thousands with commas
    } else {
        return num.toFixed(2); // Less than a thousand
    }
};

export const formatRecalculatedAmount = (amount: number): string => {
    // Ensure the total digits (including 3 decimals) do not exceed 15
    const formattedResult = amount
        .toPrecision(
            Math.min(15, 15 - 3 + amount.toFixed(3).split('.')[0].length)
        )
        .slice(0, 15);
    console.log(formattedResult);
    return parseFloat(formattedResult).toFixed(3);
};