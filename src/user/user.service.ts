import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from 'src/common/models/user';
import { FirebaseRepository } from 'src/firebase/firebase.repository';

@Injectable()
export class UserService {
  constructor(private readonly firebaseRepo: FirebaseRepository) {}

  async create({ email, name }: User) {
    const user = await this.firebaseRepo.users
      .where('email', '==', email)
      .get();

    if (!user.empty) {
      throw new ConflictException();
    }

    const docRef = this.firebaseRepo.users.doc();
    await docRef.set({ name, email });
  }

  async findOneByEmail(email: string) {
    const user = await this.firebaseRepo.users
      .where('email', '==', email)
      .get();

    if (user.empty) {
      throw new NotFoundException();
    }

    return user.docs[0].data();
  }
}
