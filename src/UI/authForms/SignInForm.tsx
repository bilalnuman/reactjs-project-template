"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
  Card,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { SignUpFormValue, SignUpSchema } from "@/formValidationSchemas";
import { transparentField } from "@/styles/resuableClasses";
import FormTitle from "./FormTitle";
import Link from "next/link";




export default function SignInForm() {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValue>({
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "",
      terms: false,
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit: (values: SignUpFormValue) => Promise<void> = async (values) => {
    console.log("Form Values:", values);
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-default-50 p-6">
      <Card className="w-full max-w-xl shadow-xl">
        <FormTitle title="Sign In" />

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
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
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
              {...register("password")}
              isInvalid={!!errors.password}
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
            <Button type="submit" color="primary" size="lg" className="w-full" isDisabled={!isValid} isLoading={isSubmitting}>
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
      </Card>
    </div>
  );
}
