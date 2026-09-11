import { useEffect } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";

export function AppToast() {
  const { toast, fecharToast } = useStore();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(fecharToast, 3000);
    return () => window.clearTimeout(timer);
  }, [toast, fecharToast]);

  if (!toast) return null;

  return (
    <button
      type="button"
      onClick={fecharToast}
      className="fixed left-4 right-4 top-4 z-[100] mx-auto flex max-w-md items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary px-4 py-3 text-left text-sm font-medium text-primary-foreground shadow-lg transition-opacity hover:opacity-95"
      aria-label="Fechar aviso"
    >
      <span>{toast.message}</span>
      <X className="size-4 shrink-0" aria-hidden="true" />
    </button>
  );
}