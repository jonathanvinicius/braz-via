export default () => ({
  s3: {
    bucket: process.env.S3_BUCKET ?? '',
    region: process.env.S3_REGION ?? 'sa-east-1',
    publicBaseUrl: process.env.S3_PUBLIC_BASE_URL ?? '',
    propertiesPrefix: process.env.S3_PROPERTIES_PREFIX ?? 'properties',
    maxUploadBytes: parseInt(process.env.S3_MAX_UPLOAD_BYTES ?? '5242880', 10),
  },
});
