import supabaseLogo from "@/assets/supabase-logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="container mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <img src={supabaseLogo} alt="Supabase" className="w-6 h-6" />
          <span className="text-sm text-muted-foreground font-mono">
            Built with Supabase Storage
          </span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          An open source alternative to Amazon S3
        </p>
      </div>
    </footer>
  );
};

export default Footer;
