import { Module } from '@nestjs/common';
import { firebaseProvider } from './firebase.provider';
import { FirebaseRepository } from './firebase.repository';

@Module({
  providers: [firebaseProvider, FirebaseRepository],
  exports: [FirebaseRepository],
})
export class FirebaseModule {}
