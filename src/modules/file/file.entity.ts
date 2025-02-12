import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "t_excel", timestamps: false })
export class File extends Model<File> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  filename: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true,
  })
  file_url: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  upload_date: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  upload_by: string;

  @Column(DataType.TEXT) a: string;
  @Column(DataType.TEXT) b: string;
  @Column(DataType.TEXT) c: string;
  @Column(DataType.TEXT) d: string;
  @Column(DataType.TEXT) e: string;
  @Column(DataType.TEXT) f: string;
  @Column(DataType.TEXT) g: string;
  @Column(DataType.TEXT) h: string;
  @Column(DataType.TEXT) i: string;
  @Column(DataType.TEXT) j: string;
  @Column(DataType.TEXT) k: string;
  @Column(DataType.TEXT) l: string;
  @Column(DataType.TEXT) m: string;
  @Column(DataType.TEXT) n: string;
  @Column(DataType.TEXT) o: string;
  @Column(DataType.TEXT) p: string;
  @Column(DataType.TEXT) q: string;
  @Column(DataType.TEXT) r: string;
  @Column(DataType.TEXT) s: string;
  @Column(DataType.TEXT) t: string;
  @Column(DataType.TEXT) u: string;
  @Column(DataType.TEXT) v: string;
  @Column(DataType.TEXT) w: string;
  @Column(DataType.TEXT) x: string;
  @Column(DataType.TEXT) y: string;
  @Column(DataType.TEXT) z: string;
}
