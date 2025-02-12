import { Express } from "express";
import {
  BadRequestException,
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Param,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiConsumes, ApiBody, ApiTags } from "@nestjs/swagger";
import * as xlsx from "xlsx";
import { UploadFileService } from "./uploadfile.service";
import { FileService } from "../file/file.service";

@ApiTags("Upload")
@Controller("upload")
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService,
    private readonly fileService: FileService
  ) {}

  @Post("upload-excel")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
        bucketName: { type: "string" },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", { limits: { fileSize: 10 * 1024 * 1024 } })
  )
  @ApiOperation({ summary: "Tải lên file Excel và lưu vào DB" })
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Body("bucketName") bucketName: string
  ) {
    try {
      if (!file) {
        throw new BadRequestException("File is required.");
      }
      if (!bucketName) {
        throw new BadRequestException("Bucket name is required.");
      }

      // Upload file lên MinIO
      const { fileName, fileUrl } = await this.uploadFileService.uploadFile(
        file,
        bucketName
      );

      // Đọc file Excel từ buffer
      const workbook = xlsx.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Lấy sheet đầu tiên
      const sheet = workbook.Sheets[sheetName];

      console.log("Bắt đầu chuyển đổi sheet thành JSON...");
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: "A" });

      // Chuyển dữ liệu thành format phù hợp với bảng t_excel
      const records = jsonData.map((row: any) => ({
        filename: fileName,
        file_url: fileUrl,
        upload_by: "system", // Có thể lấy từ user đăng nhập
        a: row["A"] || null,
        b: row["B"] || null,
        c: row["C"] || null,
        d: row["D"] || null,
        e: row["E"] || null,
        f: row["F"] || null,
        g: row["G"] || null,
        h: row["H"] || null,
        i: row["I"] || null,
        j: row["J"] || null,
        k: row["K"] || null,
        l: row["L"] || null,
        m: row["M"] || null,
        n: row["N"] || null,
        o: row["O"] || null,
        p: row["P"] || null,
        q: row["Q"] || null,
        r: row["R"] || null,
        s: row["S"] || null,
        t: row["T"] || null,
        u: row["U"] || null,
        v: row["V"] || null,
        w: row["W"] || null,
        x: row["X"] || null,
        y: row["Y"] || null,
        z: row["Z"] || null,
      }));

      // Lưu dữ liệu vào DB
      await this.fileService.createFile(records);

      return {
        message: "Tải lên và lưu dữ liệu thành công.",
        fileName,
        fileUrl,
        totalRecords: records.length,
      };
    } catch (error) {
      console.log("Lỗi khi xử lý file Excel:", error);
      throw new BadRequestException("Lỗi khi tải lên hoặc xử lý file Excel.");
    }
  }


  @Get("get-data/:filename")
  @ApiOperation({ summary: "Lấy dữ liệu từ file Excel theo tên file" })
  async getDataByFilename(@Param("filename") filename: string) {
    try {
      console.log(filename)
      if (!filename) {
        throw new BadRequestException("Filename is required.");
      }

      // Tìm tất cả các dòng trong DB theo filename
      const records = await this.fileService.getFileByFilename(filename);
      if (records.length === 0) {
        throw new BadRequestException(
          `Không tìm thấy dữ liệu nào cho file: ${filename}`
        );
      }

      return {
        message: `Lấy dữ liệu thành công từ file: ${filename}`,
        totalRecords: records.length,
        data: records.map(record => ({ ...record })),
      };
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      throw new BadRequestException("Lỗi khi lấy dữ liệu từ file.");
    }
  }

  
  @Post("execute")
  @ApiOperation({ summary: "Thực thi stored procedure với filename" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        filename: { type: "string", example: "data.xls" },
        spname: { type: "string", example: "sp_process_file" },
      },
    },
  })

  async executeProcedure(@Body() body: { filename: string; spname: string }) {
    try {
      const { filename, spname } = body;

      if (!filename || !spname) {
        throw new BadRequestException("Thiếu filename hoặc spname");
      }

      // Gọi stored procedure từ UploadFileService
      const result = await this.uploadFileService.executeProcedure(spname, filename);

      return {
        message: `Thực thi thành công: ${spname} với file ${filename}`,
        data: result,
      };
    } catch (error) {
      console.error("Lỗi khi thực thi stored procedure:", error);
      throw new BadRequestException("Lỗi khi thực thi stored procedure.");
    }
  }
}
