import { HandlerContext, HandlerEvent } from "@netlify/functions";

export default function handler(event: HandlerEvent, context: HandlerContext) {
    return {
        statusCode: 200,
        body: 'Hello'
    }
}