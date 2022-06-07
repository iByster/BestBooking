import { BaseEntity, Column } from 'typeorm';
import { IFormConfiguration, ILocationDecoderConfiguration } from '../types';

export class LocationDecoderConfiguration
  extends BaseEntity
  implements ILocationDecoderConfiguration
{
  @Column()
  needStyle!: boolean;

  @Column()
  resolveCaptcha!: boolean;

  @Column({ type: 'string' })
  url!: URL;

  @Column({ type: 'jsonb' })
  formConfiguration!: IFormConfiguration;
}
