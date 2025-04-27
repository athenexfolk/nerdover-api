import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.ALLOWED_URL || 'http://localhost:4200'],
    methods: '*',
    allowedHeaders: 'Content-Type,Cache-Control,Authorization',
  });

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Nerdover API')
      .setDescription('The Nerdover API description')
      .setVersion('1.0')
      .addServer('http://localhost:3000')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
