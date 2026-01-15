import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventsTable1760804648999 implements MigrationInterface {
  name = 'UpdateEventsTable1760804648999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD "notify_at_repeat" TIMESTAMP WITH TIME ZONE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP COLUMN "notify_at_repeat"
        `);
  }
}
