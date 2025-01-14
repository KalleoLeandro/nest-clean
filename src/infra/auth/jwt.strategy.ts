import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

import { z } from "zod";
import { Env } from "../env/env";

const tokenSchema = z.object({
    sub: z.string().uuid()
});

export type TokenSchema  = z.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(config: ConfigService<Env, true>){
        const publicKey = config.get("JWT_PUBLIC_KEY", { infer:true });
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: Buffer.from(publicKey, 'base64'),
            algorithms: ['RS256']
        });
    }

    async validate(payload: TokenSchema){
        return tokenSchema.parse(payload);
    }
}