import { fieldClass } from "./formDisplay";

/**
 * The look of the programme, Student Chapter and dues sign-ups: the LMS forms'
 * fields (16px text, the brand line drawn in from the left when active), with
 * labels in plain sentence case at a size people can read without squinting.
 */
export const fieldCls = fieldClass;

export const labelCls = "mb-1 block text-[15px] font-semibold text-[var(--color-text-primary)]";

export const optionalCls = "ml-1.5 text-sm font-normal text-[var(--color-text-muted)]";

/** A textarea that grows with what is typed, so its line sits under the words. */
export const growingTextCls = `${fieldClass} resize-none [field-sizing:content] min-h-[44px] max-h-60`;
