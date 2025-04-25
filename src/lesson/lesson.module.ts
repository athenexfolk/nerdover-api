import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
