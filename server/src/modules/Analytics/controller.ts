import { Request, Response } from "express";
import prisma from "../../interfaces/Prisma";

export default class AnalyticsController {
    public async getAnalytics(req: Request, res: Response) {
        const [accessCountForLast1Minutes, accessCountForLast1Hours, accessCountForLast24Hours, top5UserAgent] = await prisma.$transaction([
            prisma.linkAccess.count({
                where: {
                    createdAt: {
                        gt: new Date(new Date().getTime() - 60 * 1000)
                    }
                }
            }),
            prisma.linkAccess.count({
                where: {
                    createdAt: {
                        gt: new Date(new Date().getTime() - 60 * 60 * 1000)
                    }
                }
            }),
            prisma.linkAccess.count({
                where: {
                    createdAt: {
                        gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                    }
                }
            }),
            prisma.linkAccess.groupBy({
                by: ['userAgent'],
                where: {
                    createdAt: {
                        gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
                    }
                },
                _count: {
                    _all: true
                },
                orderBy: {
                    _count: {
                        userAgent: 'desc'
                    }
                }
            })

        ]);


        return res.send({
            message: { accessCountForLast1Minutes, accessCountForLast1Hours, accessCountForLast24Hours,top5UserAgent }
        });
    }
}