export interface EventBus {
    sendEvent(eventTypeName: string, payload: any): Promise<void>;
    consumeEvents(eventTypeName: string, callback: (payload: any) => Promise<void>): Promise<void>;
}
