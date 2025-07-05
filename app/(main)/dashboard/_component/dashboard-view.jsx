"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  Brain,
  DollarSign,
  Zap,
  Star,
  Target,
  Award,
  ChevronRight,
  Calendar,
} from "lucide-react";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "from-green-500 to-emerald-500";
      case "medium":
        return "from-yellow-500 to-orange-500";
      case "low":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-400" };
      case "neutral":
        return { icon: Target, color: "text-yellow-400" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-400" };
      default:
        return { icon: Target, color: "text-gray-400" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 relative">
      {/* Fixed background SVG with proper escaping */}
      <div
        className="absolute inset-0 bg-repeat opacity-10"
        style={{
          backgroundImage:
            `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Career Dashboard
              </h1>
              <p className="text-slate-400 text-lg">
                Your personalized career insights and market analysis
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl px-4 py-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">
                Last updated: {new Date(insights.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <OutlookIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Market Outlook</p>
                <p className="text-2xl font-bold text-white">{insights.marketOutlook}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Growth Rate</p>
                <p className="text-2xl font-bold text-white">{insights.growthRate}%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                style={{ width: `${insights.growthRate * 4}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Demand Level</p>
                <p className="text-2xl font-bold text-white">{insights.demandLevel}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full">
              <div
                className={`h-full bg-gradient-to-r ${getDemandLevelColor(insights.demandLevel)} rounded-full`}
                style={{ width: '90%' }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Top Skills</p>
                <p className="text-2xl font-bold text-white">{insights.topSkills.length}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {insights.topSkills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700/50 text-xs text-slate-300 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Salary Chart */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Salary Ranges</h3>
                <p className="text-sm text-slate-400">By role level (in thousands)</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      color: '#F3F4F6',
                    }}
                  />
                  <Bar
                    dataKey="min"
                    fill="#8B5CF6"
                    name="Min Salary (K)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="median"
                    fill="#A855F7"
                    name="Median Salary (K)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="max"
                    fill="#C084FC"
                    name="Max Salary (K)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Skills Overview</h3>
                <p className="text-sm text-slate-400">Current and recommended skills</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Top Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.topSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 rounded-xl text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-green-400" />
                  Recommended Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {insights.recommendedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-300 rounded-xl text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trends Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Industry Trends</h3>
              <p className="text-sm text-slate-400">Key developments shaping the industry</p>
            </div>
            <Award className="w-8 h-8 text-blue-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.keyTrends.map((trend, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 leading-relaxed">{trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
