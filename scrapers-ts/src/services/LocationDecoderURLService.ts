import { LocationDecoderURL } from "../entities/LocationDecoderURL";

class LocationDecoderURLService {
    public async checkIfLocationIdStored(locationName: string, siteOrigin: string) {
        const result =  await LocationDecoderURL.findOne({
            where: [
                {siteOrigin, locationName}
            ],
        });

        return result;
    }
}

export default LocationDecoderURLService;