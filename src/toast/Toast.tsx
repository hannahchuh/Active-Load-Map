import React from "react";
import { Message, Transition } from "semantic-ui-react";

import "./Toast.css";

interface ToastProps {
  messageBody?: string | null;
  messageHeader?: string | null;
  messageStatus?: "SUCCESS" | "ERROR" | null;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  messageBody,
  messageHeader,
  messageStatus,
  onClose
}) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let cancelEffect = false;

    if (messageBody || messageHeader) {
      if (!cancelEffect) {
        setVisible(true);
      }

      setTimeout(() => {
        if (!cancelEffect) {
          setVisible(false);

          if (onClose) {
            setTimeout(() => {
              if (!cancelEffect) {
                onClose();
              }
            }, 750);
          }
        }
      }, 3000);
    }

    return () => {
      cancelEffect = true;
    };
  }, [messageBody, messageHeader, onClose, setVisible]);

  return (
    <Transition visible={visible} animation="scale" duration={750}>
      <div className="ToastContainer">
        <Message
          className="Toast"
          positive={messageStatus === "SUCCESS"}
          negative={messageStatus === "ERROR"}
          visible={!!messageBody || !!messageHeader}
        >
          <Message.Header>{messageHeader}</Message.Header>
          {messageBody}
        </Message>
      </div>
    </Transition>
  );
};

export default Toast;
