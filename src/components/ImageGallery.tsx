import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ExternalLink, Copy, Image as ImageIcon, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StorageImage {
  name: string;
  url: string;
  created_at: string;
  size: number;
}

interface ImageGalleryProps {
  refreshKey: number;
}

const ImageGallery = ({ refreshKey }: ImageGalleryProps) => {
  const [images, setImages] = useState<StorageImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from("images").list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

      if (error) throw error;

      const imageFiles = (data || []).filter(
        (file) => file.name !== ".emptyFolderPlaceholder"
      );

      const mapped: StorageImage[] = imageFiles.map((file) => {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: urlData.publicUrl,
          created_at: file.created_at || "",
          size: file.metadata?.size || 0,
        };
      });

      setImages(mapped);
    } catch (error: any) {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [refreshKey]);

  const deleteImage = async (name: string) => {
    setDeleting(name);
    try {
      const { error } = await supabase.storage.from("images").remove([name]);
      if (error) throw error;
      setImages((prev) => prev.filter((img) => img.name !== name));
      toast.success("Image deleted");
    } catch (error: any) {
      toast.error("Failed to delete image");
    } finally {
      setDeleting(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              <span className="text-gradient-primary">Gallery</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              supabase.storage.from('images').list()
            </p>
          </div>
          <button
            onClick={fetchImages}
            className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-xl p-16 text-center"
          >
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-semibold text-lg">No images yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              Upload your first image to see it here
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass rounded-xl h-64 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {images.map((image, i) => (
              <motion.div
                key={image.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl overflow-hidden group hover:border-glow transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay actions */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyUrl(image.url)}
                        className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-3.5 h-3.5 text-foreground" />
                      </button>
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary/20 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-foreground" />
                      </a>
                    </div>
                    <button
                      onClick={() => deleteImage(image.name)}
                      disabled={deleting === image.name}
                      className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>

                {/* File info */}
                <div className="p-3">
                  <p className="text-xs font-mono text-muted-foreground truncate">
                    {image.name}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatSize(image.size)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
};

export default ImageGallery;
