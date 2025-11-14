import { useState } from "react";
import { Category, Template } from "../types";
import { CategoryIcon } from "./CategoryIcon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { FileText, Plus, Search, Sparkles, X, ArrowLeft } from "lucide-react";
import { getPresetTemplatesForCategory } from "../utils/presetTemplates";

interface TemplateSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  customTemplates: Template[];
  onSelectTemplate: (
    template: Omit<Template, "id" | "createdAt"> | null
  ) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onCancel: () => void;
}

export function TemplateSelectionDialog({
  open,
  onOpenChange,
  categories,
  customTemplates,
  onSelectTemplate,
  onDeleteTemplate,
  onCancel,
}: TemplateSelectionDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSelectPreset = (
    template: Omit<Template, "id" | "categoryId" | "createdAt">,
    categoryId: string
  ) => {
    onSelectTemplate({
      ...template,
      categoryId,
    });
    onOpenChange(false);
  };

  const handleSelectCustom = (template: Template) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  const handleStartFromScratch = () => {
    onSelectTemplate(null);
    onOpenChange(false);
  };

  const filteredCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((c) => c.id === selectedCategory);

  const filteredCustomTemplates = customTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <DialogContent className="max-w-2xl max-h-[90vh] p-0 flex flex-col">
    //     <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
    //       <DialogTitle className="flex items-center gap-2 text-[#312E81]">
    //         <Sparkles className="h-6 w-6 text-[#2C7A7B]" />
    //         Choose a Template
    //       </DialogTitle>
    //       <DialogDescription>
    //         Select a pre-built template to get started quickly
    //       </DialogDescription>
    //     </DialogHeader>
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-0"
        onClick={onCancel}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex flex-col items-center mb-4 gap-3">
        <h1 className="text-xl text-secondary font-semibold">
          Choose a Template
        </h1>
        <h2 className="text-secondary">
          Select a pre-built template to get started quickly
        </h2>
      </div>
      <div className="pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4C4799]" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
      </div>

      <div className="shrink-0">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2 pb-2 overflow-hidden">
            <Button
              size="sm"
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className={
                selectedCategory === "all"
                  ? "bg-[#2C7A7B] text-white shrink-0"
                  : "shrink-0"
              }
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                size=""
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className={
                  selectedCategory === category.id
                    ? "bg-[#2C7A7B] text-white whitespace-nowrap shrink-0"
                    : "whitespace-nowrap shrink-0"
                }
              >
                <CategoryIcon
                  iconName={category.icon}
                  size={14}
                  color={
                    selectedCategory === category.id
                      ? "#FFFFFF"
                      : category.color
                  }
                  textColor={
                    selectedCategory !== category.id
                      ? "#FFFFFF"
                      : category.color
                  }
                />
                <span className="ml-1">{category.name}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      <Tabs defaultValue="preset" className="flex-1 flex flex-col min-h-0 mt-4">
        <div className="shrink-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Pre-set Templates</TabsTrigger>
            <TabsTrigger value="custom">
              My Templates ({customTemplates.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full py-4">
            <TabsContent value="preset" className="mt-0 space-y-4">
              {filteredCategories.map((category) => {
                const presetTemplates = getPresetTemplatesForCategory(
                  category.name
                );

                if (presetTemplates.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <CategoryIcon
                        iconName={category.icon}
                        size={20}
                        color={category.color}
                      />
                      <h3 className="text-[#312E81] font-semibold">
                        {category.name}
                      </h3>
                    </div>

                    <div className="grid gap-2">
                      {presetTemplates.map((template, index) => (
                        <Card
                          key={index}
                          className="p-4 cursor-pointer hover:border-[#2C7A7B] transition-all active:scale-[0.98] bg-gradient-to-r from-blue-50/50 to-green-50/50"
                          onClick={() =>
                            handleSelectPreset(template, category.id)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                              <FileText className="h-5 w-5 text-[#2C7A7B]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-[#312E81] mb-1">
                                {template.name}
                              </h4>
                              <p className="text-xs text-[#4C4799] line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}

              {filteredCategories.every(
                (cat) => getPresetTemplatesForCategory(cat.name).length === 0
              ) && (
                <div className="text-center py-8 text-[#4C4799]">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    No preset templates available for this category
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="mt-0 space-y-3">
              {filteredCustomTemplates.length === 0 ? (
                <div className="text-center py-8 text-[#4C4799]">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-1">No custom templates yet</p>
                  <p className="text-xs">
                    Create a task and save it as a template for future use
                  </p>
                </div>
              ) : (
                filteredCustomTemplates.map((template) => {
                  const category = categories.find(
                    (c) => c.id === template.categoryId
                  );
                  return (
                    <Card
                      key={template.id}
                      className="p-4 cursor-pointer hover:border-[#2C7A7B] transition-all active:scale-[0.98] relative group"
                      onClick={() => handleSelectCustom(template)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-lg border border-gray-200">
                          {category && (
                            <CategoryIcon
                              iconName={category.icon}
                              size={20}
                              color={category.color}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm text-[#312E81] mb-1">
                                {template.name}
                              </h4>
                              {category && (
                                <p className="text-xs text-[#4C4799] mb-1">
                                  {category.name}
                                </p>
                              )}
                              <p className="text-xs text-[#4C4799] line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                            {onDeleteTemplate && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm("Delete this template?")) {
                                    onDeleteTemplate(template.id);
                                  }
                                }}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>

      <div className="px-6 pb-6 pt-2 border-t shrink-0">
        <Button
          className="w-full h-12 bg-[#312E81] text-white hover:bg-[#4338CA]"
          onClick={handleStartFromScratch}
        >
          <Plus className="h-5 w-5 mr-2" />
          Start from Scratch
        </Button>
      </div>
    </div>
    //   </DialogContent>
    // </Dialog>
  );
}
