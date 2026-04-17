export const clsx = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(' ')
