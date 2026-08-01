import { forwardRef } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium tracking-tight transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    {
        variants: {
            variant: {
                primary:
                    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80",
                outline:
                    "border border-border bg-transparent text-foreground hover:bg-foreground/[0.04]",
                ghost:
                    "bg-transparent text-foreground hover:bg-foreground/[0.06]",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                link:
                    "bg-transparent text-primary underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-8 px-3 text-[13px]",
                md: "h-10 px-4 text-sm",
                lg: "h-12 px-6 text-[15px]",
                icon: "h-10 w-10 p-0",
            },
        },
        compoundVariants: [
            {
                variant: "link",
                size: ["sm", "md", "lg", "icon"],
                class: "h-auto w-auto p-0",
            },
        ],
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {

    href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, href, children, ...props }, ref) => {
        const classes = cn(buttonVariants({ variant, size }), className);

        if (href) {
            const { disabled, type, ...linkProps } = props;
            return (
                <Link
                    href={href}
                    className={classes}
                    {...(linkProps as Omit<React.ComponentProps<typeof Link>, "href">)}
                >
                    {children}
                </Link>
            );
        }

        return (
            <button ref={ref} className={classes} {...props}>
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };