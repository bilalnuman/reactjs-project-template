"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { SignUpFormValue, SignUpSchema } from "@/formValidationSchemas";
import { transparentField } from "@/styles/resuableClasses";
import FormTitle from "./FormTitle";
import Link from "next/link";




export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValue>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange"
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit: (values: SignUpFormValue) => Promise<void> = async (values) => {
    console.log("Form Values:", values);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-default-50 p-6">
      <Card className="w-full max-w-xl shadow-xl">
        <FormTitle title="Forgot Password" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardBody className="grid gap-3">
            <Input
              type="email"
              label="Email"
              labelPlacement="outside"
              placeholder="ada@example.com"
              variant="faded"
              size="lg"
              radius="lg"
              autoComplete="email"
              {...transparentField}
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
            />
            <div className="flex items-center justify-end text-sm gap-4 pt-2">
              <Link href="/login" className=" underline text-blue-700">Back</Link>
              <Link href="/reset-password" className=" underline text-blue-700">Reset Password</Link>
            </div>
          </CardBody>
          <CardFooter className="flex flex-col sm:flex-row items-stretch gap-3">
            <Button type="submit" color="primary" size="lg" className="w-full" isDisabled={!isValid} isLoading={isSubmitting}>
              Submit
            </Button>
            <Button
              type="button"
              variant="flat"
              size="lg"
              className="w-full"
              onPress={() => {
                reset();
              }}
            >
              Reset
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
