import type { DomainEvent } from "../../types/event";

export interface EventStoreRepository {
  append(event: DomainEvent): DomainEvent;
  getAll(): DomainEvent[];
  getEventsByAggregateId(aggregateId: string): DomainEvent[];
}