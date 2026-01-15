import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableApiaries1757624998719 implements MigrationInterface {
  name = 'CreateTableApiaries1757624998719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "apiaries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "number" integer NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "owner_id" uuid,
                "coordinates_latitude" character varying NOT NULL,
                "coordinates_longitude" character varying NOT NULL,
                CONSTRAINT "PK_00177fd04a20af565e083dcc44f" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "apiaries"."coordinates_latitude" IS 'широта';
            COMMENT ON COLUMN "apiaries"."coordinates_longitude" IS 'долгота'
        `);
    await queryRunner.query(`
            ALTER TABLE "apiaries"
            ADD CONSTRAINT "FK_302c1b2f194aa9370aad7f24c7c" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "apiaries" DROP CONSTRAINT "FK_302c1b2f194aa9370aad7f24c7c"
        `);
    await queryRunner.query(`
            DROP TABLE "apiaries"
        `);
  }
}
