import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableHives1758488334629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "hives" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "number" integer NOT NULL,
                "is_smart" boolean NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "apiary_id" uuid,
                CONSTRAINT "PK_13f78fa14c9647be8dca0b4c305" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD CONSTRAINT "FK_6c39b0098678721e4bea1d181fc" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives" DROP CONSTRAINT "FK_6c39b0098678721e4bea1d181fc"
        `);
    await queryRunner.query(`
            DROP TABLE "hives"
        `);
  }
}
