import { Module,} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from "@nestjs/platform-express";
import { IngestionModule } from './ingestion/ingestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".devo_env",
      isGlobal: true
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
    IngestionModule,
  ],
})


export class AppModule {}
