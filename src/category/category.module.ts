import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
