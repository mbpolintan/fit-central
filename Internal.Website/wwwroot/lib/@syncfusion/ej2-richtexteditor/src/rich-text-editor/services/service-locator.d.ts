/**
 * ServiceLocator
 * @hidden

 */
export declare class ServiceLocator {
    private services;
    /**
     * register method
     * @hidden

     */
    register<T>(name: string, type: T): void;
    /**
     * getService method
     * @hidden

     */
    getService<T>(name: string): T;
}
