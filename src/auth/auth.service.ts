import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'qs';
import {UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import {User} from "../domain/user.entity";
import { LessThan } from 'typeorm';
import { Payload } from './Security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from './role-type';

@Injectable()
export class AuthService {

		constructor(
			private userService: UserService,
			private jwtService: JwtService
		){}

    async kakaoLogin(options: { code: string; domain: string }): Promise<any> {
        const { code, domain } = options;
        const kakaoKey = '2cc9994baaa1c9818b49cb575310fac0';
        const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
        const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        const body = {
          grant_type: 'authorization_code',
          client_id: kakaoKey,
          redirect_uri: `${domain}/kakao-callback`,
          code,
        };

        const headers = {
          'Content-Type': ' application/x-www-form-urlencoded',
        };
        try {

					const response = await axios.post(kakaoTokenUrl, qs.stringify(body), {headers})

          /*const response = await axios({
            method: 'POST',
            url: kakaoTokenUrl,
            timeout: 30000,
            headers,
            data: qs.stringify(body),
          });*/
          if (response.status === 200) {
            console.log(`kakaoToken : ${qs.stringify(response.data)}`);
            // Token 을 가져왔을 경우 사용자 정보 조회
            const headerUserInfo = {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
              Authorization: 'Bearer ' + response.data.access_token,
            };
            console.log(`url : ${kakaoTokenUrl}`);
            console.log(`headers : ${JSON.stringify(headerUserInfo)}`);
            const responseUserInfo = await axios({
              method: 'GET',
              url: kakaoUserInfoUrl,
              timeout: 30000,
              headers: headerUserInfo,
            });
            console.log(`responseUserInfo.status : ${responseUserInfo.status}`);
            if (responseUserInfo.status === 200) {
              console.log(
                `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
              );
              return responseUserInfo.data;
            } else {
              throw new UnauthorizedException();
            }
          } else {
            throw new UnauthorizedException();
          }
        } catch (error) {
          console.log(error);
          throw new UnauthorizedException();
        }
      }

			async login(kakao): Promise<{accessToken: string} | undefined> {
				let userFind: User = await this.userService.findByFields({
									where: { kakaoId: kakao.id }
							});
							if(!userFind) {
				
									// 회원 가입
									const user = new User();
									user.kakaoId = kakao.id;
									user.email = kakao.kakao_account.email;
									user.name = kakao.kakao_account.name;
									
									console.log('email' , kakao.kakao_account.email);

									userFind = await this.userService.registerUser(user);
							}
			
							const payload: Payload = {
									id: userFind.id,
									name: userFind.name,
									authorities: userFind.authorities
							};
							return {
									accessToken: this.jwtService.sign(payload)
							};
			}

			async tokenValidateUser(payload: Payload): Promise<User| undefined> {
				const userFind = await this.userService.findByFields({
						where: { id: payload.id }
				});
				this.flatAuthorities(userFind);
				return userFind;
		}
		
		private flatAuthorities(user: any): User {
				if (user && user.authorities) {
						const authorities: string[] = [];
						user.authorities.forEach(authority => authorities.push(authority.authorityName));
						user.authorities = authorities;
						for(const auth of authorities){
								if(auth === RoleType.ADMIN){
										user.isAdmin = true;
							}
						}
				}
				return user;
		}
}