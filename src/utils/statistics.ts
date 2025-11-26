// Statistical Utilities for Pharmaceutical QC
// CPK Calculation and Trend Analysis

export interface CPKResult {
    cpk: number;
    cp: number;
    cpkl: number;
    cpku: number;
    mean: number;
    stdDev: number;
    interpretation: string;
    status: 'excellent' | 'adequate' | 'marginal' | 'inadequate';
}

export interface TrendAnalysisResult {
    isOOS: boolean; // Out of Specification
    isOOT: boolean; // Out of Trend
    trend: 'increasing' | 'decreasing' | 'stable';
    slope: number;
    warnings: string[];
}

/**
 * Calculate Process Capability Index (CPK)
 * CPK measures how well a process meets specification limits
 * 
 * @param data - Array of measurement values
 * @param lsl - Lower Specification Limit
 * @param usl - Upper Specification Limit
 * @param target - Target value (optional, defaults to midpoint)
 * @returns CPK calculation results
 */
export function calculateCPK(
    data: number[],
    lsl: number,
    usl: number
): CPKResult {
    if (data.length < 2) {
        throw new Error('At least 2 data points required for CPK calculation');
    }

    // Calculate mean
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;

    // Calculate standard deviation
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    const stdDev = Math.sqrt(variance);

    // Calculate CP (Process Capability)
    const cp = (usl - lsl) / (6 * stdDev);

    // Calculate CPK Lower and Upper
    const cpkl = (mean - lsl) / (3 * stdDev);
    const cpku = (usl - mean) / (3 * stdDev);

    // CPK is the minimum of CPKl and CPKu
    const cpk = Math.min(cpkl, cpku);

    // Determine status and interpretation
    let status: CPKResult['status'];
    let interpretation: string;

    if (cpk >= 2.0) {
        status = 'excellent';
        interpretation = 'Process is highly capable. Excellent quality control.';
    } else if (cpk >= 1.33) {
        status = 'adequate';
        interpretation = 'Process is capable. Good quality control.';
    } else if (cpk >= 1.0) {
        status = 'marginal';
        interpretation = 'Process barely meets requirements. Improvement needed.';
    } else {
        status = 'inadequate';
        interpretation = 'Process is not capable. Immediate action required.';
    }

    return {
        cpk,
        cp,
        cpkl,
        cpku,
        mean,
        stdDev,
        interpretation,
        status
    };
}

/**
 * Perform Trend Analysis to detect OOS and OOT
 * Uses statistical process control rules
 * 
 * @param data - Historical measurement values (chronological order)
 * @param lsl - Lower Specification Limit
 * @param usl - Upper Specification Limit
 * @param target - Target value
 * @returns Trend analysis results
 */
export function analyzeTrend(
    data: number[],
    lsl: number,
    usl: number
): TrendAnalysisResult {
    const warnings: string[] = [];
    let isOOS = false;
    let isOOT = false;

    // Check for Out of Specification (OOS)
    const oosPoints = data.filter(val => val < lsl || val > usl);
    if (oosPoints.length > 0) {
        isOOS = true;
        warnings.push(`${oosPoints.length} point(s) out of specification detected`);
    }

    // Calculate mean and control limits for trend detection
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    const stdDev = Math.sqrt(variance);

    // Control limits (±3 sigma)
    const ucl = mean + 3 * stdDev;
    const lcl = mean - 3 * stdDev;

    // Warning limits (±2 sigma)
    const uwl = mean + 2 * stdDev;
    const lwl = mean - 2 * stdDev;

    // Western Electric Rules for OOT detection

    // Rule 1: One point beyond 3 sigma
    const beyond3Sigma = data.some(val => val > ucl || val < lcl);
    if (beyond3Sigma) {
        isOOT = true;
        warnings.push('Rule 1: Point beyond 3 sigma control limit');
    }

    // Rule 2: 2 out of 3 consecutive points beyond 2 sigma
    for (let i = 0; i < data.length - 2; i++) {
        const window = data.slice(i, i + 3);
        const beyond2Sigma = window.filter(val => val > uwl || val < lwl).length;
        if (beyond2Sigma >= 2) {
            isOOT = true;
            warnings.push('Rule 2: 2 of 3 points beyond 2 sigma');
            break;
        }
    }

    // Rule 3: 4 out of 5 consecutive points beyond 1 sigma
    const sigma1Upper = mean + stdDev;
    const sigma1Lower = mean - stdDev;
    for (let i = 0; i < data.length - 4; i++) {
        const window = data.slice(i, i + 5);
        const beyond1Sigma = window.filter(val => val > sigma1Upper || val < sigma1Lower).length;
        if (beyond1Sigma >= 4) {
            isOOT = true;
            warnings.push('Rule 3: 4 of 5 points beyond 1 sigma');
            break;
        }
    }

    // Rule 4: 9 consecutive points on one side of center line
    for (let i = 0; i < data.length - 8; i++) {
        const window = data.slice(i, i + 9);
        const allAbove = window.every(val => val > mean);
        const allBelow = window.every(val => val < mean);
        if (allAbove || allBelow) {
            isOOT = true;
            warnings.push('Rule 4: 9 consecutive points on one side of mean');
            break;
        }
    }

    // Calculate trend (linear regression slope)
    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const xMean = (n - 1) / 2;
    const yMean = mean;

    const numerator = xValues.reduce((sum, x, i) => sum + (x - xMean) * (data[i] - yMean), 0);
    const denominator = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);
    const slope = numerator / denominator;

    // Determine trend direction
    let trend: TrendAnalysisResult['trend'];
    if (Math.abs(slope) < 0.01) {
        trend = 'stable';
    } else if (slope > 0) {
        trend = 'increasing';
        if (slope > stdDev / n) {
            warnings.push('Significant increasing trend detected');
        }
    } else {
        trend = 'decreasing';
        if (Math.abs(slope) > stdDev / n) {
            warnings.push('Significant decreasing trend detected');
        }
    }

    return {
        isOOS,
        isOOT,
        trend,
        slope,
        warnings
    };
}

/**
 * Calculate moving average for smoothing data
 */
export function movingAverage(data: number[], windowSize: number = 3): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - Math.floor(windowSize / 2));
        const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
        const window = data.slice(start, end);
        const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(avg);
    }
    return result;
}

/**
 * Calculate control limits for control charts
 */
export function calculateControlLimits(data: number[]): {
    mean: number;
    ucl: number;
    lcl: number;
    uwl: number;
    lwl: number;
} {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    const stdDev = Math.sqrt(variance);

    return {
        mean,
        ucl: mean + 3 * stdDev,
        lcl: mean - 3 * stdDev,
        uwl: mean + 2 * stdDev,
        lwl: mean - 2 * stdDev
    };
}
