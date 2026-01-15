import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRealms1755938946719 implements MigrationInterface {
  name = 'CreateTableRealms1755938946719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "realms" (
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "pk_realm_name" PRIMARY KEY ("name")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "realms"
        `);
  }
}
