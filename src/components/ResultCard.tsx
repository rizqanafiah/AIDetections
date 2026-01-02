import { Bot, User, Image as ImageIcon, Music, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultData {
  label: "AI-generated" | "Human-generated";
  confidence: number;
  imageScore?: number;
  audioScore?: number;
  finalScore?: number;
}

interface ResultCardProps {
  result: ResultData;
  type: "image" | "audio" | "multimodal";
}

const ResultCard = ({ result, type }: ResultCardProps) => {
  const isAI = result.label === "AI-generated";

  const getIcon = () => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "audio":
        return Music;
      case "multimodal":
        return Layers;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "image":
        return "Deteksi Gambar";
      case "audio":
        return "Deteksi Audio";
      case "multimodal":
        return "Deteksi Multimodal";
    }
  };

  const Icon = getIcon();

  return (
    <div className="glass-card p-6 fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{getTypeLabel()}</h3>
      </div>

      {/* Main Result */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isAI ? "bg-destructive/20" : "bg-green-500/20"
            }`}
          >
            {isAI ? (
              <Bot className={`w-6 h-6 text-destructive`} />
            ) : (
              <User className={`w-6 h-6 text-green-400`} />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hasil Prediksi</p>
            <p className={`text-xl font-bold ${isAI ? "text-destructive" : "text-green-400"}`}>
              {result.label}
            </p>
          </div>
        </div>

        <div className={`result-badge ${isAI ? "ai" : "human"}`}>
          {isAI ? "AI Generated" : "Human Made"}
        </div>
      </div>

      {/* Confidence Score */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Confidence Score</span>
            <span className="text-sm font-semibold text-foreground">
              {result.confidence.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                isAI
                  ? "bg-gradient-to-r from-destructive to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-400"
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {/* Multimodal Scores */}
        {type === "multimodal" && (
          <>
            {result.imageScore !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Skor Gambar
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {result.imageScore.toFixed(1)}%
                  </span>
                </div>
                <Progress value={result.imageScore} className="h-2" />
              </div>
            )}

            {result.audioScore !== undefined && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Skor Audio
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {result.audioScore.toFixed(1)}%
                  </span>
                </div>
                <Progress value={result.audioScore} className="h-2" />
              </div>
            )}

            {result.finalScore !== undefined && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Skor Akhir
                  </span>
                  <span className="text-lg font-bold gradient-text">
                    {result.finalScore.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-4 bg-secondary rounded-full overflow-hidden progress-glow">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-1000"
                    style={{ width: `${result.finalScore}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
