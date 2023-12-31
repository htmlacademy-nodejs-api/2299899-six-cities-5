import { defaultClasses, DocumentType } from '@typegoose/typegoose';

import { OfferExists } from '../../../types/index.js';
import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { UpdateOfferDto } from '../dto/update-offer.dto.js';
import { OfferEntity } from '../offer.entity.js';
import { OfferFindManyQuery } from './offer-find-many-query.interface.js';
import { OfferFindOneQuery } from './offer-find-one-query.interface.js';

export interface OfferService extends OfferExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findOne({ params, userId }: OfferFindOneQuery): Promise<DocumentType<OfferEntity> | null>;
  findOneOrCreate(params: Partial<defaultClasses.Base>, dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findMany({ params, limit, sortOptions}: OfferFindManyQuery): Promise<DocumentType<OfferEntity>[] | null>;
  exists(id: string): Promise<boolean>;
}

