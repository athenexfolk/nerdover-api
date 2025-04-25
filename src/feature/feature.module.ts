import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CategoryModule } from 'src/category/category.module';
import { LessonModule } from 'src/lesson/lesson.module';

@Module({
  imports: [FirebaseModule, CategoryModule, LessonModule],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
