import { toast } from "@/hooks/use-toast";

export const callToast = (
  title: string,
  description: string,
  variant: "default" | "destructive" | null | undefined
) => {
  toast({
    title: title,
    description: description,
    variant: variant,
  });
};
