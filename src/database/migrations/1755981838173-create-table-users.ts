import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1755981838173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "realm_name" character varying,
                "credentials_email" character varying,
                "credentials_login" character varying NOT NULL,
                "credentials_password" character varying,
                "name_last" character varying NOT NULL,
                "name_first" character varying NOT NULL,
                "name_patronymic" character varying NOT NULL,
                "address_city" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "uq_users_credentials_email" UNIQUE ("credentials_email"),
                CONSTRAINT "uq_users_credentials_login" UNIQUE ("credentials_login"),
                CONSTRAINT "pk_user_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_user_realm" FOREIGN KEY ("realm_name") REFERENCES "realms"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_user_realm"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
  }
}
