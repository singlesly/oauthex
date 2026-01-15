import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiariesAttachmentsRelation1759869994413
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "diaries_attachments" (
                "diaries_id" uuid NOT NULL,
                "attachments_id" uuid NOT NULL,
                CONSTRAINT "PK_00d364c4d00044fd0db846f2d2b" PRIMARY KEY ("diaries_id", "attachments_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_7184e014613eb063fffaa7ddda" ON "diaries_attachments" ("diaries_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_6a713ef8c9776ef60ec861fd1c" ON "diaries_attachments" ("attachments_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries_attachments"
            ADD CONSTRAINT "FK_7184e014613eb063fffaa7dddae" FOREIGN KEY ("diaries_id") REFERENCES "diaries"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries_attachments"
            ADD CONSTRAINT "FK_6a713ef8c9776ef60ec861fd1ce" FOREIGN KEY ("attachments_id") REFERENCES "attachments"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "diaries_attachments" DROP CONSTRAINT "FK_6a713ef8c9776ef60ec861fd1ce"
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries_attachments" DROP CONSTRAINT "FK_7184e014613eb063fffaa7dddae"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_6a713ef8c9776ef60ec861fd1c"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7184e014613eb063fffaa7ddda"
        `);
    await queryRunner.query(`
            DROP TABLE "diaries_attachments"
        `);
  }
}
