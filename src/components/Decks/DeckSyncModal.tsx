import { Button, Dialog, Flex, Progress, Spinner } from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useDecks } from "../../hooks/useDecks";
import { ArchidektService } from "../../services/Archidekt";
import { DeckSyncStatus } from "../../state/DeckSyncStatus";
import { Icon } from "../Common/Icon";

export function DeckSyncModal() {
  const { dbDecks } = useDecks();
  const [pointer, setPointer] = useState<number>(0);
  const [status, setStatus] = useState<DeckSyncStatus>(
    DeckSyncStatus.NOT_STARTED
  );
  const syncing = useMemo(
    () => status === DeckSyncStatus.IN_PROGRESS,
    [status]
  );
  const statusColor: "warning" | "success" | undefined = useMemo(() => {
    switch (status) {
      case DeckSyncStatus.ERROR:
        return "warning";
      case DeckSyncStatus.COMPLETED:
        return "success";
      default:
        return undefined;
    }
  }, [status]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setStatus(DeckSyncStatus.NOT_STARTED);
      setPointer(0);
    }
  }

  async function handleSync() {
    setStatus(DeckSyncStatus.IN_PROGRESS);
    setPointer(0);
    try {
      let i = 0;
      for (const deck of dbDecks ?? []) {
        setPointer(i + 1);
        await ArchidektService.syncDeckDetails(deck);
        i++;
      }
    } catch (error) {
      console.error(error);
      setStatus(DeckSyncStatus.ERROR);
    } finally {
      setStatus(DeckSyncStatus.COMPLETED);
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button className="h-10" variant="soft" color="gray">
          <Icon icon="rotate" />
          Sync All
        </Button>
      </Dialog.Trigger>

      <Dialog.Description></Dialog.Description>

      <Dialog.Content
        onPointerDownOutside={(e) => syncing && e.preventDefault()}
        onInteractOutside={(e) => syncing && e.preventDefault()}
        onEscapeKeyDown={(e) => syncing && e.preventDefault()}
      >
        <Dialog.Title>Deck Sync</Dialog.Title>

        <Flex gap="2" mt="4" mb="4" align="center">
          <Icon icon="exclamation-triangle" color="#d84242" />
          <p className="text-warning">
            This operation is meant to be executed only when the underlying data
            structure of decks has changed. Please consult with Gab before
            running.
          </p>
        </Flex>

        <p>
          Syncing all decks takes a couple of minutes. <b>DO NOT</b> close the
          modal or the page once the syncing process has started. There are{" "}
          <b>{dbDecks?.length ?? 0}</b> decks to sync.
        </p>

        <div className="mt-4 mb-6">
          <Flex mb="1" gap="2" align="center">
            <p className={`text-${statusColor}`}>{status}</p>
            {syncing && <Spinner size="1" />}
          </Flex>
          <Progress value={(pointer / (dbDecks?.length ?? 0)) * 100} />
          {syncing && (
            <p className="text-muted">
              Currently syncing deck {pointer} out of {dbDecks?.length ?? 0} -{" "}
              {dbDecks?.[pointer]?.name}
            </p>
          )}
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close disabled={syncing}>
            <Button className="h-10" variant="surface">
              <Icon icon="xmark" />
              Close
            </Button>
          </Dialog.Close>
          <Button
            className="h-10"
            loading={syncing}
            disabled={syncing}
            onClick={handleSync}
          >
            <Icon icon="rotate" />
            Sync
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
