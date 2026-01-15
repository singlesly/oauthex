import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHiveDictionaries1760634877698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "hives_dictionaries" (
                "hives_id" uuid NOT NULL,
                "dictionaries_id" uuid NOT NULL,
                CONSTRAINT "PK_54411cb5bfa9d119ee6c1047ca3" PRIMARY KEY ("hives_id", "dictionaries_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f372bf85c093969bf6c5c8db42" ON "hives_dictionaries" ("hives_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_aa4890fb68ffac4e1b898af614" ON "hives_dictionaries" ("dictionaries_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "hives_dictionaries"
            ADD CONSTRAINT "FK_f372bf85c093969bf6c5c8db42b" FOREIGN KEY ("hives_id") REFERENCES "hives"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "hives_dictionaries"
            ADD CONSTRAINT "FK_aa4890fb68ffac4e1b898af614b" FOREIGN KEY ("dictionaries_id") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives_dictionaries" DROP CONSTRAINT "FK_aa4890fb68ffac4e1b898af614b"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives_dictionaries" DROP CONSTRAINT "FK_f372bf85c093969bf6c5c8db42b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_aa4890fb68ffac4e1b898af614"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f372bf85c093969bf6c5c8db42"
        `);
    await queryRunner.query(`
            DROP TABLE "hives_dictionaries"
        `);
  }
}
