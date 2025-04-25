import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as archiver from 'archiver';
import { Response } from 'express';
import { CategoryService } from 'src/category/category.service';
import { FirebaseRepository } from 'src/firebase/firebase.repository';
import { LessonService } from 'src/lesson/lesson.service';

type Menu = {
  name: string;
  slug: string;
  lessons: {
    slug: string;
    title: string;
  }[];
};

@Injectable()
export class FeatureService {
  constructor(
    private readonly firebaseRepo: FirebaseRepository,
    private readonly categoryService: CategoryService,
    private readonly lessonService: LessonService,
  ) {}

  uploadImage(file: Express.Multer.File): Promise<{ link: string }> {
    if (!file) {
      throw new BadRequestException();
    }

    const blob = this.firebaseRepo.bucket.file(
      'media/' + Date.now() + '_' + file.originalname,
    );

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(new InternalServerErrorException(err.message));
      });

      blobStream.on('finish', async () => {
        try {
          await blob.makePublic();
          const publicUrl = `https://storage.googleapis.com/${this.firebaseRepo.bucket.name}/${blob.name}`;
          resolve({ link: publicUrl });
        } catch (err) {
          reject(new InternalServerErrorException(err.message));
        }
      });

      blobStream.end(file.buffer);
    });
  }

  async getImages() {
    const [files] = await this.firebaseRepo.bucket.getFiles({
      prefix: 'media/',
    });

    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.webp',
      '.bmp',
      '.svg',
    ];

    const imageFiles = files.filter((file) =>
      imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)),
    );

    return imageFiles.map(
      (file) =>
        `https://storage.googleapis.com/${this.firebaseRepo.bucket.name}/${file.name}`,
    );
  }

  async streamLessonsZip(res: Response) {
    const categories = await this.categoryService.findAll();
    const lessons = await this.lessonService.findAll();

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    const menu: Menu[] = categories.map(({ name, slug }) => ({
      name,
      slug,
      lessons: lessons
        .filter((l) => l.categorySlug === slug)
        .map(({ slug, title }) => ({ slug, title })),
    }));

    archive.append(JSON.stringify(menu, null, 2), { name: 'menu.json' });

    for (const lesson of lessons) {
      const filename = `${lesson.categorySlug}.${lesson.slug}.json`;

      const response = await fetch(lesson.contentPath);
      if (!response.ok) throw new Error('Failed to fetch markdown');

      const markdownContent = await response.text();

      const result = {
        slug: lesson.slug,
        title: lesson.title,
        categorySlug: lesson.categorySlug,
        categoryName: lesson.categoryName,
        cover: lesson.cover,
        content: markdownContent,
      };

      archive.append(JSON.stringify(result, null, 2), { name: filename });
    }

    await archive.finalize();
  }
}
