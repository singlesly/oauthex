import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableInvites1763318860277 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "invites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "apiary_id" uuid,
                "user_id" uuid,
                CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "invites"
            ADD CONSTRAINT "FK_1404f2afcec0046fc4646714d55" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "invites"
            ADD CONSTRAINT "FK_188bacba32eb63b759f3578dd5b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "invites" DROP CONSTRAINT "FK_188bacba32eb63b759f3578dd5b"
        `);
    await queryRunner.query(`
            ALTER TABLE "invites" DROP CONSTRAINT "FK_1404f2afcec0046fc4646714d55"
        `);
    await queryRunner.query(`
            DROP TABLE "invites"
        `);
  }
}
