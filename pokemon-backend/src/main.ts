import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for localhost:4200 (Angular frontend)
  app.enableCors({
    origin: process.env.CORS_BYPASS_URL, // allow requests from your Angular app
    methods: 'GET,POST,PUT,DELETE', // specify allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // specify allowed headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
