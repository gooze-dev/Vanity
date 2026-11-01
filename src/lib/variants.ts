// Class recipes shared by the UI components. Tailwind classes live here so the
// .astro components stay small.
import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-[15px] leading-none font-medium whitespace-nowrap transition-colors select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary font-semibold text-primary-foreground hover:bg-primary/85",
        outline:
          "border-input bg-transparent text-foreground hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive text-status-error-foreground hover:bg-destructive/85",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Tags (default, secondary, outline) are the pill from IntegrationCard; killed,
// survived, error and neutral are the StatusBadge, spelled as the CLI prints them.
export const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent whitespace-nowrap has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "h-[22px] rounded-full bg-highlight px-2 text-xs font-medium text-highlight-foreground",
        secondary: "h-[22px] rounded-full bg-secondary px-2 text-xs font-medium text-secondary-foreground",
        destructive: "h-[22px] rounded-full bg-destructive px-2 text-xs font-medium text-status-error-foreground",
        outline: "h-[22px] rounded-full border-input px-2 text-xs font-medium text-foreground",
        killed: "h-6 rounded-sm bg-status-killed px-2 font-mono text-[13px] font-semibold text-status-killed-foreground",
        survived: "h-6 rounded-sm bg-status-survived px-2 font-mono text-[13px] font-semibold text-status-survived-foreground",
        error: "h-6 rounded-sm bg-status-error px-2 font-mono text-[13px] font-semibold text-status-error-foreground",
        neutral: "h-6 rounded-sm bg-status-neutral px-2 font-mono text-[13px] font-medium text-status-neutral-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-md border bg-card p-4 text-left text-[15px] text-card-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[20px_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:mt-0.5 *:[svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "*:[svg]:text-accent",
        destructive: "*:[svg]:text-status-survived",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 [a]:transition-colors [a]:hover:border-input",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-3.5 px-4 py-3.5",
        sm: "gap-3.5 px-3.5 py-3",
        xs: "gap-2.5 px-3 py-2.5 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const sidebarMenuButtonVariants = cva(
  "peer/menu-button group/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md px-3 py-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "border border-sidebar-border bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      },
      size: {
        default: "h-9 text-sm",
        sm: "h-8 text-xs",
        lg: "h-14 px-3 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const codeBlockVariants = cva(
  "gz-island group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-md text-sm has-[>[data-slot=code-block-content]:focus-visible]:outline-2 has-[>[data-slot=code-block-content]:focus-visible]:outline-offset-2 has-[>[data-slot=code-block-content]:focus-visible]:outline-ring data-[size=sm]:text-[13px]",
  {
    variants: {
      variant: {
        default: "",
        destructive: "text-status-error",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

