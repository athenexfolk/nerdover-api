import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateCategoryDto,
  Category,
  UpdateCategoryDto,
} from 'src/common/models/category';
import { FirebaseRepository } from 'src/firebase/firebase.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly firebaseRepo: FirebaseRepository) {}

  async create({ name, slug }: CreateCategoryDto) {
    const docRef = this.firebaseRepo.categories.doc(slug);
    const category = await docRef.get();

    if (category.exists) {
      throw new ConflictException();
    }

    await docRef.set({ slug, name });
  }

  async findAll() {
    const categories = (await this.firebaseRepo.categories.get()).docs.map(
      (d) => d.data(),
    ) as Category[];

    return categories;
  }

  async findOne(slug: string) {
    const docRef = this.firebaseRepo.categories.doc(slug);
    const category = await docRef.get();

    if (!category.exists) {
      throw new NotFoundException();
    }

    return category.data() as Category;
  }

  async update(slug: string, { name }: UpdateCategoryDto) {
    const docRef = this.firebaseRepo.categories.doc(slug);
    const category = await docRef.get();

    if (!category.exists) {
      throw new NotFoundException();
    }

    await docRef.update({ name });
  }

  async remove(slug: string) {
    const docRef = this.firebaseRepo.categories.doc(slug);
    const category = await docRef.get();

    if (!category.exists) {
      throw new NotFoundException();
    }

    await docRef.delete();
  }
}
