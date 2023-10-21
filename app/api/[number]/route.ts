import fs from "fs"
import path from "path"

export async function GET(request: any, context: { params: any }) {
    const num = context.params.number
    const filePath = path.resolve('scores.json');

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        parseInt(num) && data.scores.push(parseInt(num))

        fs.writeFileSync(filePath, JSON.stringify(data));

        return Response.json({ status: 200, average: data.scores });
    } catch (error) {}
    return Response.json({status: 200})
}