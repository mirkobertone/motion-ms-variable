import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({
  name: 'tools_variables',
})
export class Variable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 255 })
  name: string;

  @Column('varchar', { name: 'description', nullable: true, length: 255 })
  description: string | null;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @BeforeInsert()
  beforeInsertActions() {
    const d = new Date();
    d.setMilliseconds(0);
    this.createdAt = d;
    this.updatedAt = d;
  }

  @BeforeUpdate()
  beforeUpdateActions() {
    const d = new Date();
    d.setMilliseconds(0);
    this.updatedAt = d;
  }
}
