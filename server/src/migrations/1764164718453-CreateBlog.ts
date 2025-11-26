import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlog1764164718453 implements MigrationInterface {
    name = 'CreateBlog1764164718453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "blogs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "blogs" character varying NOT NULL`);
    }

}
