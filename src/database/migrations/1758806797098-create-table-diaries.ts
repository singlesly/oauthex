import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableDiaries1758806797098 implements MigrationInterface {
  name = 'CreateTableDiaries1758806797098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "diaries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "frames" integer NOT NULL,
                "strength" integer NOT NULL,
                "brood" integer NOT NULL,
                "note" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "hive_id" uuid,
                "author_id" uuid,
                CONSTRAINT "PK_ffd738e7d40dcfa59283dcaae87" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "diaries_dictionaries" (
                "diaries_id" uuid NOT NULL,
                "dictionaries_id" uuid NOT NULL,
                CONSTRAINT "PK_7e4b78b645719ca10ad55e18281" PRIMARY KEY ("diaries_id", "dictionaries_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_1f678eb4bd0da7a9101d14ec0a" ON "diaries_dictionaries" ("diaries_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_68c7c9899bafce06edcb9eaf1b" ON "diaries_dictionaries" ("dictionaries_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries"
            ADD CONSTRAINT "FK_e2719ce2a3e4737f21901e78a87" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries"
            ADD CONSTRAINT "FK_c5f24123452d697e0dbe8766391" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries_dictionaries"
            ADD CONSTRAINT "FK_1f678eb4bd0da7a9101d14ec0aa" FOREIGN KEY ("diaries_id") REFERENCES "diaries"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries_dictionaries"
            ADD CONSTRAINT "FK_68c7c9899bafce06edcb9eaf1ba" FOREIGN KEY ("dictionaries_id") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "diaries_dictionaries" DROP CONSTRAINT "FK_68c7c9899bafce06edcb9eaf1ba"
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries_dictionaries" DROP CONSTRAINT "FK_1f678eb4bd0da7a9101d14ec0aa"
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries" DROP CONSTRAINT "FK_c5f24123452d697e0dbe8766391"
        `);
    await queryRunner.query(`
            ALTER TABLE "diaries" DROP CONSTRAINT "FK_e2719ce2a3e4737f21901e78a87"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_68c7c9899bafce06edcb9eaf1b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1f678eb4bd0da7a9101d14ec0a"
        `);
    await queryRunner.query(`
            DROP TABLE "diaries_dictionaries"
        `);
    await queryRunner.query(`
            DROP TABLE "diaries"
        `);
  }
}
