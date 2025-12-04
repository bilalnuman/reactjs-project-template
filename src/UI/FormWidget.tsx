"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  RadioGroup,
  Radio,
  Chip,
  DatePicker,
  TimeInput,
} from "@heroui/react";
import { parseDate, parseTime } from "@internationalized/date";
import { FiBarChart, FiEye, FiEyeOff, FiHome, FiSettings } from "react-icons/fi";
import PhoneField from "./components/PhoneField";
import LocationField from "./components/LocationField";
import { schema } from "@/formValidationSchemas";
import MixedDropdown from "./components/MixedDropdown";
// import InfiniteSelect from "./components/InfiniteSelect";
import { transparentField } from "@/styles/resuableClasses";
import { FormValues } from "@/types";
import MultiDatesField from "./components/MultiDatesField";
import Pagination from "./components/Pagination";
import { SearchField } from "./components/SearchField";
import Sidebar from "./components/Sidebar";
import InfiniteSelect, { OPTION_TYPE } from "./components/InfiniteSelect";
import { ALL_OPTIONS } from "@/appData";

const items = [
  { label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, href: '/widgets' },
  {
    label: 'Reports',
    icon: <FiBarChart className="w-5 h-5" />,
    href: '#',
    childrens: [
      { label: 'Sales', href: '/reports/sales' },
      { label: 'Customers', href: '/reports/customers' },
    ],
  },
  { label: 'Settings', icon: <FiSettings className="w-5 h-5" />, href: '/settings' },
];


