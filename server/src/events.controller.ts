import { Controller, Post, Body, Get } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('api')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('events')
  async createEvent(@Body() eventDto: any) {
    return this.eventsService.create(eventDto);
  }

  @Get('sessions')
  async getSessions() {
    return this.eventsService.getSessions();
  }

  @Get('articles')
  async getArticles() {
    return this.eventsService.getArticles();
  }
}
