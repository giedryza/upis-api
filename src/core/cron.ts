import { schedule, ScheduleOptions } from 'node-cron';

import { Service as ToursService } from 'domain/tours/tours.service';

class Cron {
  private timezone = 'Europe/Vilnius';

  start = () => {
    this.updateScores();
  };

  private updateScores = () => {
    // everyday at 03:00
    const expression = '00 03 * * *';
    const options: ScheduleOptions = {
      timezone: this.timezone,
    };

    const job = async () => {
      try {
        await ToursService.updateScores();
      } catch (error) {
        console.error(error);
      }
    };

    return schedule(expression, job, options);
  };
}

export const cron = new Cron();
