export interface IEventListener<T>
{
    (value: T): void;
}
