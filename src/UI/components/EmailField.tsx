"use client";
import { Input } from "@heroui/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { transparentField } from "@/styles/resuableClasses";

type Props = Omit<
    React.ComponentProps<typeof Input>,
    "type" | "name" | "isInvalid" | "errorMessage"
> & {
    fieldName?: string;
    errorMessage?: string;
    label?: string;
};

export const EmailField: React.FC<Props> = ({
    fieldName = "email",
    label = "Email",
    errorMessage,
    ...rest
}) => {
    const methods = useFormContext();
    if (!methods) {
        throw new Error("EmailField must be used within a FormProvider");
    }

    const { register, getFieldState } = methods;
    const { error } = getFieldState(fieldName);

    return (
        <Input
            type="email"
            label={label}
            labelPlacement="outside"
            placeholder="you@example.com"
            variant="faded"
            size="lg"
            radius="lg"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck="false"
            {...transparentField}
            {...rest}
            {...register(fieldName)}
            isInvalid={!!(error || errorMessage)}
            errorMessage={(errorMessage ?? error?.message) as string}
        />
    );
};
