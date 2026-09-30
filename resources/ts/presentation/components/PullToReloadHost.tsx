import PullToReloadIndicator from "@/ts/presentation/components/PullToReloadIndicator";
import { usePullToReload } from "@/ts/presentation/hooks/usePullToReload";

/**
 * Mount once per layout shell so pull-to-reload works on every page.
 */
const PullToReloadHost = (): React.ReactElement => {
  const pullToReload = usePullToReload();

  return (
    <PullToReloadIndicator
      isVisible={pullToReload.isVisible}
      isReloading={pullToReload.isReloading}
      isReady={pullToReload.isReady}
      pullDistance={pullToReload.pullDistance}
      progress={pullToReload.progress}
    />
  );
};

export default PullToReloadHost;
