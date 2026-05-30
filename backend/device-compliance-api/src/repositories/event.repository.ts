import type { DomainEvent } from "../types/event";

const events: DomainEvent[] = [];

export function appendEvent(event: DomainEvent): DomainEvent {
  events.push(event);
  return event;
}

export function getAllEvents(): DomainEvent[] {
  return events;
}

export function getEventsByAggregateId(aggregateId: string): DomainEvent[] {
  return events.filter((event) => event.aggregateId === aggregateId);
}