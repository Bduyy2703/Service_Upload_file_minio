import { Injectable, BadRequestException } from "@nestjs/common";
import { Express } from "express";
import { Client } from "minio";
import { ConfigService } from "@nestjs/config";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { File } from "../file/file.entity";
import { QueryTypes, Sequelize } from "sequelize";

@Injectable()
export class UploadFileService {
  private readonly minioClient: Client;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(File) private readonly fileModel: typeof File,
    @InjectConnection() private readonly sequelize: Sequelize 
  ) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>("minio.endpoint"),
      useSSL: this.configService.get<boolean>("minio.useSSL"),
      accessKey: this.configService.get<string>("minio.accessKeyId"),
      secretKey: this.configService.get<string>("minio.secretAccessKey"),
      port: this.configService.get<number>("minio.port"),
    });
  }

  private isExcel(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  private async createBucket(bucketName: string): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, "us-east-1");

        const policy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: bucketName === "public" ? "Allow" : "Deny",
              Principal: { AWS: ["*"] },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        };

        await this.minioClient.setBucketPolicy(
          bucketName,
          JSON.stringify(policy)
        );
      }
    } catch (error) {
      throw new Error(`Lỗi khi tạo hoặc cấu hình bucket: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    bucketName: string
  ): Promise<{ fileName: string; fileUrl: string }> {
    if (!this.isExcel(file)) {
      throw new BadRequestException(
        "Invalid file type. Only Excel files are allowed."
      );
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    try {
      await this.createBucket(bucketName);

      await this.minioClient.putObject(bucketName, fileName, file.buffer);
      let fileUrl = "";
      if (bucketName === "public") {
        fileUrl = `http://localhost:${this.configService.get<number>(
          "minio.port"
        )}/${bucketName}/${fileName}`;
      } else {
        fileUrl = await this.minioClient.presignedUrl(
          "GET",
          bucketName,
          fileName,
          7 * 24 * 60 * 60
        );
      }
      return { fileName, fileUrl };
    } catch (error) {
      console.error(error);
      throw new Error("Error uploading file");
    }
  }

  async saveExcelData(records: any[]): Promise<void> {
    await this.fileModel.bulkCreate(records);
  }

  async executeProcedure(spname: string, filename: string) {
    try {
      const query = `SELECT * FROM ${spname}(:filename)`;
      const result = await this.sequelize.query(query, {
        replacements: { filename },
        type: QueryTypes.SELECT, 
      });
      console.log("result:", result);
      return result;
    } catch (error) {
      console.log("Lỗi khi gọi stored function:", error);
      throw new Error("Lỗi khi thực thi stored function.");
    }
  }
  
}
