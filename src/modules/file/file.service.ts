import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { File } from "./file.entity";

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File)
    private readonly fileModel: typeof File
  ) { }

  async createFile(fileData: any[]): Promise<File[]> {
    return await this.fileModel.bulkCreate(fileData);
  }
  async getFileByFilename(filename: string): Promise<File[]> {
    return await File.findAll({ where: { filename } });
  }
  // async findByFileId(fileId: string): Promise<File | null> {
  //   return this.fileModel.findOne({ where: { id: fileId } });
  // }

  // async findFilesByBucket(bucketName: string): Promise<File[]> {
  //   return this.fileModel.findAll({
  //     where: { bucketname: bucketName },
  //     attributes: ["id", "filename", "bucketname", "url"],
  //   });
  // }

  // async updateFileUrl(objectName: string, url: string): Promise<void> {
  //   const file = await this.findByFileName(objectName);
  //   if (file) {
  //     await file.update({ url });
  //   }
  // }

  // async findByFileName(fileName: string) {
  //   return this.fileModel.findOne({ where: { filename: fileName } });
  // }

  // async deleteFile(fileId: string): Promise<File | null> {
  //   const file = await this.fileModel.findOne({ where: { id: fileId } });

  //   if (!file) {
  //     throw new NotFoundException(`File with ID ${fileId} not found.`);
  //   }

  //   await file.destroy();
  //   return file;
  // }
}
