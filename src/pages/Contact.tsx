import { useState } from "react";
import { Send, Mail, Github, Linkedin, User, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Nama tidak boleh kosong").max(100, "Nama terlalu panjang"),
  email: z.string().trim().email("Format email tidak valid").max(255, "Email terlalu panjang"),
  message: z.string().trim().min(1, "Pesan tidak boleh kosong").max(1000, "Pesan terlalu panjang"),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; message?: string } = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field as keyof typeof fieldErrors] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    toast({
      title: "Pesan Terkirim!",
      description: "Terima kasih telah menghubungi kami. Kami akan segera membalas.",
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  const socialLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "contact@aidetector.id",
      href: "mailto:contact@aidetector.id",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/aidetector",
      href: "https://github.com/aidetector",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "AI Detector Team",
      href: "https://linkedin.com/company/aidetector",
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Hubungi <span className="gradient-text">Kami</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Punya pertanyaan atau saran? Kami senang mendengar dari Anda.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-card p-6 md:p-8 fade-in" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Kirim Pesan
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12 fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Terima Kasih!
                  </h3>
                  <p className="text-muted-foreground">
                    Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <User className="w-4 h-4 text-primary" />
                      Nama
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama Anda"
                      className="bg-secondary/50 border-border focus:border-primary h-12"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      className="bg-secondary/50 border-border focus:border-primary h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Pesan
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      className="bg-secondary/50 border-border focus:border-primary resize-none"
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full glow-button bg-gradient-to-r from-primary to-blue-500 text-primary-foreground hover:opacity-90 py-6 text-lg font-semibold rounded-xl"
                  >
                    {isSubmitting ? (
                      "Mengirim..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* About Section */}
              <div className="glass-card p-6 md:p-8 fade-in" style={{ animationDelay: "0.2s" }}>
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Tentang Kami
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  AI Content Detector adalah platform yang dikembangkan untuk membantu 
                  mendeteksi konten yang dihasilkan oleh AI. Tim kami terdiri dari 
                  para ahli di bidang machine learning dan keamanan digital yang 
                  berkomitmen untuk menciptakan internet yang lebih aman dan transparan.
                </p>
              </div>

              {/* Social Links */}
              <div className="glass-card p-6 md:p-8 fade-in" style={{ animationDelay: "0.3s" }}>
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  Informasi Kontak
                </h2>
                <div className="space-y-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <link.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{link.label}</p>
                        <p className="text-foreground font-medium">{link.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Info */}
              <div className="glass-card p-6 md:p-8 fade-in" style={{ animationDelay: "0.4s" }}>
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Jam Operasional
                </h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>Senin - Jumat: 09:00 - 18:00 WIB</p>
                  <p>Sabtu: 09:00 - 14:00 WIB</p>
                  <p>Minggu: Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
          © 2025 AI Content Detector. Dibuat oleh 22670117 untuk Proyek Akhir NLP dan Computer Vision.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