export default function FormWidget() {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "",
      skills: [],
      gender: "",
      bio: "",
      terms: false,
      dateSingle: "",
      timeOfDay: "",
      datesMultiple: [],
      infiniteSelect: "",
      mixedChoice: "",
      // Phone
      phone: "",
      // Location defaults
      country: null,
      state: null,
      city: null,
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [locationKey, setLocationKey] = React.useState(0); // forces remount of RCSC widgets when resetting

  const [options, setOptions] = React.useState<OPTION_TYPE[]>(ALL_OPTIONS.slice(0, 20));
  const [isLoading, setIsLoading] = React.useState(false);

  const loadMore = React.useCallback((page: number) => {
    console.log(page, Math.ceil(ALL_OPTIONS.length / 20));
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setOptions((prev) => ALL_OPTIONS.slice(0, Math.min(prev.length + 20, ALL_OPTIONS.length)));
      setIsLoading(false);
    }, 400);
  }, [isLoading]);

  const onSubmit: (values: FormValues) => Promise<void> = async (values) => {
    // Normalize to E.164-like number (keep + and digits only)
    const phoneE164 = values.phone ? values.phone.replace(/[^0-9+]/g, "") : null;

    const payload = {
      ...values,
      countryId: values.country?.id ?? null,
      stateId: values.state?.id ?? null,
      cityId: values.city?.id ?? null,
      phone: phoneE164,
    };
    console.log("Form Values:", payload);
    reset();
    setLocationKey((k) => k + 1);
  };

  // ----- Multiple dates via HeroUI Calendar -----
  const datesMultiple = watch("datesMultiple");

  // ----- Location selections -----
  const country = watch("country");
  const state = watch("state");
  const city = watch("city");

  return (
    <div>
      <Sidebar items={items} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-default-50 p-6">

        <Card className="w-full max-w-3xl shadow-xl">
          <Pagination totalPages={30} />
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
                <p className="text-sm text-default-500">HeroUI · React Hook Form · Zod · Tailwind</p>
              </div>
            </div>

          </CardHeader>
          <div className="px-4 my-5 w-full"><SearchField onSearch={(val) => console.log(val)} isDisabled={false} /></div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardBody className="grid gap-8">
              {/* --- Personal Info --- */}
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full name"
                    labelPlacement="outside"
                    placeholder="Ada Lovelace"
                    variant="faded"
                    size="lg"
                    radius="lg"
                    {...transparentField}
                    {...register("fullName")}
                    isInvalid={!!errors.fullName}
                    errorMessage={errors.fullName?.message}
                  />

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
                </div>
              </section>

              {/* --- Phone (separate component) --- */}
              <section>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneField
                      label="Phone (with country flag)"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.phone?.message as string}
                      defaultCountry="pk"
                    />
                  )}
                />
              </section>

              {/* --- Account Settings --- */}
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Role"
                        labelPlacement="outside"
                        placeholder="Select a role"
                        variant="faded"
                        size="lg"
                        radius="lg"
                        {...transparentField}
                        selectedKeys={field.value ? new Set([field.value]) : new Set<string>()}
                        onSelectionChange={(keys) => {
                          const key = Array.from(keys as Set<string>)[0] ?? "";
                          field.onChange(key);
                        }}
                        isInvalid={!!errors.role}
                        errorMessage={errors.role?.message}
                      >
                        <SelectItem key="developer">Developer</SelectItem>
                        <SelectItem key="designer">Designer</SelectItem>
                        <SelectItem key="product">Product Manager</SelectItem>
                      </Select>
                    )}
                  />
                </div>

                {/* Multi-select (HeroUI Select) */}
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Controller
                    name="skills"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Skills (multiple)"
                        labelPlacement="outside"
                        placeholder="Select one or more"
                        variant="faded"
                        size="lg"
                        radius="lg"
                        selectionMode="multiple"
                        {...transparentField}
                        selectedKeys={new Set(field.value)}
                        onSelectionChange={(keys) => {
                          const arr = Array.from(keys as Set<string>);
                          field.onChange(arr);
                        }}
                        isInvalid={!!errors.skills}
                        errorMessage={errors.skills?.message as string}
                        renderValue={(items) => {
                          if (items.length === 0) return <span className="text-default-400">Select one or more</span>;
                          return (
                            <div className="flex flex-wrap gap-2">
                              {items.map((item) => (
                                <Chip key={item.key} size="sm" variant="flat">
                                  {item.textValue}
                                </Chip>
                              ))}
                            </div>
                          );
                        }}
                      >
                        <SelectItem key="react">React</SelectItem>
                        <SelectItem key="node">Node.js</SelectItem>
                        <SelectItem key="design">Design</SelectItem>
                        <SelectItem key="pm">Product</SelectItem>
                        <SelectItem key="devops">DevOps</SelectItem>
                        <SelectItem key="testing">Testing</SelectItem>
                      </Select>
                    )}
                  />
                </div>
              </section>

              {/* --- About You --- */}
              <section>
                <Textarea
                  label="Short bio"
                  labelPlacement="outside"
                  placeholder="Tell us a little about yourself..."
                  variant="faded"
                  size="lg"
                  radius="lg"
                  minRows={4}
                  maxLength={300}
                  {...transparentField}
                  {...register("bio")}
                  isInvalid={!!errors.bio}
                  errorMessage={errors.bio?.message}
                />

                {/* Gender (Radio Group) */}
                <div className="mt-4">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        label="Gender"
                        orientation="horizontal"
                        classNames={{ label: "text-sm font-medium" }}
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                        <Radio value="other">Other</Radio>
                        <Radio value="prefer_not">Prefer not to say</Radio>
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && <p className="text-sm text-danger-500 mt-2">{errors.gender.message}</p>}
                </div>
              </section>

              {/* --- Date & Time (HeroUI) --- */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="dateSingle"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Date (single)"
                      labelPlacement="outside"
                      variant="faded"
                      size="lg"
                      radius="lg"
                      {...transparentField}
                      value={field.value ? parseDate(field.value) : null}
                      onChange={(v) => field.onChange(v ? v.toString() : "")}
                      isInvalid={!!errors.dateSingle}
                      errorMessage={errors.dateSingle?.message}
                    />
                  )}
                />

                <Controller
                  name="timeOfDay"
                  control={control}
                  render={({ field }) => (
                    <TimeInput
                      label="Time"
                      labelPlacement="outside"
                      variant="faded"
                      size="lg"
                      radius="lg"
                      {...transparentField}
                      value={field.value ? parseTime(field.value) : null}
                      onChange={(v) => field.onChange(v ? v.toString() : "")}
                      isInvalid={!!errors.timeOfDay}
                      errorMessage={errors.timeOfDay?.message}
                    />
                  )}
                />
              </section>
              <MultiDatesField
                values={datesMultiple}
                onChange={(next) => setValue("datesMultiple", next, { shouldValidate: true, shouldDirty: true })}
                error={errors.datesMultiple?.message as string}
              />

              {/* --- Infinite Scroll Select (HeroUI-only) --- */}
              <section className="infinite-scroll">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <InfiniteSelect
                      {...field}
                      label="Infinite Select"
                      placeholder="Start scrolling…"
                      options={options}
                      loadMore={loadMore}
                      isLoading={isLoading}
                      selectionMode="multiple"
                      totalPages={Math.ceil(ALL_OPTIONS.length / 20)}

                    />
                  )}
                />
              </section>

              {/* --- Location (single component) --- */}
              <section>
                <LocationField
                  country={country}
                  state={state}
                  city={city}
                  resetKey={locationKey}
                  onCountryChange={(c) => {
                    setValue("country", c, { shouldValidate: true, shouldDirty: true });
                    setValue("state", null, { shouldValidate: true, shouldDirty: true });
                    setValue("city", null, { shouldValidate: true, shouldDirty: true });
                  }}
                  onStateChange={(s) => {
                    setValue("state", s, { shouldValidate: true, shouldDirty: true });
                    setValue("city", null, { shouldValidate: true, shouldDirty: true });
                  }}
                  onCityChange={(ci) => setValue("city", ci, { shouldValidate: true, shouldDirty: true })}
                  errors={{
                    country: errors.country?.message as string,
                    state: errors.state?.message as string,
                    city: errors.city?.message as string,
                  }}
                />
              </section>

              {/* --- Mixed Dropdown --- */}
              <section>
                <Controller
                  name="mixedChoice"
                  control={control}
                  render={({ field }) => (
                    <MixedDropdown
                      label="Dropdown (mix of selectable & link)"
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
              </section>

              {/* --- Terms --- */}
              <section className="-mt-2">
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
                {errors.terms && <p className="text-sm text-danger-500 mt-2">{errors.terms.message}</p>}
              </section>
            </CardBody>

            <CardFooter className="flex flex-col sm:flex-row items-stretch gap-3">
              <Button type="submit" color="primary" size="lg" className="w-full" isLoading={isSubmitting}>
                Create account
              </Button>
              <Button
                type="button"
                variant="flat"
                size="lg"
                className="w-full"
                onPress={() => {
                  reset();
                  setLocationKey((k) => k + 1);
                }}
              >
                Reset
              </Button>

            </CardFooter>
          </form>
        </Card>
      </div>\</div>
  );
}
