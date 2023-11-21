import { Module } from '@nestjs/common';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';
import {Slider} from '../domain/slider.entity'
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
	imports: [
    TypeOrmModule.forFeature([Slider])
  ],
  controllers: [SliderController],
  providers: [SliderService]
})
export class SliderModule {}
