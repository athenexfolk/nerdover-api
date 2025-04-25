import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateLessonDto,
  Lesson,
  UpdateLessonDto,
} from 'src/common/models/lesson';
import { FirebaseRepository } from 'src/firebase/firebase.repository';

@Injectable()
export class LessonService {
  constructor(private readonly firebaseRepo: FirebaseRepository) {}

  async create({ slug, categorySlug, title, cover }: CreateLessonDto) {
    const categoryRef = this.firebaseRepo.categories.doc(categorySlug);
    const category = await categoryRef.get();

    if (!category.exists) {
      throw new NotFoundException();
    }

    const docRef = this.firebaseRepo.lessons.doc(slug);
    const lesson = await docRef.get();

    if (lesson.exists) {
      throw new ConflictException();
    }

    const publicUrl = await this.firebaseRepo.uploadMarkdownToBucket(
      `content/${categorySlug}.${slug}.md`,
      `# ${title}`,
    );

    const newLesson: Lesson = {
      title: title.trim(),
      slug,
      categorySlug,
      categoryName: category.data()!.name,
      contentPath: publicUrl,
    };

    if (cover) {
      newLesson.cover = cover;
    }

    await docRef.set(newLesson);
  }

  async findAll() {
    const lessons = (await this.firebaseRepo.lessons.get()).docs.map((d) =>
      d.data(),
    ) as Lesson[];

    return lessons;
  }

  async findOne(slug: string) {
    const docRef = this.firebaseRepo.lessons.doc(slug);
    const lesson = await docRef.get();

    if (!lesson.exists) {
      throw new NotFoundException();
    }

    const data = lesson.data();

    if (!data || !('contentPath' in data)) {
      throw new ConflictException();
    }

    const response = await fetch(data.contentPath);
    if (!response.ok) throw new BadRequestException();

    const markdownContent = await response.text();

    return {
      slug,
      title: data.title,
      categorySlug: data.categorySlug,
      categoryName: data.categoryName,
      cover: data.cover,
      content: markdownContent,
    };
  }

  async update(slug: string, { title, cover }: UpdateLessonDto) {
    const docRef = this.firebaseRepo.lessons.doc(slug);
    const lesson = await docRef.get();

    if (!lesson.exists) {
      throw new NotFoundException();
    }

    const updatedLesson: UpdateLessonDto = {};

    if (title) {
      updatedLesson.title = title;
    }

    if (cover) {
      updatedLesson.cover = cover;
    }

    await docRef.update(updatedLesson);
  }

  async updateContent(slug: string, { content }: { content: string }) {
    const docRef = this.firebaseRepo.lessons.doc(slug);
    const lesson = await docRef.get();

    if (!lesson.exists) {
      throw new NotFoundException();
    }

    const data = lesson.data();

    if (!data || !('slug' in data) || !('categorySlug' in data)) {
      throw new ConflictException();
    }

    await this.firebaseRepo.uploadMarkdownToBucket(
      `content/${data.categorySlug}.${data.slug}.md`,
      content,
    );
  }

  async remove(slug: string) {
    const docRef = this.firebaseRepo.lessons.doc(slug);
    const lesson = await docRef.get();

    if (!lesson.exists) {
      throw new NotFoundException();
    }

    await docRef.delete();
  }
}
