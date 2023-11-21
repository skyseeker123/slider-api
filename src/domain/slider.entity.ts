import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('slider')
export class Slider {
    @PrimaryGeneratedColumn({type: 'int', name: 'id'})
    id: number;

    @Column('varchar', {name: 'image_url', length: 200})
    imageUrl: string;

    @Column('timestamp', {
        name: 'created_at',
        default: ()=> 'CURRENT_TIMESTAMP'
    })
    createAt: Date;

    @Column('timestamp', {
        name: 'updated_at',
        default: ()=> 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;
}