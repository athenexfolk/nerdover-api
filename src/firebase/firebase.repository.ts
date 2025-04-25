import { Inject, Injectable } from '@nestjs/common';
import { app } from 'firebase-admin';
import type { Bucket } from '@google-cloud/storage';
import { Readable } from 'stream';

@Injectable()
export class FirebaseRepository {
  #db: FirebaseFirestore.Firestore;
  bucket: Bucket;
  categories: FirebaseFirestore.CollectionReference;
  lessons: FirebaseFirestore.CollectionReference;
  users: FirebaseFirestore.CollectionReference;

  constructor(@Inject('FIREBASE_APP') firebaseApp: app.App) {
    this.#db = firebaseApp.firestore();
    this.bucket = firebaseApp.storage().bucket();
    this.categories = this.#db.collection('category');
    this.lessons = this.#db.collection('lesson');
    this.users = this.#db.collection('user');
  }

  async uploadMarkdownToBucket(path: string, content: string): Promise<string> {
    const file = this.bucket.file(path);

    const stream = new Readable();
    stream.push(content, 'utf8');
    stream.push(null);

    const blobStream = file.createWriteStream({
      metadata: {
        contentType: 'text/markdown; charset=utf-8',
        cacheControl: 'public, max-age=3600',
        // cacheControl: 'no-cache',
      },
    });

    await new Promise<void>((resolve, reject) => {
      blobStream.on('finish', async () => {
        await file.makePublic();
        resolve();
      });
      blobStream.on('error', reject);
      stream.pipe(blobStream);
    });

    return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
  }
}
