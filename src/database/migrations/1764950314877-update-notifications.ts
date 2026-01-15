import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNotifications1764950314877 implements MigrationInterface {
  name = 'UpdateNotifications1764950314877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD "project" character varying NOT NULL DEFAULT 'ECPP'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP COLUMN "project"
        `);
  }
}
