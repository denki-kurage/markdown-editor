export class EventListeners {
    listeners = [];
    addListener(listener) {
        this.listeners.push(listener);
        return { dispose: () => this.removeListener(listener) };
    }
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
    emit(value) {
        this.listeners.forEach(listener => listener(value));
    }
}
//# sourceMappingURL=EventListeners.js.map