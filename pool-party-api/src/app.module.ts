import { Module } from '@nestjs/common';
import { CalendarModule } from './calendar/calendar.module';

@Module({
  imports: [CalendarModule],
})
export class AppModule {}
