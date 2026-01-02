import { useState } from "react";
import { Scan, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import AudioUpload from "@/components/AudioUpload";
import ResultCard from "@/components/ResultCard";
import axios from "axios";

interface ResultData {
  label: "AI-generated" | "Human-generated";
  confidence: number;
  imageScore?: number;
  audioScore?: number;
  finalScore?: number;
}

const Detection = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [detectionType, setDetectionType] = useState<"image" | "audio" | "multimodal" | null>(null);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleDetection = async () => {
    if (!imageFile && !audioFile) {
      toast({
        title: "Peringatan",
        description: "Silakan unggah gambar atau audio terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      let endpoint = "";

      if (imageFile && audioFile) {
        formData.append("image", imageFile);
        formData.append("audio", audioFile);
        endpoint = "/predict/multimodal";
        setDetectionType("multimodal");
      } else if (imageFile) {
        formData.append("image", imageFile);
        endpoint = "/predict/image";
        setDetectionType("image");
      } else if (audioFile) {
        formData.append("audio", audioFile);
        endpoint = "/predict/audio";
        setDetectionType("audio");
      }

      const response = await axios.post(`${API_URL}${endpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle response based on detection type
      if (imageFile && audioFile) {
        setResult({
          label: response.data.label || (response.data.final_score > 50 ? "AI-generated" : "Human-generated"),
          confidence: response.data.confidence || response.data.final_score || 0,
          imageScore: response.data.image_score || 0,
          audioScore: response.data.audio_score || 0,
          finalScore: response.data.final_score || 0,
        });
      } else {
        setResult({
          label: response.data.label || (response.data.confidence > 50 ? "AI-generated" : "Human-generated"),
          confidence: response.data.confidence || 0,
        });
      }

      toast({
        title: "Deteksi Berhasil",
        description: "Hasil analisis telah tersedia.",
      });
    } catch (error) {
      console.error("Detection error:", error);
      
      // Demo mode: show simulated results when API is unavailable
      const isAI = Math.random() > 0.5;
      const confidence = 65 + Math.random() * 30;
      
      if (imageFile && audioFile) {
        const imageScore = 60 + Math.random() * 35;
        const audioScore = 55 + Math.random() * 40;
        const finalScore = (imageScore + audioScore) / 2;
        
        setResult({
          label: finalScore > 50 ? "AI-generated" : "Human-generated",
          confidence: finalScore,
          imageScore,
          audioScore,
          finalScore,
        });
      } else {
        setResult({
          label: isAI ? "AI-generated" : "Human-generated",
          confidence,
        });
      }

      toast({
        title: "Mode Demo",
        description: "Menggunakan hasil simulasi (API tidak tersedia).",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDetection = () => {
    setImageFile(null);
    setAudioFile(null);
    setResult(null);
    setDetectionType(null);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-1/3 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Detection Engine</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            <span className="gradient-text">Deteksi</span> Konten
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Unggah gambar dan/atau audio untuk mendeteksi apakah konten dibuat oleh AI atau manusia.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Upload Section */}
          <div className="glass-card p-6 md:p-8 mb-8 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ImageUpload onFileSelect={setImageFile} selectedFile={imageFile} />
              <AudioUpload onFileSelect={setAudioFile} selectedFile={audioFile} />
            </div>

            {/* Detection Info */}
            {(imageFile || audioFile) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 mb-6 fade-in">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  {imageFile && audioFile
                    ? "Mode: Deteksi Multimodal (Gambar + Audio)"
                    : imageFile
                    ? "Mode: Deteksi Gambar"
                    : "Mode: Deteksi Audio"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDetection}
                disabled={(!imageFile && !audioFile) || isLoading}
                className="flex-1 glow-button bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 py-6 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-2" />
                    Deteksi Sekarang
                  </>
                )}
              </Button>

              {(imageFile || audioFile) && (
                <Button
                  onClick={resetDetection}
                  variant="outline"
                  className="py-6 text-lg rounded-xl border-border hover:bg-secondary"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="glass-card p-12 text-center fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Menganalisis Konten...
              </h3>
              <p className="text-muted-foreground">
                Mohon tunggu, kami sedang memproses file Anda.
              </p>
            </div>
          )}

          {/* Results */}
          {result && detectionType && !isLoading && (
            <div className="fade-in" style={{ animationDelay: "0.2s" }}>
              <ResultCard result={result} type={detectionType} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detection;
