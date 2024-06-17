import { HttpException } from '@nestjs/common';
import { REVIEW_EXISTED } from '../constants';

export class ReviewExistedException extends HttpException {
  constructor(msg?: string) {
    super(msg || REVIEW_EXISTED, 400);
  }
}
