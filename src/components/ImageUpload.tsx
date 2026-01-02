import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const ImageUpload = ({ onFileSelect, selectedFile }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearFile = () => {
    onFileSelect(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
        <ImageIcon className="w-4 h-4 text-primary" />
        Unggah Gambar
      </label>

      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`upload-zone ${isDragging ? "active" : ""}`}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  Klik atau seret gambar ke sini
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Format: JPG, JPEG, PNG
                </p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative glass-card p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain rounded-lg"
          />
          <p className="text-sm text-muted-foreground mt-3 truncate">
            {selectedFile?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
