import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import { UploadFileService } from "./uploadfile.service";
import { UploadFileController } from "./uploadfile.controller";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { FileService } from "../file/file.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { File } from "../file/file.entity";

@Module({
  imports: [
    HttpModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
    ConfigModule,
    SequelizeModule.forFeature([File]),
  ],
  controllers: [UploadFileController],
  providers: [UploadFileService, FileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
