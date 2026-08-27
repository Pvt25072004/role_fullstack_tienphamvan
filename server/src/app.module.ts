import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events.module';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'events.sqlite',
      entities: [Event],
      synchronize: true,
    }),
    EventsModule,
  ],
})
export class AppModule {}
