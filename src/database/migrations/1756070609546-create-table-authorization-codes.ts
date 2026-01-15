import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAuthorizationCodes1756070609546
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "authorization_codes" (
                "code" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "redirect_uri" character varying NOT NULL,
                "realm_name" character varying,
                "user_id" uuid,
                "client_id" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "pk_authorization_codes_id" PRIMARY KEY ("code")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "authorization_codes"
            ADD CONSTRAINT "FK_d15de76ca8f38840ec76c6011eb" FOREIGN KEY ("realm_name") REFERENCES "realms"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "authorization_codes"
            ADD CONSTRAINT "FK_68f8ccfda6bb17fb159cc965cce" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "authorization_codes"
            ADD CONSTRAINT "FK_9b6780f6c2ce73987f7cabb4ae3" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "authorization_codes" DROP CONSTRAINT "FK_9b6780f6c2ce73987f7cabb4ae3"
        `);
    await queryRunner.query(`
            ALTER TABLE "authorization_codes" DROP CONSTRAINT "FK_68f8ccfda6bb17fb159cc965cce"
        `);
    await queryRunner.query(`
            ALTER TABLE "authorization_codes" DROP CONSTRAINT "FK_d15de76ca8f38840ec76c6011eb"
        `);
    await queryRunner.query(`
            DROP TABLE "authorization_codes"
        `);
  }
}
