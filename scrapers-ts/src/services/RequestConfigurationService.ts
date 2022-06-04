import { RequestConfiguration } from "../entities/RequestConfiguration";

class RequestConfigurationService {
    public async getRequestConfigurationByDomain(siteOrigin: string) {
        const result =  await RequestConfiguration.findOne({
            where: [
                {siteOrigin}
            ],
        });

        return result;
    }
}

export default RequestConfigurationService;