import { CITIES } from '../../const/cities.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { MockServerData, OfferType, UserType } from '../../types/index.js';
import * as CONSTS from './const.js';
import { OfferGenerator } from './offer-generator.interface.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);

    const city = getRandomItem<string>(Object.keys(CITIES));
    const preview = getRandomItem<string>(this.mockData.offerImages);
    const offerImages = this.mockData.offerImages.join(';');
    const isPremium = generateRandomValue(0, 1);
    const type = getRandomItem<string>(Object.values(OfferType));

    const rooms = generateRandomValue(CONSTS.Rooms.MIN, CONSTS.Rooms.MAX);
    const guests = generateRandomValue(CONSTS.Guests.MIN, CONSTS.Guests.MAX);
    const price = generateRandomValue(CONSTS.Price.MIN, CONSTS.Price.MAX);
    const goods = getRandomItems<string>(this.mockData.goods).join(';');

    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const userType = getRandomItem<string>(Object.values(UserType));
    const password = generateRandomValue(CONSTS.MockNumericPasswordValue.MIN, CONSTS.MockNumericPasswordValue.MAX);

    const commentsCount = 0;
    const latitude = generateRandomValue(
      CONSTS.Latitude.MIN,
      CONSTS.Latitude.MAX,
      CONSTS.COORDINATES_FLOAT_DIGITS
    );
    const longitude = generateRandomValue(
      CONSTS.Longitude.MIN,
      CONSTS.Longitude.MAX,
      CONSTS.COORDINATES_FLOAT_DIGITS
    );

    return [
      title,
      description,
      city,
      preview,
      offerImages,
      isPremium,
      type,
      rooms,
      guests,
      price,
      goods,
      name,
      email,
      avatar,
      userType,
      password,
      commentsCount,
      latitude,
      longitude,
    ].join('\t');
  }
}
