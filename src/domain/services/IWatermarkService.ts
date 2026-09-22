export interface WatermarkedImage {
  buffer: Buffer;
  mimeType: string;
}

export interface IWatermarkService {
  apply(buffer: Buffer, mimeType: string): Promise<WatermarkedImage>;
}
