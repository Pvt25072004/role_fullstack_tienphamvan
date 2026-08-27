import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryColumn()
  event_id: string;

  @Column()
  session_id: string;

  @Column()
  event_type: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  domain: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('bigint')
  timestamp: number;
}
