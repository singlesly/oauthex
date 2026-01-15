import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableCustomFieldsDateNumberDictionaryString1763418600256
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "custom_fields" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "type" character varying NOT NULL,
                "dictionary_type" character varying,
                CONSTRAINT "PK_35ab958a0baec2e0b2b2b875fdb" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "custom_field_values_string" (
                "field_id" uuid NOT NULL,
                "diary_id" uuid NOT NULL,
                "value" text,
                CONSTRAINT "PK_1c1e74687bc8375afe0bb5bd76d" PRIMARY KEY ("field_id", "diary_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "custom_field_values_dictionary" (
                "field_id" uuid NOT NULL,
                "diary_id" uuid NOT NULL,
                CONSTRAINT "PK_8743006ecc4dcb7dc1d29c0039d" PRIMARY KEY ("field_id", "diary_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "custom_field_values_number" (
                "field_id" uuid NOT NULL,
                "diary_id" uuid NOT NULL,
                "value" numeric,
                CONSTRAINT "PK_ffa696da574f92c43141acb00a4" PRIMARY KEY ("field_id", "diary_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "custom_field_values_date" (
                "field_id" uuid NOT NULL,
                "diary_id" uuid NOT NULL,
                "value" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "PK_69dc0fd23e75d4bc358eba0da95" PRIMARY KEY ("field_id", "diary_id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "custom_field_values_dictionaries_references" (
                "custom_field_values_dictionary_field_id" uuid NOT NULL,
                "custom_field_values_dictionary_diary_id" uuid NOT NULL,
                "dictionaries_id" uuid NOT NULL,
                CONSTRAINT "PK_84963c4b10124a4b174a38b7e4e" PRIMARY KEY (
                    "custom_field_values_dictionary_field_id",
                    "custom_field_values_dictionary_diary_id",
                    "dictionaries_id"
                )
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_46d2b55b88a11aa4dc5e0e6066" ON "custom_field_values_dictionaries_references" (
                "custom_field_values_dictionary_field_id",
                "custom_field_values_dictionary_diary_id"
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_eb43e21986062c0c17e3254e4b" ON "custom_field_values_dictionaries_references" ("dictionaries_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_string"
            ADD CONSTRAINT "FK_34ce4088ab8439b52e0458156f1" FOREIGN KEY ("field_id") REFERENCES "custom_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_string"
            ADD CONSTRAINT "FK_ab598ea712cf0925b8adea4c6f6" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionary"
            ADD CONSTRAINT "FK_156327fce87d274bff43fe1d411" FOREIGN KEY ("field_id") REFERENCES "custom_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionary"
            ADD CONSTRAINT "FK_7ba888f8bd88341b777b8135925" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_number"
            ADD CONSTRAINT "FK_df08697cee142e41da932fe9374" FOREIGN KEY ("field_id") REFERENCES "custom_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_number"
            ADD CONSTRAINT "FK_d1938367bfa414384ae9093431a" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_date"
            ADD CONSTRAINT "FK_f10fb78b31dbd15066481860a5d" FOREIGN KEY ("field_id") REFERENCES "custom_fields"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_date"
            ADD CONSTRAINT "FK_69aec48c8e37e13efaf606ed0ab" FOREIGN KEY ("diary_id") REFERENCES "diaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionaries_references"
            ADD CONSTRAINT "FK_46d2b55b88a11aa4dc5e0e6066a" FOREIGN KEY (
                    "custom_field_values_dictionary_field_id",
                    "custom_field_values_dictionary_diary_id"
                ) REFERENCES "custom_field_values_dictionary"("field_id", "diary_id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionaries_references"
            ADD CONSTRAINT "FK_eb43e21986062c0c17e3254e4bd" FOREIGN KEY ("dictionaries_id") REFERENCES "dictionaries"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionaries_references" DROP CONSTRAINT "FK_eb43e21986062c0c17e3254e4bd"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionaries_references" DROP CONSTRAINT "FK_46d2b55b88a11aa4dc5e0e6066a"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_date" DROP CONSTRAINT "FK_69aec48c8e37e13efaf606ed0ab"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_date" DROP CONSTRAINT "FK_f10fb78b31dbd15066481860a5d"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_number" DROP CONSTRAINT "FK_d1938367bfa414384ae9093431a"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_number" DROP CONSTRAINT "FK_df08697cee142e41da932fe9374"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionary" DROP CONSTRAINT "FK_7ba888f8bd88341b777b8135925"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_dictionary" DROP CONSTRAINT "FK_156327fce87d274bff43fe1d411"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_string" DROP CONSTRAINT "FK_ab598ea712cf0925b8adea4c6f6"
        `);
    await queryRunner.query(`
            ALTER TABLE "custom_field_values_string" DROP CONSTRAINT "FK_34ce4088ab8439b52e0458156f1"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_eb43e21986062c0c17e3254e4b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_46d2b55b88a11aa4dc5e0e6066"
        `);
    await queryRunner.query(`
            DROP TABLE "custom_field_values_dictionaries_references"
        `);
    await queryRunner.query(`
            DROP TABLE "custom_field_values_date"
        `);
    await queryRunner.query(`
            DROP TABLE "custom_field_values_number"
        `);
    await queryRunner.query(`
            DROP TABLE "custom_field_values_dictionary"
        `);
    await queryRunner.query(`
            DROP TABLE "custom_field_values_string"
        `);
    await queryRunner.query(`
            DROP TABLE "custom_fields"
        `);
  }
}
