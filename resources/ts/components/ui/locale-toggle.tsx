import { Button } from "@/ts/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/ts/components/ui/tooltip";
import { useTranslation } from "@/ts/presentation/i18n/useTranslation";
import { router } from "@inertiajs/react";
import { Languages } from "lucide-react";
import { useRoute } from "ziggy-js";

type Props = {
  className?: string;
};

/**
 * Toggles between English and Vietnamese UI locale.
 */
export const LocaleToggle = ({ className }: Props): React.ReactElement => {
  const route = useRoute();
  const { t, locale } = useTranslation();
  const nextLocale = locale === "en" ? "vi" : "en";
  const nextLabel = nextLocale.toUpperCase();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={className ?? "cursor-pointer gap-1.5"}
          aria-label={t("locale.switch_to", { locale: nextLabel })}
          onClick={() =>
            router.post(
              route("locale.update"),
              { locale: nextLocale },
              { preserveScroll: true },
            )
          }
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-medium tabular-nums">{locale.toUpperCase()}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {t("locale.switch_to", { locale: nextLabel })}
      </TooltipContent>
    </Tooltip>
  );
};

export default LocaleToggle;
