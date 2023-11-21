import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthority } from 'src/domain/user-authority.entity';
import { User } from 'src/domain/user.entity';
import { JwtModule } from '@nestjs/jwt/dist';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport/dist';
import { jwtStrategy } from './Security/passport.jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User,UserAuthority]),
		JwtModule.register({
			secret:'secret',
			signOptions:{expiresIn: '300s'}
		}),
		PassportModule
	],
	exports: [TypeOrmModule, AuthService, UserService],
  controllers: [AuthController],
  providers: [AuthService, UserService, jwtStrategy]
})
export class AuthModule {}
