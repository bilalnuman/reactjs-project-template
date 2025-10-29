"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter } from "@heroui/react";
import { UpdatePasswordSchema, UpdatePasswordFormValue } from "@/formValidationSchemas";
import FormTitle from "./FormTitle";
import { PasswordField } from "./PasswordField";

export default function ResetPasswordForm() {
  const methods = useForm<UpdatePasswordFormValue>({
    resolver: zodResolver(UpdatePasswordSchema),
    mode: "all",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (values: UpdatePasswordFormValue) => {
    console.log("Form Values:", values);
    reset();
  };

  const token = ""

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-default-50 p-6">
      <Card className="w-full max-w-xl shadow-xl">
        <FormTitle title={token ? "Reset Password" : "Update Password"} />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardBody className="grid gap-3">
              {!token &&
                <PasswordField
                  placeholder="Enter Old Password"
                  fieldName="oldPassword"
                  label="Old Password"
                />
              }
              <PasswordField />
              <PasswordField
                fieldName="confirmPassword"
                placeholder="Enter Confirm Password"
                label="Confirm Password"
              />
            </CardBody>
            <CardFooter className="flex flex-col sm:flex-row items-stretch gap-3">

              <Button type="submit" color="primary" size="lg" className="w-full" isDisabled={!isValid} isLoading={isSubmitting}>
                {token ? "Reset Password" : "Update Password"}
              </Button>
              <Button type="button" variant="flat" size="lg" className="w-full" onPress={() => reset()}>
                Reset
              </Button>
            </CardFooter>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
