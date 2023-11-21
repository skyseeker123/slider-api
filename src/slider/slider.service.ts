import { Injectable, InternalServerErrorException, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slider} from "../domain/slider.entity"
import { Repository } from 'typeorm';
import * as AWS from 'aws-sdk';
 
@Injectable()
export class SliderService {
	async getSliders(): Promise<Slider[]> {
	return await this.sliderRepository.find();	
	}

	constructor(
		@InjectRepository(Slider)
		private sliderRepository: Repository<Slider>
	){}
	@Post('')
	async createSlider(param: { imageUrl: any }): Promise<any>{
		const {imageUrl} = param;
		await this.sliderRepository.save({imageUrl});
	}

	async getSlider(id: number): Promise<Slider>{
		const slider = await this.sliderRepository.findOne({where: {id}});
		if(slider){
			return slider;
		} else{
			throw new NotFoundException(`Slider with ID ${id} not found!`)
		}
	}
	async deleteSlider(id): Promise<any> {
		const slider = await this.getSlider(id);
		if (slider){
			const bucketName = process.env.S3_BUCKET;
			const region = process.env.S3_REGION;
			const IdentityPoolId = process.env.S3_IDENTITY_POOL_ID
			AWS.config.update({
				region,
				credentials: new AWS.CognitoIdentityCredentials({
					IdentityPoolId
				})
			});
			const s3 = new AWS.S3({
				apiVersion: '2006-03-01',
				params: {
					Bucket: bucketName
				}
			});
			//s3 파일 삭제
			const uriName = decodeURI(slider.imageUrl)
			const fileNamePos = uriName.indexOf('/images/')
			if(fileNamePos === -1) {
				throw new NotFoundException();
			}
			const fileName = uriName.substring(fileNamePos + 8);
			s3.deleteObject({
				Bucket: bucketName,
				Key: 'images/'+fileName
			}), (err) => {
					if(err){
						console.log(err);
						throw new InternalServerErrorException(err);
					}
			}
			//table에서 삭제
			return await this.sliderRepository.delete(id);
		}
	}
}
