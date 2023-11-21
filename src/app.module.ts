import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './orm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SliderModule } from './slider/slider.module';

@Module({
  imports: [
		TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
		ConfigModule.forRoot({
      isGlobal: true
    }),
		AuthModule,
		SliderModule,
	],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
