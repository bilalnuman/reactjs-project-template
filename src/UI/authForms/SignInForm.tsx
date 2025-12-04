"use client";
import React, { useEffect } from "react";
import { Controller, FormProvider } from "react-hook-form";
import {
  Checkbox,
  Button,
  Card,
  CardBody,
  CardFooter
} from "@heroui/react";
import FormTitle from "./FormTitle";
import Link from "next/link";
import { useApiGet, useApiMutation } from "@/hooks/apiService";
import { LoginInFormValue, LoginInSchema } from "@/formValidationSchemas";
import { ROUTES } from "@/lib/routes";
import { PasswordField } from "./PasswordField";
import { EmailField } from "../components/EmailField";
import { useAppStore } from "@/app/store/useAppStore";
import { selectCurrentUser, selectSetCurrentUser } from "@/app/store/selectors";
import { useRHF } from "@/hooks/RHF";
const { method, url } = ROUTES.login
export default function SignInForm() {
  const setCurrentUser = useAppStore(selectSetCurrentUser);
  const user = useAppStore(selectCurrentUser);
  const { mutateAsync: login, isPending, isSuccess } = useApiMutation(method, url);
  const { data: me, isLoading } = useApiGet<any>({ url: ROUTES.me, enabled: isSuccess });
  const methods = useRHF({ schema: LoginInSchema });
  console.log(me)

  const { handleSubmit, control, reset, formState: { errors, isValid } } = methods;

  const onSubmit: (values: LoginInFormValue) => Promise<void> = async (values) => {
    await login({ body: values });
    reset();
  };

  useEffect(() => {
    if (me?.data) {
      setCurrentUser(me.data)
    }
  }, [isLoading, me])

  return (
    <div className="min-h-screen flex items-center justify-center from-background to-default-50 p-6">
      <Card className="w-full max-w-xl shadow-xl">
        <FormTitle title="Sign In" />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardBody className="grid gap-3">
              <EmailField
                errorMessage={errors.email?.message}
              />
              <PasswordField
                errorMessage={errors.password?.message}
              />
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Controller
                    name="terms"
                    control={control}
                    render={({ field }) => (
                      <Checkbox isSelected={field.value} onValueChange={field.onChange} radius="md">
                        I agree to the{" "}
                        <a className="underline" href="#" onClick={(e) => e.preventDefault()}>
                          Terms
                        </a>
                      </Checkbox>
                    )}
                  />
                  <div className="flex items-center justify-end text-sm gap-1">
                    <span>Have an account?</span>
                    <Link href="/" className=" underline text-blue-700">Sign Up</Link>
                  </div>
                </div>
                {errors.terms && <p className="text-xs text-danger-500">{errors.terms.message}</p>}
                <div className="flex items-center justify-end text-sm gap-1 pt-2">
                  <Link href="/forgot-password" className=" underline text-blue-700">Forgot Password?</Link>
                </div>
              </div>

            </CardBody>
            <CardFooter className="flex flex-col sm:flex-row items-stretch gap-3">
              <Button type="submit" color="primary" size="lg" className="w-full" isLoading={isPending} isDisabled={!isValid}>
                Login
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
        </FormProvider>
      </Card>
    </div>
  );
}
