import {
  faExclamationTriangle,
  faRotate,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dialog,
  Flex,
  Progress,
  Spinner,
  Text,
} from "@radix-ui/themes";
import { useMemo, useState } from "react";
import { useDecks } from "../../hooks/useDecks";
import { ArchidektService } from "../../services/Archidekt";
import { DeckSyncStatus } from "../../state/DeckSyncStatus";

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
  const statusColor: "red" | "green" | undefined = useMemo(() => {
    switch (status) {
      case DeckSyncStatus.ERROR:
        return "red";
      case DeckSyncStatus.COMPLETED:
        return "green";
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
        <Button className="h-10" variant="soft">
          <FontAwesomeIcon icon={faRotate} />
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
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            width="25"
            height="25"
            color="#d84242"
          />
          <Text size="2" color="red">
            This operation is meant to be executed only when the underlying data
            structure of decks has changed. Please consult with Gab before
            running.
          </Text>
        </Flex>

        <Text>
          Syncing all decks takes a couple of minutes. <b>DO NOT</b> close the
          modal or the page once the syncing process has started. There are{" "}
          <b>{dbDecks?.length ?? 0}</b> decks to sync.
        </Text>

        <div className="mt-4 mb-6">
          <Flex mb="1" gap="2" align="center">
            <Text size="3" color={statusColor}>
              {status}
            </Text>
            {syncing && <Spinner size="1" />}
          </Flex>
          <Progress value={(pointer / (dbDecks?.length ?? 0)) * 100} />
          {syncing && (
            <Text size="1" color="gray">
              Currently syncing deck {pointer} out of {dbDecks?.length ?? 0} -{" "}
              {dbDecks?.[pointer]?.name}
            </Text>
          )}
        </div>

        <Flex gap="3" mt="4" justify="between">
          <Dialog.Close disabled={syncing}>
            <Button className="h-10" variant="surface">
              <FontAwesomeIcon icon={faXmark} />
              Close
            </Button>
          </Dialog.Close>
          <Button
            className="h-10"
            loading={syncing}
            disabled={syncing}
            onClick={handleSync}
          >
            <FontAwesomeIcon icon={faRotate} />
            Sync
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
