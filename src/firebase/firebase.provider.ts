import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

export const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const firebaseConfig: admin.ServiceAccount = {
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      privateKey: configService
        .get<string>('FIREBASE_PRIVATE_KEY')
        ?.replace(/\\n/g, '\n'),
    };

    return admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
      storageBucket: configService.get<string>('FIREBASE_BUCKET'),
    });
  },
};
