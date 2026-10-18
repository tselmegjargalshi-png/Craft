import type { FormLabels } from "@/components/QuoteForm";
import type { T } from "./i18n";
import { BUDGETS } from "./validators";

export function formLabels(t: T): FormLabels {
  return {
    name: t("form.name"), email: t("form.email"), whatsapp: t("form.whatsapp"), whatsappHint: t("form.whatsappHint"),
    service: t("form.service"), servicePlaceholder: t("form.servicePlaceholder"), budget: t("form.budget"),
    budgetPlaceholder: t("form.budgetPlaceholder"), message: t("form.message"), messageHint: t("form.messageHint"),
    package: t("form.package"), submit: t("form.submit"), sending: t("form.sending"), success: t("form.success"),
    successTitle: t("form.successTitle"), another: t("form.another"), error: t("form.error"), rate: t("form.rate"),
    invalid: t("form.invalid"), errName: t("form.err.name"), errEmail: t("form.err.email"),
    errWhatsapp: t("form.err.whatsapp"), errMessage: t("form.err.message"),
    budgets: BUDGETS.map((b) => ({ value: b, label: t(`form.budget.${b}`) })),
  };
}
