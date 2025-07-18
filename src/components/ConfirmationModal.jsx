import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalBasicLayout,
} from "@vibe/core/next";
import { Text } from "@vibe/core";

export const ConfirmationModal = ({
  show,
  setShow,
  container,
  title = "Confirmation",
  desc,
  onConfirm,
}) => {
  return (
    <Modal
      id="modal-basic"
      show={show}
      alertModal
      size="medium"
      onClose={() => setShow(false)}
      container={container}
    >
      <ModalBasicLayout>
        <ModalHeader title={title} />
        <ModalContent>
          <Text type="text1" align="inherit" element="p">
            {desc}
          </Text>
        </ModalContent>
      </ModalBasicLayout>
      <ModalFooter
        primaryButton={{
          text: "Confirm",
          onClick: () => {
            setShow(false);
            onConfirm();
          },
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: () => setShow(false),
        }}
      />
    </Modal>
  );
};
