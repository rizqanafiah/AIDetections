import { useCallback, useState, useRef } from "react";
import { Upload, Music, X, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const AudioUpload = ({ onFileSelect, selectedFile }: AudioUploadProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file && (file.type === "audio/wav" || file.type === "audio/mpeg" || file.type === "audio/mp3")) {
        onFileSelect(file);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
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
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
        <Music className="w-4 h-4 text-primary" />
        Unggah Audio
      </label>

      {!audioUrl ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`upload-zone ${isDragging ? "active" : ""}`}
        >
          <input
            type="file"
            accept=".wav,.mp3,audio/wav,audio/mpeg"
            onChange={handleInputChange}
            className="hidden"
            id="audio-upload"
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  Klik atau seret audio ke sini
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Format: WAV, MP3
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

          <div className="flex items-center gap-4">
            <Button
              onClick={togglePlay}
              size="icon"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-500 hover:opacity-90"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
              )}
            </Button>

            <div className="flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Audio file ready
              </p>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="mt-4">
            <audio controls className="w-full h-10" src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;
