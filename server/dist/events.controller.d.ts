import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    createEvent(eventDto: any): Promise<import("./event.entity").Event>;
    getSessions(): Promise<any[]>;
    getArticles(): Promise<any[]>;
}
