import 'react';
import {crossNotif, infoNotif, okNotif} from "../assets/svg";
import type {ReactNode} from "react";

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

function Notification({ message, type }: NotificationProps) {
    const getIcon = (type: NotificationProps['type']): ReactNode => {
        switch (type) {
            case 'success':
                return okNotif({ size: 30, color: "var(--ok-color)" });
            case 'error':
                return crossNotif({ size: 30, color: "var(--error-color)" });
            case 'info':
                return infoNotif({ size: 30, color: "var(--info-color)" });
            default:
                return null;
        }
    };

    return (
        <div className={`notification ${type}`}>
            <div className="notification-content">
                <p className="notification-message">{message}</p>
                <div className="notification-icon">{getIcon(type)}</div>
            </div>
        </div>
    );
}

export default Notification;
