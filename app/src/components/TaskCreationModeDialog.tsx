import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Plus, FileText, Sparkles } from 'lucide-react';

interface TaskCreationModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMode: (mode: 'quick' | 'template' | 'create-template') => void;
}

export function TaskCreationModeDialog({
  open,
  onOpenChange,
  onSelectMode,
}: TaskCreationModeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#312E81] text-center">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose how you'd like to create your task
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {/* Quick Add */}
          <Card
            className="p-6 cursor-pointer hover:border-[#2C7A7B] hover:shadow-md transition-all active:scale-[0.98] border-2"
            onClick={() => {
              onSelectMode('quick');
              onOpenChange(false);
            }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#312E81] p-3 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#312E81] mb-1">Quick Add</h3>
                <p className="text-sm text-[#4C4799]">
                  Start from scratch and create a custom task
                </p>
              </div>
            </div>
          </Card>

          {/* Add from Template */}
          <Card
            className="p-6 cursor-pointer hover:border-[#2C7A7B] hover:shadow-md transition-all active:scale-[0.98] border-2"
            onClick={() => {
              onSelectMode('template');
              onOpenChange(false);
            }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#2C7A7B] p-3 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#312E81] mb-1">Add from Template</h3>
                <p className="text-sm text-[#4C4799]">
                  Choose from pre-built or custom templates
                </p>
              </div>
            </div>
          </Card>

          {/* Create Template */}
          <Card
            className="p-6 cursor-pointer hover:border-[#312E81] hover:shadow-md transition-all active:scale-[0.98] border-2 border-dashed"
            onClick={() => {
              onSelectMode('create-template');
              onOpenChange(false);
            }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#312E81] mb-1">Create Template</h3>
                <p className="text-sm text-[#4C4799]">
                  Build a reusable template for recurring tasks
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
