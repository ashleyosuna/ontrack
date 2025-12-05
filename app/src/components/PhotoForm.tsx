import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ArrowLeft, Bell, Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface PhotoFormProps {
  onCancel: () => void;
  onSave: (taskData: Omit<Task, "id" | "createdAt">) => void;
  defaultCategoryId?: string;
}

export function PhotoForm({ onCancel, onSave, defaultCategoryId }: PhotoFormProps) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [categoryId] = useState(defaultCategoryId || "");
  const [capturing, setCapturing] = useState(false);

  const takePhoto = async () => {
    setCapturing(true);
    try {
      const photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: "Capture",
        promptLabelPhoto: "Camera",
        promptLabelPicture: "Use Photo",
      });
      setImageDataUrl(photo.dataUrl || null);
      if (!name) setName("Captured Document");
    } catch {
      // ignore user cancel
    } finally {
      setCapturing(false);
    }
  };

  const retake = () => {
    setImageDataUrl(null);
    takePhoto();
  };

  const handleSubmit = () => {
    if (!imageDataUrl || !title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      date: new Date(),
      categoryId,
      notes: "",
      attachments: [imageDataUrl],
      reminders: [],
    });
  };

  return (
    <div className="space-y-5 relative">
      {/* Header */}
      <Button
        onClick={onCancel}
        variant="outline"
        size="icon"
        className="absolute top-0 left-0"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 border-purple-200 space-y-5">
      <h2 className="text-lg font-semibold text-[#312E81]">Capture Document</h2>
      {!imageDataUrl && (
        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={takePhoto}
            disabled={capturing}
            className="h-14 w-full bg-[#312E81] text-white hover:bg-[#4338CA]"
          >
            {capturing ? "Opening Camera..." : "Take Photo"}
          </Button>
          <p className="text-sm text-[#4C4799] text-center">
            Use your camera to capture a document. Grant permission if prompted.
          </p>
        </div>
      )}

      {imageDataUrl && (
        <div className="space-y-4">
          <img
            src={imageDataUrl}
            alt="Captured"
            className="rounded-md w-full object-cover max-h-96 border"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={retake} className="flex-1">
              Retake
            </Button>
            <Button onClick={takePhoto} className="flex-1">
              New Photo
            </Button>
          </div>
          <div className="space-y-3">
            <Label htmlFor="name" className="text-[#312E81]">
              Document Name *
            </Label>
            <Input
              id="name"
              value={name}
              className="h-12"
              required
              placeholder="Title *"
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
            <Label htmlFor="description" className="text-[#312E81]">
              Description
            </Label>
            <Textarea
              placeholder="Description (optional)"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[#312E81]">
              Notes
            </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <Button
            disabled={!title.trim()}
            onClick={handleSubmit}
            className="h-12 w-full bg-[#312E81] text-white hover:bg-[#4338CA]"
          >
            Save Task
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-12 w-full"
          >
            Cancel
          </Button>
        </div>
      )}
    </Card>
    </div>
  );
}