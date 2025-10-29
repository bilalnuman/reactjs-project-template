"use client";
import { Button, Input } from "@heroui/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { transparentField } from "@/styles/resuableClasses";

type Props = Omit<React.ComponentProps<typeof Input>, "type" | "name" | "isInvalid" | "errorMessage"> & {
  fieldName?: string;
  errorMessage?: string;
  label?: string
};

export const PasswordField: React.FC<Props> = ({ fieldName = "password", label = "Password", errorMessage, ...rest }) => {
  const methods = useFormContext();
  if (!methods) {
    throw new Error("PasswordField must be used within a FormProvider");
  }

  const { register, getFieldState } = methods;
  const { error } = getFieldState(fieldName);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      type={showPassword ? "text" : "password"}
      label={label}
      labelPlacement="outside"
      placeholder="Enter a strong password"
      variant="faded"
      size="lg"
      radius="lg"
      {...transparentField}
      endContent={
        <Button
          isIconOnly
          variant="light"
          radius="full"
          size="sm"
          aria-label={showPassword ? "Hide password" : "Show password"}
          type="button"
          onPress={() => setShowPassword((v) => !v)}
        >
          {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
        </Button>
      }
      autoComplete="new-password"
      {...rest}
      {...register(fieldName)}
      isInvalid={!!(error || errorMessage)}
      errorMessage={(errorMessage ?? error?.message) as string}
    />
  );
};
