// app/resume/_components/entry-form.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import { 
  Sparkles, 
  PlusCircle, 
  X, 
  Pencil, 
  Save, 
  Loader2,
  Calendar,
  Building,
  User,
  FileText,
  MapPin
} from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = parse(dateString, "yyyy-MM", new Date());
  return format(date, "MMM yyyy");
};

export function EntryForm({ type, entries, onChange }) {
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false,
    },
  });

  const current = watch("current");

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.current ? "" : formatDisplayDate(data.endDate),
    };

    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
    toast.success(`${type} added successfully!`);
  });

  const handleDelete = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
    toast.success(`${type} deleted successfully!`);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  const getTypeIcon = () => {
    switch (type.toLowerCase()) {
      case 'experience':
        return <Building className="h-4 w-4" />;
      case 'education':
        return <User className="h-4 w-4" />;
      case 'project':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type.toLowerCase()) {
      case 'experience':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'education':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'project':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Entries */}
      <div className="space-y-4">
        {entries.map((item, index) => (
          <Card key={index} className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/30">
                    {getTypeIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm text-gray-400 mt-1 flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      {item.organization}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(index)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center text-sm text-gray-400 mb-3">
                <Calendar className="h-3 w-3 mr-2" />
                <span className="bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700/50">
                  {item.current
                    ? `${item.startDate} - Present`
                    : `${item.startDate} - ${item.endDate}`}
                </span>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Entry Form */}
      {isAdding && (
        <Card className={`bg-gradient-to-br ${getTypeColor()} backdrop-blur-sm border-2 shadow-xl`}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              {getTypeIcon()}
              <CardTitle className="text-xl font-bold text-white">
                Add New {type}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title and Organization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center">
                  <User className="h-3 w-3 mr-2" />
                  Title/Position
                </label>
                <Input
                  placeholder="e.g., Software Engineer"
                  {...register("title")}
                  className="bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
                {errors.title && (
                  <p className="text-sm text-red-400 flex items-center">
                    <X className="h-3 w-3 mr-1" />
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200 flex items-center">
                  <Building className="h-3 w-3 mr-2" />
                  Organization/Company
                </label>
                <Input
                  placeholder="e.g., Tech Corp"
                  {...register("organization")}
                  className="bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
                {errors.organization && (
                  <p className="text-sm text-red-400 flex items-center">
                    <X className="h-3 w-3 mr-1" />
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Start Date
                  </label>
                  <Input
                    type="month"
                    {...register("startDate")}
                    className="bg-gray-900/50 border-gray-600/50 text-gray-100 focus:border-blue-500/50 focus:ring-blue-500/20"
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-400 flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200 flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    End Date
                  </label>
                  <Input
                    type="month"
                    {...register("endDate")}
                    disabled={current}
                    className="bg-gray-900/50 border-gray-600/50 text-gray-100 focus:border-blue-500/50 focus:ring-blue-500/20 disabled:opacity-50"
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-400 flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Current Position Toggle */}
              <div className="flex items-center space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30">
                <input
                  type="checkbox"
                  id="current"
                  {...register("current")}
                  onChange={(e) => {
                    setValue("current", e.target.checked);
                    if (e.target.checked) {
                      setValue("endDate", "");
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="current" className="text-sm font-medium text-gray-200 cursor-pointer">
                  Currently working here
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-200 flex items-center">
                <FileText className="h-3 w-3 mr-2" />
                Description
              </label>
              <Textarea
                placeholder={`Describe your ${type.toLowerCase()} responsibilities, achievements, and key contributions...`}
                className="h-36 bg-gray-900/50 border-gray-600/50 text-gray-100 placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-400 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  {errors.description.message}
                </p>
              )}
              
              {/* AI Improve Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImproveDescription}
                disabled={isImproving || !watch("description")}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:from-purple-600/30 hover:to-pink-600/30 text-purple-300 hover:text-purple-200 transition-all duration-200"
              >
                {isImproving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Improve with AI
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 bg-gray-900/30 border-t border-gray-700/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
              className="border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add {type}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Add New Entry Button */}
      {!isAdding && (
        <Button
          className="w-full h-16 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-2 border-dashed border-gray-600/50 hover:border-gray-500/50 hover:from-gray-700/50 hover:to-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 group"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
          Add New {type}
        </Button>
      )}
    </div>
  );
}