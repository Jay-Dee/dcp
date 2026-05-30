import type { DomainEvent } from "../types/event";
import { EventStoreRepository } from "./interfaces/event-repository";

export class InMemoryEventRepository implements EventStoreRepository {
private readonly events: DomainEvent[] = [];

append(event: DomainEvent): DomainEvent {
  this.events.push(event);
  return event;
}

getAll(): DomainEvent[] {
  return this.events;
}

getEventsByAggregateId(aggregateId: string): DomainEvent[] {
  return this.events.filter((event) => event.aggregateId === aggregateId);
}
}
