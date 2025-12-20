 import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
	implements OnModuleInit, OnModuleDestroy {
	async onModuleInit() {
	await this.$connect();
	console.log('[Prisma connected], Successfully connected to the database');
	const dbUrl = process.env.DATABASE_URL;
	if (dbUrl){
		const hostInfo = dbUrl.split('@')[1] || dbUrl; 
        console.log(`[PRISMA INFO] Connecting to host: ${hostInfo.split('/')[0]}`);
	}
	}

	async onModuleDestroy() {
	await this.$disconnect();
	}
}