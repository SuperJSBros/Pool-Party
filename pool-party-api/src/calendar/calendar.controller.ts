import { Controller, Post, Req } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { Request } from 'express';

@Controller('calendar')
export class CalendarController {
    constructor(private caldendarService:CalendarService){      
    }

    @Post('create-event')
    public createEvent(@Req() request:Request){
        const body = request.body;
        return this.caldendarService.createEvent(request.body);
    }
}
