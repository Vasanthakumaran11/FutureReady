import { Check } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Single-choice dropdown for general profile data (location, degree, year…). */
export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select {...(value ? { value } : {})} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-10 rounded-sm border-border">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint ? <p className="text-xs text-tertiary-foreground">{hint}</p> : null}
    </div>
  );
}

/** Multi-choice chip picker for list data (skills, preferred locations…). */
export function MultiSelectField({
  label,
  values,
  onChange,
  options,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: readonly string[];
  hint?: string;
}) {
  const toggle = (option: string) =>
    onChange(values.includes(option) ? values.filter((v) => v !== option) : [...values, option]);

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium leading-none">{label}</legend>
      <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-sm border border-border bg-surface-raised p-3">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option)}
              className={cn(
                "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors duration-150",
                selected
                  ? "bg-primary-soft text-primary"
                  : "border border-border text-muted-foreground hover:bg-surface",
              )}
            >
              {selected ? <Check className="size-3" aria-hidden /> : null}
              {option}
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-xs text-tertiary-foreground">{hint}</p> : null}
    </fieldset>
  );
}
