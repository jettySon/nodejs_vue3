// src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 환경 변수 로드 (이미 index.ts에서 로드했다면 생략 가능)
dotenv.config();

// 환경 변수 값 확인
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT || '3306';

// 환경 변수가 없을 경우 경고
if (!dbHost || !dbUser || !dbName) {
    console.warn('환경 변수가 설정되지 않았습니다. 기본값을 사용합니다.');
}

// Sequelize 인스턴스 생성
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: dbHost || 'localhost',
    username: dbUser || 'root',
    password: dbPassword || '',
    database: dbName || 'human_site',
    port: parseInt(dbPort, 10),
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    timezone: '+09:00', // 한국 시간대 설정
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        timestamps: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// 데이터베이스 연결 테스트 함수
export const testConnection = async (): Promise<boolean> => {
    try {
        await sequelize.authenticate();
        console.log('데이터베이스 연결에 성공했습니다.');
        return true;
    } catch (error) {
        console.error('데이터베이스 연결에 실패했습니다:', error);
        return false;
    }
};

// Sequelize 트랜잭션 함수
export const withTransaction = async <T>(
    callback: (transaction: any) => Promise<T>
): Promise<T> => {
    const transaction = await sequelize.transaction();
    try {
        const result = await callback(transaction);
        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export default sequelize;