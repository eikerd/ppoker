import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { SessionGateway } from './session.gateway';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, SessionGateway],
  exports: [SessionService],
})
export class SessionModule {}
