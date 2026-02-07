import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const codeSnippets = [
  {
    title: "Upload a file",
    code: `const { data, error } = await supabase
  .storage
  .from('images')
  .upload('photo.png', file)`,
  },
  {
    title: "Get public URL",
    code: `const { data } = supabase
  .storage
  .from('images')
  .getPublicUrl('photo.png')`,
  },
  {
    title: "List all files",
    code: `const { data, error } = await supabase
  .storage
  .from('images')
  .list('', { limit: 100 })`,
  },
  {
    title: "Delete a file",
    code: `const { data, error } = await supabase
  .storage
  .from('images')
  .remove(['photo.png'])`,
  },
];

const CodeExample = () => {
  const [copied, setCopied] = useState<number | null>(null);

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">
            <span className="text-gradient-primary">API</span> Reference
          </h2>
          <p className="text-muted-foreground">
            Simple, intuitive methods for every storage operation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {codeSnippets.map((snippet, i) => (
            <motion.div
              key={snippet.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl overflow-hidden hover:border-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    {snippet.title}
                  </span>
                </div>
                <button
                  onClick={() => copyCode(snippet.code, i)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied === i ? (
                    <Check className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <pre className="p-4 text-sm font-mono text-foreground/90 overflow-x-auto">
                <code>{snippet.code}</code>
              </pre>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CodeExample;
