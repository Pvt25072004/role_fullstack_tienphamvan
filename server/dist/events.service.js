"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./event.entity");
const events_gateway_1 = require("./events.gateway");
let EventsService = class EventsService {
    eventsRepository;
    eventsGateway;
    constructor(eventsRepository, eventsGateway) {
        this.eventsRepository = eventsRepository;
        this.eventsGateway = eventsGateway;
    }
    async create(eventDto) {
        const existing = await this.eventsRepository.findOne({ where: { event_id: eventDto.event_id } });
        if (existing) {
            return existing;
        }
        const event = this.eventsRepository.create(eventDto);
        await this.eventsRepository.save(event);
        this.eventsGateway.server.emit('newEvent', event);
        return event;
    }
    async getSessions() {
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
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        events_gateway_1.EventsGateway])
], EventsService);
//# sourceMappingURL=events.service.js.map