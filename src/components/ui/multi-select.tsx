import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { OpcaoFiltro } from "@/features/estoque/types/estoque.types";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  label: string;
  options: OpcaoFiltro[];
  value: number[];
  onChange: (value: number[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  disabled = false,
}: MultiSelectProps) {
  const selectedLabels = options
    .filter((option) => value.includes(option.chave))
    .map((option) => option.descricao);

  const toggleOption = (chave: number) => {
    if (value.includes(chave)) {
      onChange(value.filter((item) => item !== chave));
      return;
    }

    onChange([...value, chave]);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "h-9 w-full justify-between font-normal",
              value.length === 0 && "text-muted-foreground",
            )}
          >
            <span className="truncate">
              {value.length === 0
                ? placeholder
                : selectedLabels.length <= 2
                  ? selectedLabels.join(", ")
                  : `${selectedLabels.length} selecionados`}
            </span>
            <div className="flex shrink-0 items-center gap-1">
              {value.length > 0 && (
                <Badge variant="secondary" className="rounded-sm px-1.5">
                  {value.length}
                </Badge>
              )}
              <ChevronDownIcon className="size-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
          {options.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              Nenhuma opção disponível.
            </p>
          ) : (
            <div className="max-h-60 space-y-1 overflow-y-auto">
              {options.map((option) => {
                const checked = value.includes(option.chave);

                return (
                  <label
                    key={option.chave}
                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleOption(option.chave)}
                    />
                    <span className="truncate">{option.descricao}</span>
                  </label>
                );
              })}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
