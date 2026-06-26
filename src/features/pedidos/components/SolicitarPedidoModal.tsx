import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { estoqueService } from "@/features/estoque/services/estoqueService";
import { useSolicitarPedido } from "@/features/pedidos/hooks/useSolicitarPedido";
import {
  solicitarPedidoSchema,
  type SolicitarPedidoFormValues,
} from "@/features/pedidos/schemas/solicitarPedido.schema";

interface SolicitarPedidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SolicitarPedidoModal({
  open,
  onOpenChange,
}: SolicitarPedidoModalProps) {
  const { mutate: solicitar, isPending } = useSolicitarPedido();

  const { data: pisos = [], isLoading: carregandoPisos } = useQuery({
    queryKey: ["estoque", "pedidos-modal"],
    queryFn: () =>
      estoqueService.consultarEstoque({
        tipoPiso: [],
        marca: [],
        nivelResistencia: [],
        ambiente: [],
        acabamento: [],
      }),
    enabled: open,
  });

  const form = useForm<SolicitarPedidoFormValues>({
    resolver: zodResolver(solicitarPedidoSchema),
    defaultValues: {
      itens: [{ idPiso: 0, quantidade: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({ itens: [{ idPiso: 0, quantidade: 1 }] });
    }
    onOpenChange(nextOpen);
  }

  function onSubmit(values: SolicitarPedidoFormValues) {
    solicitar(
      { itens: values.itens },
      {
        onSuccess: () => handleClose(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Solicitar novo pedido</DialogTitle>
          <DialogDescription>
            Informe os pisos e quantidades desejadas. Se houver estoque
            suficiente, o pedido será aprovado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name={`itens.${index}.idPiso`}
                  render={({ field: pisoField }) => (
                    <FormItem className="flex-1">
                      {index === 0 && <FormLabel>Piso</FormLabel>}
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                          value={pisoField.value || ""}
                          disabled={carregandoPisos}
                          onChange={(e) =>
                            pisoField.onChange(Number(e.target.value))
                          }
                        >
                          <option value="">Selecione um piso</option>
                          {pisos.map((piso) => (
                            <option key={piso.idPiso} value={piso.idPiso}>
                              {piso.nome} — estoque: {piso.quantidadeDisponivel}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`itens.${index}.quantidade`}
                  render={({ field: qtdField }) => (
                    <FormItem className="w-28">
                      {index === 0 && <FormLabel>Qtd.</FormLabel>}
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...qtdField}
                          onChange={(e) =>
                            qtdField.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={index === 0 ? "mt-6" : "mt-0"}
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  aria-label="Remover item"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ idPiso: 0, quantidade: 1 })}
            >
              <Plus className="size-4" />
              Adicionar item
            </Button>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending || carregandoPisos}>
                {isPending ? "Enviando…" : "Solicitar pedido"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
