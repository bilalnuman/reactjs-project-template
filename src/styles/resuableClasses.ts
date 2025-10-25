export const inputLikeWrapper = "w-full min-h-[44px] hover:border-default-400 rounded-large border-2 border-default-200 px-3 py-2 bg-transparent";

export const transparentField = {
  classNames: {
    inputWrapper: "bg-transparent data-[hover=true]:bg-transparent",
    innerWrapper: "bg-transparent",
    input: "bg-transparent placeholder:text-default-400",
    trigger: "bg-transparent data-[hover=true]:bg-transparent",
    value: "bg-transparent",
  },
} as const;