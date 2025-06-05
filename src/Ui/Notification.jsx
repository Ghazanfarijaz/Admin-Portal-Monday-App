import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const iconTypes = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

const Notification = ({
  type = "info",
  title,
  message,
  duration = 5000,
  onDismiss,
  showClose = true,
  actions,
  isPersistent = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconTypes[type] || InformationCircleIcon;

  useEffect(() => {
    if (duration && !isPersistent) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, isPersistent]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const baseStyles = {
    success: "bg-green-50 border-green-500",
    error: "bg-red-50 border-red-500",
    warning: "bg-yellow-50 border-yellow-500",
    info: "bg-blue-50 border-blue-500",
  };

  const iconStyles = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const textStyles = {
    success: "text-green-700",
    error: "text-red-700",
    warning: "text-yellow-700",
    info: "text-blue-700",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className={`fixed top-4 right-4 z-50 max-w-sm w-full rounded-lg shadow-lg overflow-hidden border-l-4 ${baseStyles[type]}`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Icon
                  className={`h-6 w-6 ${iconStyles[type]}`}
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                {title && (
                  <h3 className={`text-sm font-medium ${textStyles[type]}`}>
                    {title}
                  </h3>
                )}
                {message && (
                  <p className={`mt-1 text-sm ${textStyles[type]}`}>
                    {message}
                  </p>
                )}
                {actions && (
                  <div className="mt-3 flex space-x-4">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={action.onClick}
                        className={`rounded-md text-sm font-medium ${textStyles[type]} hover:text-${type}-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {showClose && (
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleDismiss}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onDismiss: PropTypes.func,
  showClose: PropTypes.bool,
  isPersistent: PropTypes.bool,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
};

export default Notification;

// Enhanced hook for multiple notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (props) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      component: (
        <Notification
          key={id}
          {...props}
          onDismiss={() =>
            setNotifications((prev) => prev.filter((n) => n.id !== id))
          }
        />
      ),
    };

    setNotifications((prev) => [...prev, newNotification]);
    return id;
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return [
    notifications.map((n) => n.component),
    showNotification,
    dismissNotification,
  ];
};
