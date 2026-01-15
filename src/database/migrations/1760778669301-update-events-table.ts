import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventsTable1760778669301 implements MigrationInterface {
  name = 'UpdateEventsTable1760778669301';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP COLUMN "created_by"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD "created_by" uuid
        `);
  }
}
