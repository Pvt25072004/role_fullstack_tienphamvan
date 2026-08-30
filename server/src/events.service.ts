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
    const existing = await this.eventsRepository.findOne({
      where: { event_id: eventDto.event_id },
    });
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
    const rawSessions = await this.eventsRepository
      .createQueryBuilder('event')
      .select('event.session_id', 'session_id')
      .addSelect('MAX(event.url)', 'url')
      .addSelect('MAX(event.title)', 'title')
      .addSelect('MAX(event.domain)', 'domain')
      .addSelect('MIN(event.timestamp)', 'start_time')
      .addSelect('MAX(event.timestamp)', 'end_time')
      .groupBy('event.session_id')
      .getRawMany();

    // get realtime delete session
    const allEvents = await this.eventsRepository.find({
      order: { timestamp: 'ASC' },
    });

    // group by session_id
    const eventsBySession: Record<string, Event[]> = {};
    for (const event of allEvents) {
      if (!eventsBySession[event.session_id]) {
        eventsBySession[event.session_id] = [];
      }
      eventsBySession[event.session_id].push(event);
    }

    //total_reading_time
    return rawSessions.map((session) => {
      const sessionEvents = eventsBySession[session.session_id] || [];
      let total_reading_time = 0;
      let isActive = false;
      let lastActiveTime = 0;

      for (const event of sessionEvents) {
        const time = Number(event.timestamp);
        if (
          event.event_type === 'PAGE_ENTER' ||
          event.event_type === 'PAGE_ACTIVE'
        ) {
          if (!isActive) {
            isActive = true;
            lastActiveTime = time;
          }
        } else if (
          event.event_type === 'PAGE_INACTIVE' ||
          event.event_type === 'PAGE_LEAVE'
        ) {
          if (isActive) {
            total_reading_time += time - lastActiveTime;
            isActive = false;
          }
        }
      }

      if (isActive && sessionEvents.length > 0) {
        const lastEvent = sessionEvents[sessionEvents.length - 1];
        const lastTime = Number(lastEvent.timestamp);
        if (lastTime > lastActiveTime) {
          total_reading_time += lastTime - lastActiveTime;
        }
      }

      return {
        ...session,
        total_reading_time,
      };
    });
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
