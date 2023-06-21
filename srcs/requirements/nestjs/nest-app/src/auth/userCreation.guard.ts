import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserCreationGuard extends AuthGuard('JwtCreationStrategy') {}