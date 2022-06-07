import { ScraperConfiguration } from '../entities/ScraperConfiguration';

class ScraperConfigurationService {
  public async getScraperConfigurationByOrigin(origin: string) {
    const result = await ScraperConfiguration.findOne({
      where: {
        siteOrigin: origin,
      },
    });

    return result;
  }
}

export default ScraperConfigurationService;
