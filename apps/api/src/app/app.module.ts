import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'dist', 'apps', 'planning-poker', 'browser'),
      exclude: ['/api*'],
    }),
    SessionModule,
  ],
})
export class AppModule {}
