import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAttachmentsHive1760863182541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "hives_attachments" (
                "hives_id" uuid NOT NULL,
                "attachments_id" uuid NOT NULL,
                CONSTRAINT "PK_ce595966b38c5b1b5d062b27168" PRIMARY KEY ("hives_id", "attachments_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_d7c0b87f9305230be70d4af3bd" ON "hives_attachments" ("hives_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_08e58dd895f678d20c87224c58" ON "hives_attachments" ("attachments_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "hives_attachments"
            ADD CONSTRAINT "FK_d7c0b87f9305230be70d4af3bdd" FOREIGN KEY ("hives_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "hives_attachments"
            ADD CONSTRAINT "FK_08e58dd895f678d20c87224c58a" FOREIGN KEY ("attachments_id") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives_attachments" DROP CONSTRAINT "FK_08e58dd895f678d20c87224c58a"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives_attachments" DROP CONSTRAINT "FK_d7c0b87f9305230be70d4af3bdd"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_08e58dd895f678d20c87224c58"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_d7c0b87f9305230be70d4af3bd"
        `);
    await queryRunner.query(`
            DROP TABLE "hives_attachments"
        `);
  }
}
