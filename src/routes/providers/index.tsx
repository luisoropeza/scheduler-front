import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UserPlus, Users } from "lucide-react";
import { useProviders, useCreateProvider, useUpdateProvider, useDeleteProvider } from "../../hooks/providerQueries";
import { ProviderCard } from "../../components/providers/ProviderCard";
import { ProviderForm } from "../../components/providers/ProviderForm";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import type { Provider, ProviderRequest } from "../../types/provider";

export const Route = createFileRoute("/providers/")({
  component: ProvidersPage,
});

type ModalState =
  | { type: "create" }
  | { type: "edit"; provider: Provider }
  | { type: "delete"; provider: Provider }
  | null;

function ProvidersPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalState>(null);

  const { data: providers, isLoading, isError } = useProviders();
  const create = useCreateProvider();
  const update = useUpdateProvider(
    modal?.type === "edit" ? modal.provider.id : 0,
  );
  const remove = useDeleteProvider();

  const close = () => setModal(null);

  const handleSubmit = (data: ProviderRequest) => {
    if (modal?.type === "create") {
      create.mutate(data, { onSuccess: close });
    } else if (modal?.type === "edit") {
      update.mutate(data, { onSuccess: close });
    }
  };

  const handleDelete = () => {
    if (modal?.type !== "delete") return;
    remove.mutate(modal.provider.id, { onSuccess: close });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Providers</h1>
        <Button onClick={() => setModal({ type: "create" })}>
          <UserPlus className="h-4 w-4" />
          New provider
        </Button>
      </div>

      {isLoading && <Spinner />}
      {isError && (
        <p className="text-sm text-red-500">Failed to load providers.</p>
      )}

      {providers && providers.length === 0 && (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No providers yet"
          description="Add your first provider to get started."
          action={
            <Button onClick={() => setModal({ type: "create" })}>
              <UserPlus className="h-4 w-4" /> New provider
            </Button>
          }
        />
      )}

      {providers && providers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              onEdit={(p) => setModal({ type: "edit", provider: p })}
              onDelete={(p) => setModal({ type: "delete", provider: p })}
              onViewSchedules={(p) =>
                navigate({ to: "/providers/$providerId", params: { providerId: String(p.id) } })
              }
            />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={modal?.type === "create" || modal?.type === "edit"}
        title={modal?.type === "edit" ? "Edit provider" : "New provider"}
        onClose={close}
      >
        <ProviderForm
          initial={modal?.type === "edit" ? modal.provider : undefined}
          onSubmit={handleSubmit}
          onCancel={close}
          loading={create.isPending || update.isPending}
        />
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={modal?.type === "delete"}
        title="Delete provider"
        onClose={close}
      >
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">
            {modal?.type === "delete" ? modal.provider.name : ""}
          </span>
          ? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button variant="danger" loading={remove.isPending} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
