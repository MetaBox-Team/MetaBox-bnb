import React, {createContext, useCallback, useContext, useState} from "react";
import {Notification} from "@/types/global";

const notificationContext = createContext(null!);

interface MessageProps {
    notifications: Notification[],
    Message: Function;
    deleteMessage:Function
}
let notificationsArr:Notification[] =[];
const useNotificationAuth = ():MessageProps => {
    const [notifications, setNotifications] = useState<any>([]);
    const Message = useCallback((value: any) => {
        value.id = new Date().getTime();
        setNotifications((_n)=>[..._n,value])
    }, []);
    const deleteMessage=(id)=>{
        setNotifications((notification)=>notification.filter((_n)=>_n.id!==id));
    }
    console.log(notifications,'notifications')
    return {
        notifications,
        Message,
        deleteMessage
    }
}

export function ProvideMessage({children}) {
    const message = useNotificationAuth();
    // @ts-ignore
    return <notificationContext.Provider value={message}>{children}</notificationContext.Provider>;
}

export const useMessage = () => {
    return useContext(notificationContext)
}
