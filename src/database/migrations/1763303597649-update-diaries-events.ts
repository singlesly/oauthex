import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDiariesEvents1763303597649 implements MigrationInterface {
  name = 'UpdateDiariesEvents1763303597649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD "diary_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD CONSTRAINT "FK_c2cadfa5577f3364c8467c8577a" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP CONSTRAINT "FK_c2cadfa5577f3364c8467c8577a"
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP COLUMN "diary_id"
        `);
  }
}
