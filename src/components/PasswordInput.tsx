import { Eye, EyeOff } from "lucide-react";
import { useState, type ChangeEventHandler } from "react";
import { Input } from "@/components/ui/input";

export function PasswordInput({
  id,
  value,
  onChange,
  required = false,
}: {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visivel ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {visivel ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
