import { Product } from '../../products/entities';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text',{unique:true})
    email:string;

    @Column('text',{select:false})
    password:string;
    
    @Column('text')
    fullName:string;

    @Column('bool',{default:true})
    isActive:boolean;

    @Column('text',{array:true, default:["user"]})
    roles:string[];

    // Relations


    @OneToMany(
        ()=>Product,
        (product)=>product.user
    )
    product:Product[]


    // Actions

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
