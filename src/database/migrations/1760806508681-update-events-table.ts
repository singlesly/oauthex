import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventsTable1760806508681 implements MigrationInterface {
  name = 'UpdateEventsTable1760806508681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP CONSTRAINT "FK_c043f8dfaf7cca403a123ed7f61"
        `);
    await queryRunner.query(`
            CREATE TABLE "event_hives" (
                "event_id" uuid NOT NULL,
                "hive_id" uuid NOT NULL,
                CONSTRAINT "PK_7d7a7a5640c2c3464130c13f68e" PRIMARY KEY ("event_id", "hive_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_1c29d1a3065bae232ebeef267e" ON "event_hives" ("event_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ec5be73fd3f35b71797cc6f747" ON "event_hives" ("hive_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP COLUMN "hive_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "event_hives"
            ADD CONSTRAINT "FK_1c29d1a3065bae232ebeef267e8" FOREIGN KEY ("event_id") REFERENCES "calendar_events"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "event_hives"
            ADD CONSTRAINT "FK_ec5be73fd3f35b71797cc6f7472" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "event_hives" DROP CONSTRAINT "FK_ec5be73fd3f35b71797cc6f7472"
        `);
    await queryRunner.query(`
            ALTER TABLE "event_hives" DROP CONSTRAINT "FK_1c29d1a3065bae232ebeef267e8"
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD "hive_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ec5be73fd3f35b71797cc6f747"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1c29d1a3065bae232ebeef267e"
        `);
    await queryRunner.query(`
            DROP TABLE "event_hives"
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD CONSTRAINT "FK_c043f8dfaf7cca403a123ed7f61" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
  }
}
