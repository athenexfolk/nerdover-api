import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { CategoryModule } from './category/category.module';
import { LessonModule } from './lesson/lesson.module';
import { FeatureModule } from './feature/feature.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    FirebaseModule,
    CategoryModule,
    LessonModule,
    FeatureModule,
    UserModule,
    AuthModule,
  ],
  exports: [],
})
export class AppModule {}
