import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from 'src/common/models/category';
import { slugSchema } from 'src/common/models/base';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ZodPipe(CreateCategorySchema))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  @UsePipes(new ZodPipe(slugSchema))
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug);
  }

  @Patch(':slug')
  @UsePipes(new ZodPipe(slugSchema), new ZodPipe(UpdateCategorySchema))
  update(@Param('slug') slug: string, @Body() request: UpdateCategoryDto) {
    return this.categoryService.update(slug, request);
  }

  @Delete(':slug')
  @UsePipes(new ZodPipe(slugSchema))
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug);
  }
}
