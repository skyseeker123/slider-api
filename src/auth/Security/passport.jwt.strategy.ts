import {Injectable, PayloadTooLargeException, UnauthorizedException} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, ExtractJwt, VerifiedCallback} from "passport-jwt"
import { AuthService } from '../auth.service';
import { Payload } from './payload.interface';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
	constructor(private authService: AuthService){
		super({
			jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: process.env.SECRET_KEY
		});
	}

	async validate(payload: Payload, done: VerifiedCallback): Promise<any>{
		const user = await this.authService.tokenValidateUser(payload);
		if (!user) {
			return done(new UnauthorizedException({message: 'user does not exist'}), false)
		}
		return done(null, user);
	}
}