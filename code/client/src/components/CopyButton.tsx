import { useState } from 'react';
import { Copy as CopyIcon } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Workshop } from '@/sharedTypes';
import { TOOLTIP_TIMEOUT } from '@/constants';
export const CopyButton = ({
  paymentLinkUrl,
  isChargesEnabled,
  event,
}: {
  paymentLinkUrl: string;
  isChargesEnabled: boolean;
  event: Workshop;
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const isWorkshopUnavailable = new Date(event.start) < new Date();
  const handleClick = () => {
    setTooltipOpen(true);
    if (isWorkshopUnavailable) {
      return setTimeout(() => setTooltipOpen(false), TOOLTIP_TIMEOUT);
    }
    navigator.clipboard.writeText(paymentLinkUrl);
    setTimeout(() => setTooltipOpen(false), TOOLTIP_TIMEOUT);
  };

  return (
    <Tooltip
      title={
        isWorkshopUnavailable
          ? 'Cannot book workshop in the past.'
          : 'Copied to clipboard!'
      }
      open={tooltipOpen}
      onClose={() => setTooltipOpen(false)}
    >
      <span>
        <IconButton
          disabled={!isChargesEnabled}
          onClick={handleClick}
          color="primary"
        >
          <CopyIcon className="h-5 w-5" color="black" />
        </IconButton>
      </span>
    </Tooltip>
  );
};
