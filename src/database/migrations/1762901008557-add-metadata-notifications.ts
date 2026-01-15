import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetadataNotifications1762901008557
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "metadata" jsonb NOT NULL DEFAULT '{}'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "metadata"
        `);
  }
}
