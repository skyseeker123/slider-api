import { BadRequestException, Body, Controller , Get, Post, Response, Request , Delete, Param} from '@nestjs/common';
import { SliderService } from './slider.service';
import { Slider} from "../domain/slider.entity"

@Controller('slider')
export class SliderController {
	constructor(
		private sliderService: SliderService
	){}

	@Post('')
	async createSlider(
			@Body() createSliderDTO, @Response() res
	): Promise<any>{
			const { imageUrl } = createSliderDTO.body;
			if(!imageUrl) throw new BadRequestException();
			await this.sliderService.createSlider({imageUrl});
			res.status(200).json({'message': 'OK'});
			return;
	}

	@Get('')
	async getSlider():Promise<Slider[]>{
		return await this.sliderService.getSliders()
	}

	@Delete('/:id')
	async deleteSlider(@Param('id') id, @Request() requestAnimationFrame, 
	@Response() res): Promise<any>{
		return await this.sliderService.deleteSlider(id);
	}
}
