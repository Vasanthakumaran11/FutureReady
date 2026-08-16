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
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-foreground">
        {label}
      </Label>
      <Select {...(value ? { value } : {})} onValueChange={onChange}>
        <SelectTrigger id={id} className="h-9 rounded-sm border-border bg-surface text-sm">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72 border-border bg-surface shadow-raised">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="text-xs sm:text-sm cursor-pointer hover:bg-surface-hover"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint ? <p className="text-xs text-tertiary">{hint}</p> : null}
    </div>
  );
}

/** Multi-choice chip picker for list data (skills, preferred locations…). */
export function MultiSelectField({ label, values, onChange, options, hint }) {
  const toggle = (option) =>
    onChange(values.includes(option) ? values.filter((v) => v !== option) : [...values, option]);

  return (
    <fieldset className="space-y-1.5">
      <legend className="text-xs font-semibold text-foreground leading-none">{label}</legend>
      <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-sm border border-border bg-surface p-3">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 ease-out cursor-pointer",
                selected
                  ? "border border-accent/20 bg-accent-subtle text-accent font-semibold"
                  : "border border-border bg-surface-hover/70 text-muted-foreground hover:bg-surface-hover hover:text-foreground",
              )}
            >
              {selected ? <Check className="size-3" aria-hidden /> : null}
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {hint ? <p className="text-xs text-tertiary">{hint}</p> : null}
    </fieldset>
  );
}
