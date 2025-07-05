"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
// Using native date formatting instead of date-fns
import { TrendingUp, TrendingDown, Award, Target } from "lucide-react";

export default function PerformanceChart({ assessments = [] }) {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    trend: 0,
    highest: 0,
    improvement: 0
  });

  useEffect(() => {
    if (assessments && assessments.length > 0) {
      const formattedData = assessments.map((assessment, index) => ({
        date: new Date(assessment.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        score: Math.round(assessment.quizScore || 0),
        index: index + 1,
        fullDate: assessment.createdAt
      }));

      // Calculate statistics
      const scores = formattedData.map(d => d.score);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      const highest = Math.max(...scores);
      const trend = scores.length > 1 ? scores[scores.length - 1] - scores[0] : 0;
      const improvement = scores.length > 1 ? 
        ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100 : 0;

      setStats({
        average: Math.round(average),
        trend,
        highest,
        improvement: Math.round(improvement)
      });

      setChartData(formattedData);
    }
  }, [assessments]);

  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getGradientColor = (score) => {
    if (score >= 90) return "from-emerald-400 to-emerald-500";
    if (score >= 80) return "from-blue-400 to-blue-500";
    if (score >= 70) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const score = payload[0].value;
      return (
        <div className="bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getGradientColor(score)}`} />
            <p className="text-sm font-semibold text-gray-200">{label}</p>
          </div>
          <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Quiz Score</p>
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const score = payload.score;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="#1f2937"
          stroke={score >= 90 ? "#34d399" : score >= 80 ? "#60a5fa" : score >= 70 ? "#fbbf24" : "#f87171"}
          strokeWidth={3}
          className="drop-shadow-md"
        />
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill={score >= 90 ? "#34d399" : score >= 80 ? "#60a5fa" : score >= 70 ? "#fbbf24" : "#f87171"}
        />
      </g>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800/50 border-0 shadow-xl border border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Performance Analytics
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
              Track your learning progress and quiz performance over time
            </CardDescription>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Stats Cards */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-gray-400">Average</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{stats.average}%</p>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-gray-400">Best Score</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400">{stats.highest}%</p>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              {stats.trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className="text-xs font-medium text-gray-400">Trend</span>
            </div>
            <p className={`text-2xl font-bold ${stats.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.trend >= 0 ? '+' : ''}{stats.trend}
            </p>
          </div>
          
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full" />
              <span className="text-xs font-medium text-gray-400">Growth</span>
            </div>
            <p className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.improvement >= 0 ? '+' : ''}{stats.improvement}%
            </p>
          </div>
        </div>
      </div>

      <CardContent className="pt-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7"/>
                  <stop offset="50%" stopColor="#60a5fa"/>
                  <stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                strokeOpacity={0.5}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dy={10}
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="url(#lineGradient)"
                strokeWidth={0}
                fill="url(#scoreGradient)"
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#60a5fa"
                strokeWidth={4}
                dot={<CustomDot />}
                activeDot={{ 
                  r: 8, 
                  stroke: '#60a5fa', 
                  strokeWidth: 3, 
                  fill: '#1f2937',
                  className: 'drop-shadow-lg'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {chartData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
            <Target className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No performance data yet</p>
            <p className="text-sm text-gray-500">Complete some quizzes to see your progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}