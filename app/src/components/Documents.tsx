import { useMemo } from 'react';
import { useState } from 'react';
import { Task, Category, UserProfile, Template } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Trash2, FileText, Edit } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../types';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DocumentsViewProps {
    tasks: Task[];
    templates: Template[];
    onOpenUpload: () => void;
    onOpenCamera: () => void;
    onBack: () => void;
    onOpenTask: (taskId: string) => void;
}

export function DocumentsView({
    tasks,
    templates,
    onOpenUpload,
    onOpenCamera,
    onBack,
    onOpenTask,
}: DocumentsViewProps) {
    // Documents = tasks or templates that have at least one attachment
    const documentTasks = useMemo(
    () => tasks.filter(t => t.attachments && t.attachments.length > 0),
    [tasks]
    );
    const documentTemplates = useMemo(
    () => templates.filter(t => t.attachments && t.attachments.length > 0),
    [templates]
    );

    const empty = documentTasks.length === 0 && documentTemplates.length === 0;

    return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#312E81]">Documents</h1>
        <div className="flex gap-2">
            <Button onClick={onOpenUpload} className="bg-[#312E81] text-white">
            Upload
            </Button>
            <Button variant="outline" onClick={onOpenCamera}>
            Camera
            </Button>
            <Button variant="ghost" onClick={onBack}>
            Back
            </Button>
        </div>
        </div>

        {empty && (
        <Card className="p-10 text-center space-y-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="text-[#4C4799]">
            No documents yet. Capture or upload a file to create document tasks or templates.
            </p>
            <div className="flex gap-3 justify-center">
            <Button onClick={onOpenUpload} className="bg-[#312E81] text-white">Upload</Button>
            <Button variant="outline" onClick={onOpenCamera}>Camera</Button>
            </div>
        </Card>
        )}

        {documentTasks.length > 0 && (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#312E81]">Task Documents</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentTasks.map(t => (
                <Card
                key={t.id}
                className="p-4 hover:shadow cursor-pointer flex flex-col gap-3"
                onClick={() => onOpenTask(t.id)}
                >
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#312E81] line-clamp-1">{t.title}</h3>
                    <Badge>{t.attachments.length} file{t.attachments.length > 1 ? "s" : ""}</Badge>
                </div>
                <p className="text-sm text-[#4C4799] line-clamp-2">{t.description || "No description"}</p>
                <div className="flex gap-2 overflow-x-auto">
                    {t.attachments.slice(0,3).map((a,i) => (
                    <img
                        key={i}
                        src={a}
                        alt=""
                        className="h-16 w-16 object-cover rounded border"
                        loading="lazy"
                    />
                    ))}
                </div>
                </Card>
            ))}
            </div>
        </div>
        )}

        {documentTemplates.length > 0 && (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#312E81]">Template Documents</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentTemplates.map(t => (
                <Card key={t.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#312E81] line-clamp-1">{t.title}</h3>
                    <Badge variant="outline">Template</Badge>
                </div>
                <p className="text-sm text-[#4C4799] line-clamp-2">{t.description || "No description"}</p>
                <div className="flex gap-2 overflow-x-auto">
                    {t.attachments.slice(0,3).map((a,i) => (
                    <img
                        key={i}
                        src={a}
                        alt=""
                        className="h-16 w-16 object-cover rounded border"
                        loading="lazy"
                    />
                    ))}
                </div>
                </Card>
            ))}
            </div>
        </div>
        )}
    </div>
    );
}