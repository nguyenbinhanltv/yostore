import { Body, Controller, Post } from '@nestjs/common';
import { LanguageCode } from '@vendure/core';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {
    }

    @Post('email')
    async email(@Body() body: any): Promise<void> {
        if (!body.token || body.token !== process.env.WEBHOOK_TOKEN) {
            throw Error(`You are not authorized to make this call`);
        }
        await this.analyticsService.sendMonthlyEmail();
    }
}
