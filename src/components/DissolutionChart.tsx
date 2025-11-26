import React from 'react';
import { DissolutionProfile } from '../types/rd-studies';
import { BarChart3 } from 'lucide-react';

interface DissolutionChartProps {
    profiles: DissolutionProfile[];
}

export const DissolutionChart: React.FC<DissolutionChartProps> = ({ profiles }) => {
    if (!profiles || profiles.length === 0) return null;

    // Get all unique time points across all profiles
    const allTimes = Array.from(
        new Set(profiles.flatMap(p => p.timePoints.map(tp => tp.time)))
    ).sort((a, b) => a - b);

    // Find max values for scaling
    const maxTime = Math.max(...allTimes);
    const maxPercent = 100;

    // Generate colors for different profiles
    const colors = [
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#f59e0b', // amber
        '#8b5cf6', // violet
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#f97316'  // orange
    ];

    // Calculate chart dimensions
    const chartWidth = 800;
    const chartHeight = 400;
    const padding = { top: 40, right: 150, bottom: 60, left: 60 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    // Scale functions
    const scaleX = (time: number) => (time / maxTime) * plotWidth + padding.left;
    const scaleY = (percent: number) => chartHeight - padding.bottom - (percent / maxPercent) * plotHeight;

    // Generate grid lines
    const yGridLines = [0, 20, 40, 60, 80, 100];
    const xGridLines = allTimes.filter((_, i) => i % Math.ceil(allTimes.length / 10) === 0);

    return (
        <div className="card">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Dissolution Profile Comparison
                </h3>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <svg
                    width={chartWidth}
                    height={chartHeight}
                    className="w-full"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                >
                    {/* Grid Lines */}
                    <g className="grid-lines">
                        {/* Horizontal grid lines */}
                        {yGridLines.map((value) => (
                            <g key={`y-grid-${value}`}>
                                <line
                                    x1={padding.left}
                                    y1={scaleY(value)}
                                    x2={chartWidth - padding.right}
                                    y2={scaleY(value)}
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-slate-200 dark:text-slate-700"
                                    strokeDasharray="4,4"
                                />
                                <text
                                    x={padding.left - 10}
                                    y={scaleY(value)}
                                    textAnchor="end"
                                    alignmentBaseline="middle"
                                    className="text-xs fill-slate-600 dark:fill-slate-400"
                                >
                                    {value}%
                                </text>
                            </g>
                        ))}

                        {/* Vertical grid lines */}
                        {xGridLines.map((value) => (
                            <g key={`x-grid-${value}`}>
                                <line
                                    x1={scaleX(value)}
                                    y1={padding.top}
                                    x2={scaleX(value)}
                                    y2={chartHeight - padding.bottom}
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    className="text-slate-200 dark:text-slate-700"
                                    strokeDasharray="4,4"
                                />
                                <text
                                    x={scaleX(value)}
                                    y={chartHeight - padding.bottom + 20}
                                    textAnchor="middle"
                                    className="text-xs fill-slate-600 dark:fill-slate-400"
                                >
                                    {value}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Axes */}
                    <g className="axes">
                        {/* X-axis */}
                        <line
                            x1={padding.left}
                            y1={chartHeight - padding.bottom}
                            x2={chartWidth - padding.right}
                            y2={chartHeight - padding.bottom}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-400 dark:text-slate-600"
                        />
                        <text
                            x={chartWidth / 2}
                            y={chartHeight - 10}
                            textAnchor="middle"
                            className="text-sm font-medium fill-slate-700 dark:fill-slate-300"
                        >
                            Time (minutes)
                        </text>

                        {/* Y-axis */}
                        <line
                            x1={padding.left}
                            y1={padding.top}
                            x2={padding.left}
                            y2={chartHeight - padding.bottom}
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-slate-400 dark:text-slate-600"
                        />
                        <text
                            x={20}
                            y={chartHeight / 2}
                            textAnchor="middle"
                            transform={`rotate(-90, 20, ${chartHeight / 2})`}
                            className="text-sm font-medium fill-slate-700 dark:fill-slate-300"
                        >
                            % Dissolved
                        </text>
                    </g>

                    {/* Plot lines and points for each profile */}
                    {profiles.map((profile, profileIndex) => {
                        const color = colors[profileIndex % colors.length];
                        const sortedPoints = [...profile.timePoints].sort((a, b) => a.time - b.time);

                        // Generate path for line
                        const pathData = sortedPoints
                            .map((tp, i) => {
                                const x = scaleX(tp.time);
                                const y = scaleY(tp.percentDissolved);
                                return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                            })
                            .join(' ');

                        return (
                            <g key={profile.id}>
                                {/* Line */}
                                <path
                                    d={pathData}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Data points */}
                                {sortedPoints.map((tp, pointIndex) => (
                                    <g key={`${profile.id}-${pointIndex}`}>
                                        <circle
                                            cx={scaleX(tp.time)}
                                            cy={scaleY(tp.percentDissolved)}
                                            r="5"
                                            fill={color}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                        {/* Tooltip on hover */}
                                        <title>
                                            {profile.sampleDescription}
                                            {'\n'}Time: {tp.time} min
                                            {'\n'}Dissolved: {tp.percentDissolved}%
                                        </title>
                                    </g>
                                ))}
                            </g>
                        );
                    })}

                    {/* Legend */}
                    <g className="legend">
                        {profiles.map((profile, index) => {
                            const color = colors[index % colors.length];
                            const yPos = padding.top + index * 25;

                            return (
                                <g key={`legend-${profile.id}`}>
                                    <line
                                        x1={chartWidth - padding.right + 10}
                                        y1={yPos}
                                        x2={chartWidth - padding.right + 30}
                                        y2={yPos}
                                        stroke={color}
                                        strokeWidth="2.5"
                                    />
                                    <circle
                                        cx={chartWidth - padding.right + 20}
                                        cy={yPos}
                                        r="4"
                                        fill={color}
                                        stroke="white"
                                        strokeWidth="1.5"
                                    />
                                    <text
                                        x={chartWidth - padding.right + 35}
                                        y={yPos}
                                        alignmentBaseline="middle"
                                        className="text-xs fill-slate-700 dark:fill-slate-300"
                                    >
                                        {profile.sampleDescription.length > 15
                                            ? profile.sampleDescription.substring(0, 15) + '...'
                                            : profile.sampleDescription}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Profile Details */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {profiles.map((profile, index) => {
                    const color = colors[index % colors.length];
                    return (
                        <div
                            key={profile.id}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                        >
                            <div
                                className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {profile.sampleDescription}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {profile.medium} | {profile.apparatus} | {profile.rpm} RPM
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
