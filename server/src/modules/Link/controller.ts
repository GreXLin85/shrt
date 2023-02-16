import { Request, Response } from "express";
import randomstring from "randomstring";
import bcrypt from "bcrypt";
import prisma from "../../interfaces/Prisma";
import { TypedRequestBody } from "../../types/TypedRequestBody";

export default class LinkController {
    // ...
    public async createLink(req: TypedRequestBody<{
        url: string
    }>, res: Response) {
        const url = req.body.url

        if (url.length > 2048) {
            return res.status(400).send({
                message: 'Url is too long'
            })
        }

        if (!new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/g).test(url)) {
            return res.status(400).send({
                message: 'Invalid url'
            })
        }

        let plainSecretToken = randomstring.generate(24)
        let secretToken = await bcrypt.hash(plainSecretToken, 8)

        let link = await prisma.link.create({
            data: {
                url,
                accessToken: randomstring.generate(6),
                secretToken: secretToken
            }
        })

        return res.send({
            message: {
                ...link,
                plainSecretToken
            }
        });
    }

    public async getLink(req: Request, res: Response) {
        let link = await prisma.link.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!link) {
            return res.status(404).send({
                message: 'Link not found'
            })
        }

        await prisma.linkAccess.create({
            data: {
                linkId: link.id,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'] as string
            }
        })
        
        return res.send({
            message: link?.url
        })
    }

    public async deleteLink(req: Request, res: Response) {
        const id = req.params.id;
        const secretToken = req.body.secretToken;

        if (!id || !secretToken) {
            return res.status(400).send({
                message: 'Invalid request'
            })
        }

        const link = await prisma.link.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!link) {
            return res.status(404).send({
                message: 'Link not found'
            })
        }

        let compareTokens = await bcrypt.compare(req.body.secretToken, link.secretToken)

        if (!compareTokens) {
            return res.status(401).send({
                message: 'Invalid secret token'
            })
        }

        await prisma.link.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })

        return res.json({
            message: 'Link deleted'
        })
    }

}