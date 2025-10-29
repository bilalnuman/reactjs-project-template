"use client";

import { useForm, type UseFormReturn, type Mode } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type UseRHFProps<TSchema extends z.ZodTypeAny> = {
    schema: TSchema;
    defaultValues?: Partial<z.infer<TSchema>>;
    mode?: Mode;
};
export function useRHF<TSchema extends z.ZodTypeAny>({
    schema,
    defaultValues,
    mode = "onChange",
}: UseRHFProps<TSchema>): UseFormReturn<z.infer<TSchema>> {
    return useForm<z.infer<TSchema>>({
        resolver: zodResolver(schema),
        mode,
        defaultValues: defaultValues as z.infer<TSchema> | undefined,
    });
}
