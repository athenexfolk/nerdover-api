import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema, type ZodError } from 'zod';

export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodSchema<unknown>) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (err) {
      const errorMessage = (err as ZodError).errors
        .map((e) => e.message)
        .join(', ');
      throw new BadRequestException(errorMessage);
    }
  }
}
