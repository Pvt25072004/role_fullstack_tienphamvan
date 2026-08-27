import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsGateway } from './events.gateway';
export declare class EventsService {
    private eventsRepository;
    private eventsGateway;
    constructor(eventsRepository: Repository<Event>, eventsGateway: EventsGateway);
    create(eventDto: any): Promise<Event>;
    getSessions(): Promise<any[]>;
    getArticles(): Promise<any[]>;
}
