import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(eventDto: any): Promise<Event> {
    // Idempotency: check if event already exists
    const existing = await this.eventsRepository.findOne({ where: { event_id: eventDto.event_id } });
    if (existing) {
      return existing;
    }

    const event = this.eventsRepository.create(eventDto) as any as Event;
    await this.eventsRepository.save(event);

    // Broadcast update
    this.eventsGateway.server.emit('newEvent', event);

    return event;
  }

  async getSessions() {
    // This is simple SQLite grouping to emulate sessions
    return this.eventsRepository
      .createQueryBuilder('event')
      .select('event.session_id', 'session_id')
      .addSelect('MAX(event.url)', 'url')
      .addSelect('MAX(event.title)', 'title')
      .addSelect('MAX(event.domain)', 'domain')
      .addSelect('MIN(event.timestamp)', 'start_time')
      .addSelect('MAX(event.timestamp)', 'end_time')
      .groupBy('event.session_id')
      .getRawMany();
  }

  async getArticles() {
    return this.eventsRepository
      .createQueryBuilder('event')
      .select('event.url', 'url')
      .addSelect('MAX(event.title)', 'title')
      .addSelect('MAX(event.domain)', 'domain')
      .addSelect('MAX(event.content)', 'content')
      .groupBy('event.url')
      .getRawMany();
  }
}
