import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtTags1763733709725 implements MigrationInterface {
    name = 'AddCreatedAtTags1763733709725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "createdAt"`);
    }

}
