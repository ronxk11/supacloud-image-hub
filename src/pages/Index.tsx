import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import ImageUploader from "@/components/ImageUploader";
import ImageGallery from "@/components/ImageGallery";
import CodeExample from "@/components/CodeExample";
import Footer from "@/components/Footer";
import supabaseLogo from "@/assets/supabase-logo.png";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ImageUploader onUploadComplete={handleUploadComplete} />
      <ImageGallery refreshKey={refreshKey} />
      <CodeExample />
      <Footer />
    </div>
  );
};

export default Index;
