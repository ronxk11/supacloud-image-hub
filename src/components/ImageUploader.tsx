import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, X, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadComplete: () => void;
}

const ImageUploader = ({ onUploadComplete }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else {
      toast.error("Please drop an image file");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(uniqueName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      toast.success("Image uploaded successfully!");
      onUploadComplete();
      setSelectedFile(null);
      
      // Reset after a short delay
      setTimeout(() => {
        setPreview(null);
        setFileName("");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
      setPreview(null);
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setFileName("");
    setSelectedFile(null);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-gradient-primary">Upload</span> Your Images
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            supabase.storage.from('images').upload()
          </p>
        </div>

        {/* Upload Zone */}
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden
            ${isDragging ? "drop-zone-active border-primary" : "border-border hover:border-primary/40"}
            ${preview ? "p-4" : "p-12"}
          `}
          whileHover={{ scale: preview ? 1 : 1.01 }}
        >
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <span className="text-sm font-mono text-foreground">Uploading...</span>
                    </div>
                  </div>
                )}
                {!uploading && !selectedFile && (
                  <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                      <span className="text-sm font-mono text-foreground">Uploaded!</span>
                    </div>
                  </div>
                )}
                {!uploading && (
                  <button
                    onClick={clearPreview}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                )}
                <p className="mt-3 text-sm text-muted-foreground font-mono truncate text-center">
                  {fileName}
                </p>
                {selectedFile && !uploading && (
                  <button
                    onClick={handleUpload}
                    className="mt-3 w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.label
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
                  {isDragging ? (
                    <ImageIcon className="w-7 h-7 text-primary" />
                  ) : (
                    <Upload className="w-7 h-7 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-foreground font-semibold">
                    {isDragging ? "Drop your image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PNG, JPG, GIF, WebP up to 50MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </motion.label>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ImageUploader;
