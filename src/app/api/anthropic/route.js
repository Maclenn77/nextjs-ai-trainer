import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

async function sendRequest (payload) {
    const msg = await anthropic.messages.create(payload);
    console.log("waiting for response...")
    return msg
}


export async function POST(req, res) {
    console.log('POST request received')

    const payload = await req.json()

    const response = await sendRequest(payload)
    console.log("response received")
    return NextResponse.json(response['content'][0]['text'])


}