import { Link } from "react-router-dom";
import { ArrowRight, Image, Music, Layers, Shield, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const features = [
    {
      icon: Image,
      title: "Deteksi Gambar AI",
      description:
        "Analisis gambar untuk menentukan apakah dibuat oleh AI atau manusia dengan akurasi tinggi.",
    },
    {
      icon: Music,
      title: "Deteksi Suara AI",
      description:
        "Identifikasi audio sintetis yang dihasilkan oleh model AI text-to-speech atau voice cloning.",
    },
    {
      icon: Layers,
      title: "Analisis Multimodal",
      description:
        "Kombinasikan analisis gambar dan audio untuk deteksi konten deepfake yang lebih akurat.",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Data Anda diproses dengan aman dan tidak disimpan di server kami.",
    },
    {
      icon: Zap,
      title: "Hasil Instan",
      description: "Dapatkan hasil deteksi dalam hitungan detik dengan teknologi AI canggih.",
    },
    {
      icon: BarChart3,
      title: "Akurasi Tinggi",
      description: "Model terlatih dengan jutaan sampel untuk hasil prediksi yang andal.",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 fade-in">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Powered by Advanced AI Technology
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 fade-in" style={{ animationDelay: "0.1s" }}>
              <span className="text-foreground">Deteksi Konten</span>
              <br />
              <span className="gradient-text">Buatan AI</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Identifikasi gambar dan audio yang dihasilkan oleh AI dengan teknologi machine learning
              terdepan. Lindungi diri dari misinformasi dan konten deepfake.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/deteksi">
                <Button
                  size="lg"
                  className="glow-button bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Mulai Deteksi
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/kontak">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg rounded-xl border-border hover:bg-secondary"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fitur <span className="gradient-text">Unggulan</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform deteksi AI komprehensif dengan berbagai kemampuan analisis
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card-hover p-8 gradient-border fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mengapa <span className="gradient-text">Memilih Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Keunggulan teknologi deteksi AI yang membedakan kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="text-center p-8 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center mx-auto mb-6 pulse-glow">
                  <benefit.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Siap Mendeteksi <span className="gradient-text">Konten AI</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Mulai analisis gambar dan audio Anda sekarang. Gratis dan mudah digunakan.
            </p>
            <Link to="/deteksi">
              <Button
                size="lg"
                className="glow-button bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 px-8 py-6 text-lg font-semibold rounded-xl"
              >
                Coba Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 AI Content Detector. Dibuat oleh 22670117 untuk Proyek Akhir NLP dan Computer Vision.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
