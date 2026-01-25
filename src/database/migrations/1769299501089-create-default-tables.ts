import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultTables1769299501089 implements MigrationInterface {
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
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "realm_name" character varying,
                "credentials_email" character varying,
                "credentials_login" character varying NOT NULL,
                "credentials_password" character varying,
                "name_last" character varying NOT NULL,
                "name_first" character varying NOT NULL,
                "name_patronymic" character varying NOT NULL,
                "address_city" character varying NOT NULL,
                "profile_birthday" TIMESTAMP WITH TIME ZONE,
                CONSTRAINT "UQ_61c4e7a20183af34ebf41fd2293" UNIQUE ("credentials_email"),
                CONSTRAINT "UQ_b480d5538aa804122ef0c705ed0" UNIQUE ("credentials_login"),
                CONSTRAINT "pk_user_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" character varying NOT NULL,
                "realm_name" character varying,
                CONSTRAINT "pk_clients_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid,
                "client_id" character varying,
                CONSTRAINT "pk_sessions_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "authorization_codes" (
                "code" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "redirect_uri" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "realm_name" character varying,
                "user_id" uuid,
                "client_id" character varying,
                CONSTRAINT "pk_authorization_codes_id" PRIMARY KEY ("code")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "fk_user_realm" FOREIGN KEY ("realm_name") REFERENCES "realms"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "clients"
            ADD CONSTRAINT "FK_f18796e8d7187f197bc38a7fc78" FOREIGN KEY ("realm_name") REFERENCES "realms"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions"
            ADD CONSTRAINT "FK_7af6ac1cd093d361012865a0a48" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_7af6ac1cd093d361012865a0a48"
        `);
    await queryRunner.query(`
            ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"
        `);
    await queryRunner.query(`
            ALTER TABLE "clients" DROP CONSTRAINT "FK_f18796e8d7187f197bc38a7fc78"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "fk_user_realm"
        `);
    await queryRunner.query(`
            DROP TABLE "authorization_codes"
        `);
    await queryRunner.query(`
            DROP TABLE "sessions"
        `);
    await queryRunner.query(`
            DROP TABLE "clients"
        `);
    await queryRunner.query(`
            DROP TABLE "users"
        `);
    await queryRunner.query(`
            DROP TABLE "realms"
        `);
  }
}
