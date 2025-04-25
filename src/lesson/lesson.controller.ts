import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  CreateLessonSchema,
  UpdateLessonSchema,
  type CreateLessonDto,
  type UpdateLessonDto,
} from 'src/common/models/lesson';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { slugSchema } from 'src/common/models/base';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UsePipes(new ZodPipe(CreateLessonSchema))
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Get(':slug')
  @UsePipes(new ZodPipe(slugSchema))
  findOne(@Param('slug') slug: string) {
    return this.lessonService.findOne(slug);
  }

  @Patch(':slug')
  @UsePipes(new ZodPipe(slugSchema), new ZodPipe(UpdateLessonSchema))
  update(@Param('slug') slug: string, @Body() request: UpdateLessonDto) {
    return this.lessonService.update(slug, request);
  }

  @Patch(':slug/content')
  @UsePipes(new ZodPipe(slugSchema), new ZodPipe(UpdateLessonSchema))
  updateContent(
    @Param('slug') slug: string,
    @Body() request: { content: string },
  ) {
    return this.lessonService.updateContent(slug, request);
  }

  @Delete(':slug')
  @UsePipes(new ZodPipe(slugSchema))
  remove(@Param('slug') slug: string) {
    return this.lessonService.remove(slug);
  }
}
